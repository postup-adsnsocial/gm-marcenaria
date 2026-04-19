"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MessageCircle } from "lucide-react";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Círculo maior: sobe devagar
  const circle1Y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  // Círculo menor: sobe mais rápido (profundidade)
  const circle2Y = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  // Conteúdo: sobe suavemente ao entrar na viewport
  const contentY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={containerRef}
      id="contato"
      className="py-20 md:py-40 bg-secondary text-white px-6 overflow-hidden relative"
    >
      {/* Elemento Decorativo com parallax independente por camada */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Círculo externo — move mais devagar */}
        <motion.div
          style={{ y: circle1Y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full opacity-[0.04]"
        />
        {/* Círculo interno — move mais rápido */}
        <motion.div
          style={{ y: circle2Y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full opacity-[0.04]"
        />
      </div>

      {/* Conteúdo com parallax suave */}
      <motion.div
        style={{ y: contentY }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center space-y-10"
        >
          <span className="font-sans text-[11px] font-bold tracking-[0.4em] uppercase text-accent/60">
            Próximo Passo
          </span>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight">
            Vamos materializar o <span className="italic">seu</span> projeto?
          </h2>

          <p className="font-sans text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            Nossa equipe de especialistas está pronta para entender suas
            necessidades e transformar sua visão em uma realidade impecável.
          </p>

          <div className="pt-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/5541999695577?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-10 md:px-16 py-5 md:py-6 bg-accent text-white font-sans text-sm font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-2xl group"
            >
              <MessageCircle className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Fale Conosco
            </motion.a>
          </div>

          <div className="pt-20 flex flex-col items-center gap-4 opacity-30">
            <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
              Curitiba & Região
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}