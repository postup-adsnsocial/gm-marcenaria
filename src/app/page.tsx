"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Differentials from '../components/Differentials';
import ProjectCard from '../components/ProjectCard';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { Project } from '../types/project';
import { mockProjects, categories } from '../data/mock';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setProjects(data as Project[]);
            setFilteredProjects(data as Project[]);
          } else {
            setProjects(mockProjects);
            setFilteredProjects(mockProjects);
          }
        } else {
          // Fallback to mock data if Supabase is not configured
          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Todos') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  return (
    <main className="min-h-screen bg-primary">
      <Navbar />
      <Hero />
      
      <div id="diferenciais">
        <Differentials />
      </div>

      <section id="portfolio" className="py-16 md:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-20 gap-6">
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-accent text-xs font-semibold tracking-[0.3em] uppercase mb-4 block"
              >
                Exclusividade & Design
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight"
              >
                Portfólio de <br />
                <span className="italic">Projetos Selecionados</span>
              </motion.h2>
            </div>
            
            {/* Minimalist Category Filter */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-x-8 gap-y-4 border-b border-neutral/10 pb-2"
            >
              <button
                onClick={() => setSelectedCategory('Todos')}
                className={`relative py-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                  selectedCategory === 'Todos'
                    ? 'text-secondary'
                    : 'text-neutral/40 hover:text-secondary'
                }`}
              >
                Todos
                {selectedCategory === 'Todos' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative py-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                    selectedCategory === category
                      ? 'text-secondary'
                      : 'text-neutral/40 hover:text-secondary'
                  }`}
                >
                  {category}
                  {selectedCategory === category && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="w-10 h-10 border border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                />
              ))}
            </motion.div>
          )}
          
          {!loading && filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40"
            >
              <p className="font-serif text-2xl text-neutral/40 italic">
                Nenhum projeto encontrado nesta categoria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
