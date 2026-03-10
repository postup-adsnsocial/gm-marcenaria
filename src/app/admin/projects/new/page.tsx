"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';
import AdminProjectForm from '../../../../components/AdminProjectForm';
import { ProjectInput } from '../../../../types/project';
import { supabase } from '../../../../lib/supabase';

export default function NewProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } else {
        const authState = localStorage.getItem('gm_admin_auth');
        if (authState === 'true') {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      }
    };
    
    checkAuth();
  }, [router]);

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
          .insert([projectData]);
        if (error) throw error;
      } else {
        // In mock mode, we just pretend it saved
        console.log('Mock save:', projectData);
      }

      toast.success('Projeto criado com sucesso!');
      router.push('/admin');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Erro ao salvar projeto. Verifique o console para mais detalhes.');
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
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="p-2 -ml-2 text-neutral hover:text-secondary hover:bg-neutral/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="font-serif text-2xl text-secondary hover:text-accent transition-colors">
              G&M Admin
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
              className="flex items-center gap-2 text-neutral hover:text-secondary transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminProjectForm
          onSubmit={handleSaveProject}
          onCancel={() => router.push('/admin')}
        />
      </main>
    </div>
  );
}
