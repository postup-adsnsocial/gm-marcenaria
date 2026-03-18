"use client";

import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-[8px]"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1664711942326-2c3351e215e6?q=80&w=3217&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        }}
      >
        {/* Layered overlays for maximum readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center w-full">
  {/* A Logo Gigante */}

  <div className="flex flex-col items-center justify-center text-center w-full z-10">
  {/* Logo Animada: Surge primeiro */}
  <motion.img
  src="/logo-gm.png" 
  alt="G&M Móveis" 
  className="h-64 md:h-160 w-auto object-contain drop-shadow-2xl mb-8 invert" 
  initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  />
  </div>
{/* Texto Animado: Surge um pouquinho depois da logo */}
<motion.h2 
    className="text-xl md:text-3xl font-light text-white/90 drop-shadow-md max-w-2xl tracking-wide"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }} 
  >
    Marcenaria de alto padrão para projetos exclusivos.
  </motion.h2>
</div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-lg md:text-xl text-white/90 mb-10 font-light tracking-wide drop-shadow-md"
        >
          Há mais de três décadas criando móveis exclusivos
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
