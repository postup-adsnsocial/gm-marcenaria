"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Project, ProjectInput } from '../types/project';
import { categories } from '../data/mock';
import { Upload, X } from 'lucide-react';
import { parseImageUrls, isVideo } from './ProjectCard';
import { toast } from 'sonner';

interface AdminProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectInput, files?: File[]) => Promise<void>;
  onCancel: () => void;
}

export default function AdminProjectForm({ project, onSubmit, onCancel }: AdminProjectFormProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState(project?.category || categories[0]);
  const [description, setDescription] = useState(project?.description || '');
  
  const initialUrls = project ? parseImageUrls(project.image_url) : [];
  const [imageUrls, setImageUrls] = useState<string[]>(initialUrls);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass the existing URLs as a JSON string in image_url
      // The parent component will append the new uploaded files' URLs
      await onSubmit({ 
        title, 
        category, 
        description, 
        image_url: JSON.stringify(imageUrls) 
      }, files);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Show previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeExistingUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setImageUrls(prev => [...prev, urlInput.trim()]);
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
            <label className="block text-sm font-medium text-secondary mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Descriçāo</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-neutral/20 rounded-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Mídias do Projeto (Imagens e Vídeos)</label>
            
            {/* Gallery Preview */}
            {(imageUrls.length > 0 || previews.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {imageUrls.map((url, idx) => (
                  <div key={`url-${idx}`} className="relative aspect-square rounded-sm overflow-hidden group border border-neutral/20 bg-black/5">
                    {isVideo(url) ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={url} alt={`Mídia ${idx + 1}`} fill className="object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingUrl(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                      title="Remover"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {isVideo(url) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                         <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                         </div>
                      </div>
                    )}
                  </div>
                ))}
                {previews.map((preview, idx) => {
                  const isVid = files[idx] ? files[idx].type.startsWith('video/') : isVideo(preview);
                  return (
                    <div key={`file-${idx}`} className="relative aspect-square rounded-sm overflow-hidden group border border-accent/50 bg-black/5">
                      {isVid ? (
                        <video src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={preview} alt={`Novo item ${idx + 1}`} fill className="object-cover" />
                      )}
                      <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                        title="Remover"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
              disabled={loading || (imageUrls.length === 0 && files.length === 0)}
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
