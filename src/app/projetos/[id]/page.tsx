"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight, X, ZoomIn, Play, Pause, Maximize } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import WhatsAppButton from '../../../components/WhatsAppButton';
import { Project } from '../../../types/project';
import { mockProjects } from '../../../data/mock';
import { supabase } from '../../../lib/supabase';
import { parseImageUrls, isVideo } from '../../../components/ProjectCard';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';


export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Custom video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    async function fetchProject() {
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

        if (supabase && isUUID) {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

          if (error) console.error('Supabase fetch failed:', error.message);

          if (data) {
            setProject(data as Project);
          } else {
            const mock = mockProjects.find(p => p.id === id);
            if (mock) setProject(mock);
            else router.push('/admin');
          }
        } else {
          const mock = mockProjects.find(p => p.id === id);
          if (mock) setProject(mock);
          else router.push('/admin');
        }
      } catch (error: any) {
        console.error('Error fetching project:', error?.message || error);
        const mock = mockProjects.find(p => p.id === id);
        if (mock) setProject(mock);
        else router.push('/admin');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, router]);

  // Reset video controls when switching items
  useEffect(() => {
    setVideoProgress(0);
    setIsPlaying(true);
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 1500);
    return () => { if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current); };
  }, [currentIndex]);

  // Keyboard navigation — works always (main gallery) and in lightbox
  useEffect(() => {
    if (!project) return;
    const items = parseImageUrls(project.image_url);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => Math.min(items.length - 1, prev + 1));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [project, isLightboxOpen]);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 1500);
  }, []);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  }, [resetControlsTimer]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
    resetControlsTimer();
  }, [resetControlsTimer]);

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-primary flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-primary flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center px-4 text-center">
          <h1 className="font-serif text-3xl text-secondary mb-4">Projeto não encontrado</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-secondary text-white rounded-sm hover:bg-secondary/90 transition-colors"
          >
            Voltar para o início
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const items = parseImageUrls(project.image_url);
  const currentIsVideo = isVideo(items[currentIndex]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento inspirado no projeto: ${project.title} (${project.category}).`);
    window.open(`https://wa.me/5541999695577?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-primary flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 md:pt-48 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/#portfolio"
            className="flex items-center gap-2 text-neutral hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-wider">Voltar ao Portfólio</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start">
            {/* Image/Video Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-100 shadow-xl group/main ${!currentIsVideo ? 'cursor-zoom-in' : ''}`}
                onClick={() => !currentIsVideo && setIsLightboxOpen(true)}
              >
                {!currentIsVideo && (
                  <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors z-10 flex items-center justify-center pointer-events-none">
                    <ZoomIn className="text-white opacity-0 group-hover/main:opacity-100 transition-opacity w-8 h-8 drop-shadow-md" />
                  </div>
                )}

                <AnimatePresence>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {currentIsVideo ? (
                      <div
                        className="w-full h-full relative"
                        onMouseMove={resetControlsTimer}
                        onTouchStart={resetControlsTimer}
                      >
                        <video
                          ref={videoRef}
                          src={items[currentIndex]}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          onTimeUpdate={() => {
                            if (videoRef.current) {
                              setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0);
                            }
                          }}
                          onClick={togglePlay}
                        />

                        <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

                          {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Play className="w-7 h-7 text-white ml-1" />
                              </div>
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 space-y-2 pointer-events-auto">
                            <div
                              className="w-full h-1 bg-white/30 rounded-full cursor-pointer group/bar"
                              onClick={handleProgressClick}
                            >
                              <div
                                className="h-full bg-white rounded-full group-hover/bar:bg-accent transition-colors"
                                style={{ width: `${videoProgress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors p-1">
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                                className="text-white/80 hover:text-white transition-colors p-1"
                              >
                                <Maximize className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={items[currentIndex]}
                        alt={`${project.title} - Item ${currentIndex + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {items.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goTo(Math.max(0, currentIndex - 1)); }}
                      className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-125 active:scale-95'}`}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goTo(Math.min(items.length - 1, currentIndex + 1)); }}
                      className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white transition-all ${currentIndex === items.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-125 active:scale-95'}`}
                      disabled={currentIndex === items.length - 1}
                    >
                      <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </button>
                  </>
                )}
              </div>

              {items.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
                  {items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`relative aspect-square overflow-hidden rounded-sm transition-all ${currentIndex === idx ? 'ring-2 ring-accent ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {isVideo(item) ? (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center relative">
                          <video src={item} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={item}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 25vw, 10vw"
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-6">
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium tracking-wider uppercase rounded-sm inline-block mb-4">
                  {project.category}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-secondary mb-8 leading-tight">
                  {project.title}
                </h1>
                <div className="w-16 h-px bg-accent/30 mb-8" />
              </div>

              <div className="prose prose-neutral prose-lg max-w-none mb-12 prose-p:text-neutral prose-p:leading-relaxed prose-p:font-light prose-p:text-justify prose-headings:font-serif prose-headings:text-secondary prose-strong:text-secondary prose-strong:font-medium">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>

              <div className="bg-white p-8 rounded-sm border border-neutral/10 shadow-sm">
                <h3 className="font-serif text-2xl text-secondary mb-4">Gostou deste projeto?</h3>
                <p className="text-neutral mb-6 font-light">
                  Podemos criar algo exclusivo e sob medida para o seu espaço, inspirado neste estilo.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full sm:w-auto px-8 py-4 bg-secondary text-white font-medium tracking-wide hover:bg-secondary/90 transition-colors rounded-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Orçamento
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            {items.length > 1 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-widest">
                {currentIndex + 1} / {items.length}
              </div>
            )}

            <div
              className="relative w-full h-full max-w-6xl flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isVideo(items[currentIndex]) ? (
                    <video
                      src={items[currentIndex]}
                      className="max-w-full max-h-full object-contain rounded-sm"
                      controls
                      autoPlay
                      playsInline
                      style={{ maxHeight: 'calc(100vh - 8rem)' }}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={items[currentIndex]}
                        alt={project.title}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(Math.max(0, currentIndex - 1)); }}
                  className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-3 text-white/40 hover:text-white transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(Math.min(items.length - 1, currentIndex + 1)); }}
                  className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-3 text-white/40 hover:text-white transition-all ${currentIndex === items.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
