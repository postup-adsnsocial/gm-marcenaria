"use client";

import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        {/* Layered overlays for maximum readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight drop-shadow-lg"
        >
          Transformamos Ambientes em Experiências
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-sans text-lg md:text-xl text-white/90 mb-10 font-light tracking-wide drop-shadow-md"
        >
          Há mais de três décadas criando móveis exclusivos
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#portfolio" 
            className="px-8 py-4 bg-accent text-white font-medium tracking-wide hover:bg-accent/90 transition-colors w-full sm:w-auto text-center rounded-sm"
          >
            Ver Projetos
          </a>
          <a 
            href="https://wa.me/5541999695577?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-transparent border border-white text-white font-medium tracking-wide hover:bg-white hover:text-secondary transition-colors w-full sm:w-auto text-center rounded-sm"
          >
            Solicitar Orçamento
          </a>
        </motion.div>
      </div>
    </section>
  );
}
