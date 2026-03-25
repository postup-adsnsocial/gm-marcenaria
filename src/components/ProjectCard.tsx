"use client";

import Image from 'next/image';
import { Project } from '../types/project';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface ProjectCardProps {
  project: Project;
}

export const parseImageUrls = (urlStr: string): string[] => {
  if (!urlStr) return [];
  try {
    const parsed = JSON.parse(urlStr);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    if (urlStr.includes(',')) {
      return urlStr.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [urlStr];
};

export const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes('video');
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const items = parseImageUrls(project.image_url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentIndex(newIndex);
    }
  };

  const scrollToItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento inspirado no projeto: ${project.title} (${project.category}).`);
    window.open(`https://wa.me/5541999695577?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-6 rounded-sm bg-neutral-100">
        <div
          ref={scrollContainerRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x' }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 snap-center relative cursor-pointer"
              onClick={() => router.push(`/projetos/${project.id}`)}
            >
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-700 z-10" />

              {/* View Project Button on Hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="px-6 py-2 bg-white text-secondary text-xs font-medium tracking-[0.2em] uppercase rounded-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Ver Projeto
                </span>
              </div>

              {isVideo(item) ? (
                <video
                  src={item}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item}
                  alt={`${project.title} - Item ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
              )}
            </div>
          ))}
        </div>

        {/* Minimal Category Badge */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white drop-shadow-md">
            {project.category}
          </span>
        </div>

        {/* Carousel Controls (only if multiple items) */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => scrollToItem(Math.max(0, currentIndex - 1), e)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white shadow-sm hover:bg-white hover:text-secondary transition-all hidden md:block ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => scrollToItem(Math.min(items.length - 1, currentIndex + 1), e)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white shadow-sm hover:bg-white hover:text-secondary transition-all hidden md:block ${currentIndex === items.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2 pointer-events-none">
              {items.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1 bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-start gap-6 px-1">
        <div
          className="cursor-pointer flex-1"
          onClick={() => router.push(`/projetos/${project.id}`)}
        >
          <h3 className="font-serif text-2xl text-secondary mb-2 group-hover:text-accent transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          <p className="font-sans text-sm text-neutral/70 font-light leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        <button
          onClick={handleWhatsAppClick}
          className="flex-shrink-0 mt-1 p-2 text-neutral/30 hover:text-accent transition-all duration-300 rounded-full hover:bg-accent/5"
          title="Solicitar Orçamento"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
