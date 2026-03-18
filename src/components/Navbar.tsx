"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation'; // <-- O detetive de páginas

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Descobre em qual página estamos
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // A regra de ouro: fica "sólido" (vidro) se não for a home, se descer o scroll ou abrir o menu
  const isSolid = !isHome || scrolled || isMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bônus: Os links agora voltam para a Home se você estiver em outra página
  const navLinks = [
    { name: 'Diferenciais', href: isHome ? '#diferenciais' : '/#diferenciais' },
    { name: 'Portfólio', href: isHome ? '#portfolio' : '/#portfolio' },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isSolid ? 'bg-primary/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="font-serif text-2xl tracking-wide transition-colors duration-300">
            {/* A logo fica branca na home escura e volta a ser preta nas outras páginas! */}
            <img 
              src="/logo-gm.png" 
              alt="G&M Móveis" 
              className={`h-24 w-auto transition-all duration-300 ${isHome && !scrolled && !isMenuOpen ? 'invert drop-shadow-lg' : ''}`} 
            />
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className={`font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:text-accent ${
                    isSolid ? 'text-secondary/80' : 'text-white/90 drop-shadow-md'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="w-px h-4 bg-current opacity-20" />

            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/5541999695577" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-all duration-300 hover:text-accent hover:scale-110 ${
                  isSolid ? 'text-secondary' : 'text-white drop-shadow-md'
                }`}
                title="Fale conosco no WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/marcenaria.gilmoveis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-all duration-300 hover:text-accent hover:scale-110 ${
                  isSolid ? 'text-secondary' : 'text-white drop-shadow-md'
                }`}
                title="Siga-nos no Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              className="p-2 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={isSolid ? 'text-secondary' : 'text-white drop-shadow-md'} />
              ) : (
                <Menu className={isSolid ? 'text-secondary' : 'text-white drop-shadow-md'} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-primary pt-24 px-6 md:hidden overflow-y-auto hide-scrollbar"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="font-serif text-3xl text-secondary border-b border-secondary/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}