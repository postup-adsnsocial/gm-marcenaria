"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1664711942326-2c3351e215e6?q=80&w=3217&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-25%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden"
    >
      {/* CAMADA 1: Imagem de fundo com parallax */}
      <motion.div
        style={{ scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0"
      >
        <img
          src={IMAGE_URL}
          alt="GM Marcenaria"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
      </motion.div>

      {/* CAMADA 2: Conteúdo com parallax independente */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center max-w-4xl mx-auto"
      >
        <motion.img
          src="/logo-gm.png"
          alt="GM Marcenaria"
          className="h-64 md:h-160 w-auto object-contain drop-shadow-2xl mb-8 invert"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        <motion.h2
          className="text-xl md:text-3xl font-light text-white/90 drop-shadow-md max-w-2xl tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Marcenaria de alto padrão para projetos exclusivos.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          className="font-sans text-lg md:text-xl text-white/90 mb-10 font-light tracking-wide drop-shadow-md mt-4"
        >
          Há mais de três décadas criando móveis planejados
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
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
      </motion.div>

      {/* CAMADA 3: Indicador de scroll */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-white/60"
            animate={{ height: ["0%", "100%"], y: ["0%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ height: "40%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}