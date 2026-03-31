import React, { useState } from 'react';
import { X, Image as ImageIcon, FileText, Link as LinkIcon, Download, Mic, Video } from 'lucide-react';

export function MediaGalleryModal({ messages, onClose, onImageClick }) {
  const [state, setState] = useState({
    activeTab: 'media'
  });

  const mediaFiles = messages.filter(m => ['img', 'video', 'audio'].includes(m.type_media)).reverse();
  const docFiles = messages.filter(m => m.type_media === 'doc').reverse();
  
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const linkFiles = [];
  messages.slice().reverse().forEach(m => {
    if (m.content) {
      const found = m.content.match(linkRegex);
      if (found) found.forEach(url => linkFiles.push({ url, msg: m }));
    }
  });

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button 
      onClick={() => setState({ activeTab: id })}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors outline-none flex-1 justify-center ${state.activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
    >
      <Icon className="w-4 h-4" />
      {label} <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-500">{count}</span>
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-300 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="bg-[#f8fafc] w-full max-w-4xl h-[85vh] max-h-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Media, links and docs</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 rounded-full transition-colors outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex bg-white shadow-sm shrink-0 px-2">
          <TabButton id="media" label="Media" icon={ImageIcon} count={mediaFiles.length} />
          <TabButton id="docs" label="Docs" icon={FileText} count={docFiles.length} />
          <TabButton id="links" label="Links" icon={LinkIcon} count={linkFiles.length} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {state.activeTab === 'media' && (
            mediaFiles.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {mediaFiles.map((media, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => media.type_media === 'img' ? onImageClick(media.url) : null}
                    className={`aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 relative flex items-center justify-center ${media.type_media === 'img' ? 'cursor-pointer hover:opacity-90 hover:shadow-md transition-all' : ''}`}
                  >
                    {media.type_media === 'img' && <img src={media.url} alt="media" className="w-full h-full object-cover" />}
                    {media.type_media === 'video' && (
                      <>
                        <video src={media.url} className="w-full h-full object-cover opacity-80" />
                        <Video className="w-8 h-8 text-white absolute drop-shadow-md" />
                      </>
                    )}
                    {media.type_media === 'audio' && <Mic className="w-10 h-10 text-emerald-500" />}
                  </div>
                ))}
              </div>
            ) : <div className="flex items-center justify-center h-full text-slate-400 font-medium">No media found.</div>
          )}

          {state.activeTab === 'docs' && (
            docFiles.length > 0 ? (
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {docFiles.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{doc.name || 'Document'}</p>
                      <p className="text-sm text-slate-500">{doc.size || 'Unknown size'} • {doc.time}</p>
                    </div>
                    <a 
                      href={doc.url} 
                      download={doc.name || 'document'} 
                      className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors border border-slate-200 hover:border-blue-200 outline-none"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : <div className="flex items-center justify-center h-full text-slate-400 font-medium">No documents found.</div>
          )}

          {state.activeTab === 'links' && (
            linkFiles.length > 0 ? (
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {linkFiles.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group outline-none">
                    <div className="bg-blue-50 text-blue-500 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <LinkIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-blue-600 truncate group-hover:underline">{link.url}</p>
                      <p className="text-sm text-slate-400 truncate mt-1">From: {link.msg.sender || 'Chat'} • {link.msg.time}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : <div className="flex items-center justify-center h-full text-slate-400 font-medium">No links found.</div>
          )}

        </div>
      </div>
    </div>
  );
}