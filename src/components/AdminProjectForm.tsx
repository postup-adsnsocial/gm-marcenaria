"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Project, ProjectInput } from '../types/project';
import { categories as mockCategories } from '../data/mock';
import { Upload, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { parseImageUrls, isVideo, parseCategories } from './ProjectCard';
import { toast } from 'sonner';
import { fetchCategories, addCategory } from '../lib/categories';

interface AdminProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectInput, files?: File[]) => Promise<void>;
  onCancel: () => void;
}

type MediaItem = 
  | { id: string; type: 'url'; value: string }
  | { id: string; type: 'file'; file: File; preview: string };

export default function AdminProjectForm({ project, onSubmit, onCancel }: AdminProjectFormProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    project ? parseCategories(project.category) : []
  );
  const [description, setDescription] = useState(project?.description || '');
  
  const initialMedia: MediaItem[] = project 
    ? parseImageUrls(project.image_url).map(url => ({ id: Math.random().toString(36).substr(2, 9), type: 'url', value: url }))
    : [];
  
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const [allCategories, setAllCategories] = useState<string[]>(mockCategories);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setAllCategories(cats);
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      toast.error('Selecione pelo menos uma categoria');
      return;
    }
    setLoading(true);
    try {
      // Return the media items in the final order
      // We pass the order information to the parent through the image_url JSON
      // The parent will process this to upload files and replacement placeholders
      const existingUrls = media.filter(m => m.type === 'url').map(m => m.value);
      const newFiles = media.filter(m => m.type === 'file').map(m => m.file);
      
      // We also send the full order structure so the parent can reconstruct it
      const order = media.map(m => m.type === 'url' ? m.value : `UPLOAD:${m.id}`);
      
      await onSubmit({ 
        title, 
        category: JSON.stringify(selectedCategories), 
        description, 
        image_url: JSON.stringify(order) // Use the order structure
      }, newFiles);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      newFiles.forEach(file => {
        const id = Math.random().toString(36).substr(2, 9);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setMedia(prev => [...prev, { 
              id, 
              type: 'file', 
              file, 
              preview: e.target!.result as string 
            }]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeItem = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newMedia = [...media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newMedia.length) {
      [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
      setMedia(newMedia);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setMedia(prev => [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        type: 'url', 
        value: urlInput.trim() 
      }]);
      setUrlInput('');
    }
  };

  return (
    <div className="bg-white w-full rounded-sm shadow-sm border border-neutral/10">
      <div className="p-8">
        <h2 className="font-serif text-2xl text-secondary mb-6">
          {project ? 'Editar Projeto' : 'Novo Projeto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-3">Categorias</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-sm text-sm font-medium transition-all border ${
                    selectedCategories.includes(cat)
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-neutral border-neutral/20 hover:border-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              {isAddingCategory ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <input
                    type="text"
                    autoFocus
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nome da categoria..."
                    className="px-4 py-2 border border-accent rounded-sm text-sm focus:outline-none w-48"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCategory.trim()) {
                          const name = newCategory.trim();
                          if (!allCategories.includes(name)) {
                            // Try to save to Supabase
                            const success = await addCategory(name);
                            if (success) {
                              setAllCategories(prev => [...prev, name].sort());
                              setSelectedCategories(prev => [...prev, name]);
                              setNewCategory('');
                              setIsAddingCategory(false);
                              toast.success('Categoria adicionada!');
                            } else {
                              // Local only fallback if DB fails
                              setAllCategories(prev => [...prev, name].sort());
                              setSelectedCategories(prev => [...prev, name]);
                              setNewCategory('');
                              setIsAddingCategory(false);
                              toast.info('Categoria adicionada localmente.');
                            }
                          } else {
                            toast.error('Esta categoria já existe');
                          }
                        }
                      } else if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                        setNewCategory('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategory('');
                    }}
                    className="p-2 text-neutral hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="px-4 py-2 rounded-sm text-sm font-medium transition-all border border-dashed border-neutral/30 text-neutral/50 hover:border-accent hover:text-accent flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Nova Categoria
                </button>
              )}
            </div>
            <p className="text-[10px] text-neutral/50 mt-2 uppercase tracking-wider">Selecione uma ou mais categorias para o projeto ou crie uma nova.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Descrição</label>
            <textarea
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dica: Use parágrafos (tecla Enter) para uma leitura mais agradável."
              className="w-full px-4 py-3 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent resize-none font-light leading-relaxed mb-2"
            />
            <div className="flex flex-wrap gap-4 text-[10px] text-neutral/50 uppercase tracking-widest font-medium">
              <span>**Negrito**</span>
              <span>*Itálico*</span>
              <span>- Lista</span>
              <span>1. Lista numerada</span>
              <span>## Subtítulo</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Mídias do Projeto (Imagens e Vídeos)</label>
            
            {/* Gallery Preview */}
            {media.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {media.map((item, idx) => {
                  const url = item.type === 'url' ? item.value : item.preview;
                  const isVid = item.type === 'url' ? isVideo(url) : item.file.type.startsWith('video/');
                  
                  return (
                    <div key={item.id} className={`relative aspect-square rounded-sm overflow-hidden group border ${item.type === 'file' ? 'border-accent/50' : 'border-neutral/20'} bg-black/5`}>
                      {isVid ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={url} alt={`Mídia ${idx + 1}`} fill className="object-cover" />
                      )}
                      
                      {item.type === 'file' && <div className="absolute inset-0 bg-accent/10 pointer-events-none" />}
                      
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 bg-white/90 text-secondary rounded-full shadow-sm hover:bg-white disabled:opacity-30"
                          title="Mover para esquerda"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === media.length - 1}
                          className="p-1 bg-white/90 text-secondary rounded-full shadow-sm hover:bg-white disabled:opacity-30"
                          title="Mover para direita"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors"
                          title="Remover"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {isVid && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                           <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral/20 border-dashed rounded-sm hover:border-accent/50 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-neutral/50 mb-4" />
                <div className="flex text-sm text-neutral justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none">
                    <span>Fazer upload de imagens e vídeos</span>
                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-neutral/70">Imagens (PNG, JPG) ou Vídeos (MP4, WEBM)</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Ou adicione uma URL (ex: https://...)"
                className="flex-1 px-4 py-2 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-neutral-100 text-secondary font-medium rounded-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-neutral/20 text-secondary font-medium rounded-sm hover:bg-neutral/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || media.length === 0}
              className="px-6 py-2 bg-secondary text-white font-medium rounded-sm hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
