"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import WhatsAppButton from '../../../components/WhatsAppButton';
import { Project } from '../../../types/project';
import { mockProjects } from '../../../data/mock';
import { supabase } from '../../../lib/supabase';
import { parseImageUrls } from '../../../components/ProjectCard';
import Link from 'next/link';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            
          if (error) {
            console.warn('Supabase fetch failed, falling back to mock:', error.message);
            throw error;
          }
          
          if (data) {
            setProject(data as Project);
          } else {
            const mock = mockProjects.find(p => p.id === id);
            if (mock) setProject(mock);
            else router.push('/admin');
          }
        } else {
          // If not a UUID or no supabase, check mock data directly
          const mock = mockProjects.find(p => p.id === id);
          if (mock) setProject(mock);
          else if (supabase && !isUUID) {
             // If it's not a UUID but we have supabase, it's definitely a mock ID
             // and if not found in mockProjects, we should redirect
             router.push('/admin');
          } else {
             router.push('/admin');
          }
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
  }, [id]);

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

  const images = parseImageUrls(project.image_url);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento inspirado no projeto: ${project.title} (${project.category}).`);
    window.open(`https://wa.me/5541999695577?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-primary flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-48 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
         {/* Back button */}
         <Link 
            href="/#portfolio"
            className="flex items-center gap-2 text-neutral hover:text-secondary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-wider">Voltar ao Portfólio</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative aspect-[4/3] sm:aspect-video lg:aspect-[4/5] overflow-hidden rounded-sm bg-neutral-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={images[currentImageIndex]} 
                      alt={`${project.title} - Foto ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                      className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white transition-all ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-125 active:scale-95'}`}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-8 h-8 sm:w-10 h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                      className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white transition-all ${currentImageIndex === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-125 active:scale-95'}`}
                      disabled={currentImageIndex === images.length - 1}
                    >
                      <ChevronRight className="w-8 h-8 sm:w-10 h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-square overflow-hidden rounded-sm transition-all ${currentImageIndex === idx ? 'ring-2 ring-accent ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <Image 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover"
                      />
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
                <h1 className="font-serif text-4xl sm:text-5xl text-secondary mb-6 leading-tight">
                  {project.title}
                </h1>
                <div className="w-16 h-px bg-accent/30 mb-8" />
              </div>

              <div className="prose prose-neutral prose-lg max-w-none mb-12">
                <p className="text-neutral leading-relaxed font-light">
                  {project.description}
                </p>
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
    </main>
  );
}
