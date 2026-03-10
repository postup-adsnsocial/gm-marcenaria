"use client";

import { motion } from 'motion/react';
import { Compass, History, Box, Trophy } from 'lucide-react';

const recognitions = [
  { year: '2015', event: 'CasaCor PR', detail: 'Participação em ambiente de destaque' },
  { year: '2022', event: 'Revista Haus', detail: 'Projeto selecionado para edição anual' },
  { year: '2023', event: 'Revista Haus', detail: 'Destaque em marcenaria de alto padrão' },
];

const values = [
  {
    icon: Box,
    title: 'Estética Atemporal',
    description: 'Design que transcende tendências, focado na harmonia entre forma e função.'
  },
  {
    icon: Compass,
    title: 'Precisão Artesanal',
    description: 'Cada milímetro é planejado com o rigor da marcenaria tradicional e tecnologia de ponta.'
  },
  {
    icon: History,
    title: 'Legado de Confiança',
    description: 'Desde 1987, transformamos espaços em refúgios de sofisticação e durabilidade.'
  }
];

export default function Differentials() {
  return (
    <section id="sobre" className="py-32 bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Coluna da Esquerda: Manifesto */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-accent mb-6 block">Nossa Essência</span>
              <h2 className="font-serif text-5xl md:text-6xl text-secondary leading-[1.1] tracking-tight mb-8">
                Onde o <span className="italic">design</span> encontra a alma da madeira.
              </h2>
              <p className="font-sans text-xl text-secondary/70 font-light leading-relaxed max-w-2xl">
                A G&M Móveis não apenas fabrica mobiliário; nós esculpimos experiências.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8">
              {values.map((value, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-accent/40">
                    <value.icon className="w-6 h-6" strokeWidth={1} />
                  </div>
                  <h3 className="font-serif text-lg text-secondary italic">{value.title}</h3>
                  <p className="font-sans text-sm text-secondary/60 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coluna da Direita: Reconhecimento */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-primary p-12 md:p-16 relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy className="w-32 h-32 text-secondary" />
              </div>
              
              <h3 className="font-sans text-[11px] font-bold tracking-[0.3em] uppercase text-secondary/40 mb-12">Trajetória & Reconhecimento</h3>
              
              <div className="space-y-12">
                {recognitions.map((rec, idx) => (
                  <div key={idx} className="group relative">
                    <div className="flex items-baseline gap-6 border-b border-neutral/10 pb-6 transition-colors group-hover:border-accent/30">
                      <span className="font-serif text-3xl text-accent/30 italic group-hover:text-accent transition-colors">{rec.year}</span>
                      <div className="space-y-1">
                        <h4 className="font-serif text-xl text-secondary">{rec.event}</h4>
                        <p className="font-sans text-[11px] font-bold tracking-widest uppercase text-secondary/40">{rec.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-neutral/10">
                <p className="font-sans text-xs italic text-secondary/50">
                  "Excelência reconhecida pelos maiores nomes da arquitetura paranaense."
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
