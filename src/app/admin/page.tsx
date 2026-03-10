"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, LogOut, Edit2, Eye, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import DeleteButton from '../../components/DeleteButton';
import { Project } from '../../types/project';
import { mockProjects, categories } from '../../data/mock';
import { supabase } from '../../lib/supabase';
import { parseImageUrls } from '../../components/ProjectCard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer' | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          // Fetch user role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleData) {
            setUserRole(roleData.role as 'admin' | 'editor' | 'viewer');
          } else {
            setUserRole('viewer'); // Default fallback
          }
        } else {
          router.push('/admin/login');
        }
      } else {
        // Fallback for mock mode
        const authState = localStorage.getItem('gm_admin_auth');
        if (authState === 'true') {
          setIsAuthenticated(true);
          setUserRole('admin'); // Mock mode defaults to admin
        } else {
          router.push('/admin/login');
        }
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let result = projects;
    
    if (selectedCategory !== 'Todos') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProjects(result);
  }, [searchTerm, selectedCategory, projects]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProjects(data as Project[]);
        } else {
          setProjects(mockProjects);
        }
      } else {
        setProjects(mockProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('gm_admin_auth');
    }
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const handleDeleteProject = async (id: string) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
        fetchProjects();
        toast.success('Projeto excluído com sucesso.');
      } else {
        // Delete from local mock state
        setProjects(projects.filter(p => p.id !== id));
        toast.success('Projeto excluído com sucesso (mock).');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Erro ao excluir projeto.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl text-secondary truncate mr-4 hover:text-accent transition-colors">
            G&M Admin
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-neutral hover:text-accent transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Site</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-neutral hover:text-secondary transition-colors text-sm font-medium flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div>
            <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block">
              Gestão de Conteúdo
            </span>
            <h2 className="font-serif text-4xl text-secondary">Projetos</h2>
            {userRole && (
              <p className="text-xs text-neutral/50 mt-2 font-light tracking-wide">
                Autenticado como: <span className="font-medium capitalize text-secondary">{userRole}</span>
              </p>
            )}
          </div>
          {(userRole === 'admin' || userRole === 'editor') && (
            <button
              onClick={() => router.push('/admin/projects/new')}
              className="flex items-center gap-3 px-8 py-3 bg-secondary text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Novo Projeto
            </button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/40" />
            <input
              type="text"
              placeholder="Pesquisar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral/10 rounded-sm focus:outline-none focus:border-accent/50 transition-all text-sm font-light placeholder:text-neutral/30"
            />
          </div>
          <div className="relative w-full md:w-72">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/40 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-neutral/10 rounded-sm focus:outline-none focus:border-accent/50 transition-all text-sm font-light appearance-none text-secondary cursor-pointer"
            >
              <option value="Todos">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-r border-b border-neutral/40 rotate-45" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-10 h-10 border border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-neutral/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/30 border-b border-neutral/5">
                    <th className="px-8 py-5 font-sans text-[10px] font-bold text-neutral/50 uppercase tracking-[0.2em]">Visual</th>
                    <th className="px-8 py-5 font-sans text-[10px] font-bold text-neutral/50 uppercase tracking-[0.2em]">Informações</th>
                    <th className="px-8 py-5 font-sans text-[10px] font-bold text-neutral/50 uppercase tracking-[0.2em]">Categoria</th>
                    {(userRole === 'admin' || userRole === 'editor') && (
                      <th className="px-8 py-5 font-sans text-[10px] font-bold text-neutral/50 uppercase tracking-[0.2em] text-right">Ações</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral/5">
                  {filteredProjects.map((project) => {
                    const images = parseImageUrls(project.image_url);
                    const mainImage = images.length > 0 ? images[0] : '';
                    
                    return (
                    <motion.tr 
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-primary/20 transition-colors"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="w-20 h-20 rounded-sm overflow-hidden bg-neutral/5 relative shadow-sm group-hover:shadow-md transition-shadow">
                          {mainImage && (
                            <Image 
                              src={mainImage} 
                              alt={project.title} 
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-serif text-lg text-secondary mb-1">{project.title}</div>
                        <div className="text-xs text-neutral/60 font-light truncate max-w-md">{project.description}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-accent/70">
                          {project.category}
                        </span>
                      </td>
                      {(userRole === 'admin' || userRole === 'editor') && (
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                              className="p-2.5 text-neutral/30 hover:text-secondary hover:bg-neutral/5 rounded-full transition-all"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {userRole === 'admin' && (
                              <DeleteButton 
                                onDelete={() => handleDeleteProject(project.id)} 
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  )})}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={(userRole === 'admin' || userRole === 'editor') ? 4 : 3} className="px-8 py-24 text-center">
                        <p className="font-serif text-xl text-neutral/30 italic">Nenhum projeto encontrado com os filtros atuais.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
