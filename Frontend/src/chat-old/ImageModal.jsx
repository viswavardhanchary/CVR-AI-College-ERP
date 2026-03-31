import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

export function ImageModal({ imageUrl, onClose }) {
  const [state, setState] = useState({ scale: 1 });
  
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-300 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out]" 
      onClick={onClose}
    >
      <div className="absolute top-5 right-5 flex gap-4 z-10">
        <button onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.5, 3) })); }} className="text-white hover:text-blue-400 p-2 outline-none">
          <ZoomIn className="w-6 h-6" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.5, 0.5) })); }} className="text-white hover:text-blue-400 p-2 outline-none">
          <ZoomOut className="w-6 h-6" />
        </button>
        <button onClick={onClose} className="text-white hover:text-red-500 p-2 outline-none">
          <X className="w-7 h-7" />
        </button>
      </div>
      
      <img
        src={imageUrl}
        alt="Fullscreen Preview"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `scale(${state.scale})` }}
        className="max-w-[95vw] max-h-[95vh] object-contain transition-transform duration-300 cursor-zoom-in"
      />
    </div>
  );
}