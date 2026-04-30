"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Project, ProjectInput } from '../types/project';
import { categories as mockCategories } from '../data/mock';
import { Upload, X, Plus, GripVertical } from 'lucide-react';
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

  // Drag-and-drop file upload state
  const [isDroppingFile, setIsDroppingFile] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragFileCounterRef = useRef(0);

  // Drag-and-drop reorder state
  const draggedIdRef = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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
      const newFiles = media.filter(m => m.type === 'file').map(m => m.file);
      const order = media.map(m => m.type === 'url' ? m.value : `UPLOAD:${m.id}`);

      await onSubmit({
        title,
        category: JSON.stringify(selectedCategories),
        description,
        image_url: JSON.stringify(order),
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
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const addFiles = (files: FileList | File[]) => {
    Array.from(files).forEach(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMedia(prev => [...prev, {
            id,
            type: 'file',
            file,
            preview: e.target!.result as string,
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  // File drag-and-drop on the drop zone
  const handleDropZoneDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    dragFileCounterRef.current += 1;
    setIsDroppingFile(true);
  };

  const handleDropZoneDragLeave = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    dragFileCounterRef.current -= 1;
    if (dragFileCounterRef.current <= 0) {
      dragFileCounterRef.current = 0;
      setIsDroppingFile(false);
    }
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragFileCounterRef.current = 0;
    setIsDroppingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  // Grid item drag-and-drop for reordering
  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    draggedIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleItemDragOver = (e: React.DragEvent, id: string) => {
    if (!draggedIdRef.current || draggedIdRef.current === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  };

  const handleItemDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedIdRef.current;
    if (!sourceId || sourceId === targetId) return;

    setMedia(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(m => m.id === sourceId);
      const toIdx = arr.findIndex(m => m.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });

    setDragOverId(null);
    draggedIdRef.current = null;
  };

  const handleItemDragEnd = () => {
    draggedIdRef.current = null;
    setDragOverId(null);
  };

  const removeItem = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setMedia(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        type: 'url',
        value: urlInput.trim(),
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
                            const success = await addCategory(name);
                            if (success) {
                              setAllCategories(prev => [...prev, name].sort());
                              setSelectedCategories(prev => [...prev, name]);
                              setNewCategory('');
                              setIsAddingCategory(false);
                              toast.success('Categoria adicionada!');
                            } else {
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
                    onClick={() => { setIsAddingCategory(false); setNewCategory(''); }}
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

            {/* Gallery Preview with drag-to-reorder */}
            {media.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-neutral/40 uppercase tracking-wider mb-3">
                  Arraste para reordenar · A primeira imagem é a capa
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {media.map((item, idx) => {
                    const url = item.type === 'url' ? item.value : item.preview;
                    const isVid = item.type === 'url' ? isVideo(url) : item.file.type.startsWith('video/');
                    const isDragTarget = dragOverId === item.id;

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleItemDragStart(e, item.id)}
                        onDragOver={(e) => handleItemDragOver(e, item.id)}
                        onDrop={(e) => handleItemDrop(e, item.id)}
                        onDragEnd={handleItemDragEnd}
                        className={`relative aspect-square rounded-sm overflow-hidden group border bg-black/5 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                          item.type === 'file' ? 'border-accent/50' : 'border-neutral/20'
                        } ${isDragTarget ? 'ring-2 ring-accent scale-[1.03] border-accent' : ''}`}
                      >
                        {isVid ? (
                          <video src={url} className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <Image src={url} alt={`Mídia ${idx + 1}`} fill className="object-cover pointer-events-none" />
                        )}

                        {item.type === 'file' && <div className="absolute inset-0 bg-accent/10 pointer-events-none" />}

                        {/* Capa badge */}
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-2 bg-secondary/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                            Capa
                          </div>
                        )}

                        {/* Drag handle + remove */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="p-1 bg-white/90 text-secondary rounded-full shadow-sm cursor-grab">
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
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
              </div>
            )}

            {/* File drop zone */}
            <div
              ref={dropZoneRef}
              onDragEnter={handleDropZoneDragEnter}
              onDragLeave={handleDropZoneDragLeave}
              onDragOver={handleDropZoneDragOver}
              onDrop={handleDropZoneDrop}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-sm transition-all duration-200 ${
                isDroppingFile
                  ? 'border-accent bg-accent/5 scale-[1.01]'
                  : 'border-neutral/20 hover:border-accent/50'
              }`}
            >
              <div className="space-y-1 text-center">
                <Upload className={`mx-auto h-10 w-10 mb-3 transition-colors ${isDroppingFile ? 'text-accent' : 'text-neutral/40'}`} />
                <div className="flex text-sm text-neutral justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none">
                    <span>Clique para selecionar</span>
                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                  </label>
                  <span className="pl-1 text-neutral/60">ou arraste os arquivos aqui</span>
                </div>
                <p className="text-xs text-neutral/50">PNG, JPG, MP4, WEBM</p>
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
