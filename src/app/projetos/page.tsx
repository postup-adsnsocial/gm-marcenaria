"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import ProjectCard from '../../components/ProjectCard';
import { Project } from '../../types/project';
import { mockProjects, categories as mockCategories } from '../../data/mock';
import { supabase } from '../../lib/supabase';
import { parseCategories } from '../../components/ProjectCard';
import { fetchCategories } from '../../lib/categories';

function ProjetosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'Todos';

  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [allCategories, setAllCategories] = useState<string[]>(mockCategories);

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await fetchCategories();
        setAllCategories(cats);

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
          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Todos') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => parseCategories(p.category).includes(selectedCategory)));
    }
  }, [selectedCategory, projects]);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 md:pt-40 pb-24 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div>
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-neutral/50 hover:text-secondary transition-colors mb-8 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase">Voltar</span>
              </Link>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent text-xs font-semibold tracking-[0.3em] uppercase mb-4 block"
              >
                Exclusividade & Design
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-secondary leading-tight"
              >
                Portfólio <br />
                <span className="italic">Completo</span>
              </motion.h1>
            </div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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
                    layoutId="activeTabProjetos"
                    className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
              {allCategories.map((category) => (
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
                      layoutId="activeTabProjetos"
                      className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Count */}
          {!loading && (
            <motion.p
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-neutral/40 uppercase tracking-widest font-medium mb-10"
            >
              {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
              {selectedCategory !== 'Todos' ? ` em ${selectedCategory}` : ' no total'}
            </motion.p>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="w-10 h-10 border border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            </AnimatePresence>
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
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

export default function ProjetosPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-10 h-10 border border-accent/20 border-t-accent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    }>
      <ProjetosContent />
    </Suspense>
  );
}
