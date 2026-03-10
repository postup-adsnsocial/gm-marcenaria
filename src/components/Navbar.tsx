"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Portfólio', href: '#portfolio' },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || isMenuOpen ? 'bg-primary/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className={`font-serif text-2xl tracking-wide transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-secondary' : 'text-white drop-shadow-md'}`}>
            G&M <span className="font-light">Móveis</span>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className={`font-sans text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:text-accent ${scrolled ? 'text-secondary/80' : 'text-white/80 drop-shadow-sm'}`}
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
                className={`transition-all duration-300 hover:text-accent hover:scale-110 ${scrolled ? 'text-secondary' : 'text-white drop-shadow-sm'}`}
                title="Fale conosco no WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/marcenaria.gilmoveis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-all duration-300 hover:text-accent hover:scale-110 ${scrolled ? 'text-secondary' : 'text-white drop-shadow-sm'}`}
                title="Siga-nos no Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">
            <a 
              href="https://wa.me/5541999695577" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-secondary' : 'text-white drop-shadow-sm'}`}
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/marcenaria.gilmoveis/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`transition-colors duration-300 ${scrolled || isMenuOpen ? 'text-secondary' : 'text-white drop-shadow-sm'}`}
            >
              <Instagram className="w-5 h-5" />
            </a>
            <button 
              className="p-2 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className={scrolled || isMenuOpen ? 'text-secondary' : 'text-white drop-shadow-sm'} />
              ) : (
                <Menu className={scrolled || isMenuOpen ? 'text-secondary' : 'text-white drop-shadow-sm'} />
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
                  className="font-serif text-3xl text-secondary border-b border-neutral/10 pb-4"
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
