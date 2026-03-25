"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';
import AdminProjectForm from '../../../../../components/AdminProjectForm';
import { Project, ProjectInput } from '../../../../../types/project';
import { mockProjects } from '../../../../../data/mock';
import { supabase } from '../../../../../lib/supabase';

export default function EditProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      let isAuth = false;
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          isAuth = true;
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } else {
        const authState = localStorage.getItem('gm_admin_auth');
        if (authState === 'true') {
          isAuth = true;
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      }

      if (isAuth) {
        fetchProject();
      }
    };

    checkAuthAndFetch();
  }, [router, id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      if (supabase && isUUID) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Supabase fetch failed, falling back to mock:', error.message);
          throw error;
        }

        if (data) {
          setProject(data as Project);
        } else {
          // Fallback to mock if not found in db
          const mockProject = mockProjects.find(p => p.id === id);
          if (mockProject) setProject(mockProject);
          else router.push('/admin');
        }
      } else {
        const mockProject = mockProjects.find(p => p.id === id);
        if (mockProject) setProject(mockProject);
        else router.push('/admin');
      }
    } catch (error: any) {
      console.error('Error fetching project:', error?.message || error);
      const mockProject = mockProjects.find(p => p.id === id);
      if (mockProject) setProject(mockProject);
      else router.push('/admin');
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

  const handleSaveProject = async (data: ProjectInput, files?: File[]) => {
    try {
      let imageUrls: string[] = [];

      try {
        imageUrls = JSON.parse(data.image_url);
      } catch {
        imageUrls = data.image_url ? [data.image_url] : [];
      }

      if (files && files.length > 0 && supabase) {
        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase!.storage
              .from('project-images')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase!.storage
              .from('project-images')
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const projectData = {
        ...data,
        image_url: JSON.stringify(imageUrls),
      };

      if (supabase) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
        if (error) throw error;
      } else {
        // In mock mode, we just pretend it saved
        console.log('Mock update:', projectData);
      }

      toast.success('Projeto atualizado com sucesso!');
      router.push('/admin');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Erro ao salvar projeto. Verifique o console para mais detalhes.');
    }
  };

  if (!isAuthenticated || loading) {
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
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 -ml-2 text-neutral hover:text-secondary hover:bg-neutral/5 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="font-serif text-xl sm:text-2xl text-secondary truncate hover:text-accent transition-colors">
              GM Admin
            </Link>
          </div>
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {project && (
          <AdminProjectForm
            project={project}
            onSubmit={handleSaveProject}
            onCancel={() => router.push('/admin')}
          />
        )}
      </main>
    </div>
  );
}
