"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onDelete: () => void;
  className?: string;
}

export default function DeleteButton({ onDelete, className = '' }: DeleteButtonProps) {
  const [stage, setStage] = useState<'idle' | 'confirm'>('idle');

  const handleClick = () => {
    if (stage === 'idle') {
      setStage('confirm');
      // Reset after 3 seconds if not confirmed
      setTimeout(() => {
        setStage('idle');
      }, 3000);
    } else {
      onDelete();
      setStage('idle');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center transition-all duration-300 rounded-sm ${
        stage === 'idle' 
          ? 'text-red-500 hover:bg-red-50 p-2' 
          : 'bg-red-500 text-white px-3 py-1 text-sm font-medium'
      } ${className}`}
    >
      {stage === 'idle' ? (
        <Trash2 className="w-4 h-4" />
      ) : (
        'Tem certeza?'
      )}
    </button>
  );
}
