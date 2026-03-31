import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize, RotateCw, Download } from 'lucide-react';

export function ImageModal({ imageUrl, onClose }) {
  const [state, setState] = useState({ 
    scale: 1,
    rotation: 0
  });
  
  if (!imageUrl) return null;

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[500] bg-slate-900/40 backdrop-blur-xl flex flex-col items-center justify-center animate-[fadeIn_0.25s_ease-out]" 
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl">
          <button 
            onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.25, 3) })); }} 
            className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all outline-none"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.25, 0.5) })); }} 
            className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all outline-none"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1"></div>
          <button 
            onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 })); }} 
            className="text-white hover:bg-white/20 p-2.5 rounded-xl transition-all outline-none"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDownload} 
            className="text-white hover:bg-indigo-500 p-2.5 rounded-xl transition-all outline-none"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={onClose} 
          className="bg-white/10 backdrop-blur-md text-white hover:bg-red-500 p-2.5 rounded-2xl transition-all border border-white/20 shadow-xl outline-none"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <p className="text-white/60 text-[13px] font-bold tracking-widest uppercase font-body bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
          Preview Mode
        </p>
      </div>
      
      <div className="relative group p-4 sm:p-20 overflow-hidden flex items-center justify-center w-full h-full">
        <img
          src={imageUrl}
          alt="Fullscreen Preview"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            transform: `scale(${state.scale}) rotate(${state.rotation}deg)`,
          }}
          className="max-w-full max-h-full object-contain transition-all duration-500 cursor-grab active:cursor-grabbing shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-lg"
        />
      </div>
    </div>
  );
}