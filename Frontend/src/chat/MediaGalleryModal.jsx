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
      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-all duration-300 outline-none flex-1 justify-center ${state.activeTab === id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[14px]">{label}</span>
      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${state.activeTab === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-[400] bg-black/20 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 backdrop-blur-xl w-full max-w-4xl h-[85vh] max-h-[800px] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-white/60"
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex h-[64px] items-center justify-between px-6 bg-[#3551FD] border-b border-[#2a45d8] shrink-0 relative z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-xl text-white border border-white/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[18px] font-bold text-white tracking-tight font-heading">Media, links and docs</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-full transition-all outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex bg-white/50 border-b border-slate-100 shrink-0 px-2 font-body">
          <TabButton id="media" label="Media" icon={ImageIcon} count={mediaFiles.length} />
          <TabButton id="docs" label="Docs" icon={FileText} count={docFiles.length} />
          <TabButton id="links" label="Links" icon={LinkIcon} count={linkFiles.length} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-indigo-200 transition-colors font-body">
          
          {state.activeTab === 'media' && (
            mediaFiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.map((media, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => media.type_media === 'img' ? onImageClick(media.url) : null}
                    className={`aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative flex items-center justify-center group ${media.type_media === 'img' ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}`}
                  >
                    {media.type_media === 'img' && <img src={media.url} alt="media" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                    {media.type_media === 'video' && (
                      <>
                        <video src={media.url} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <Video className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </>
                    )}
                    {media.type_media === 'audio' && (
                      <div className="flex flex-col items-center gap-2">
                        <Mic className="w-12 h-12 text-indigo-500" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audio</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-full border border-slate-100"><ImageIcon className="w-12 h-12 opacity-20" /></div>
                  <p className="font-semibold text-[15px]">No media shared yet</p>
                </div>
          )}

          {state.activeTab === 'docs' && (
            docFiles.length > 0 ? (
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {docFiles.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:bg-white transition-all duration-300 group">
                    <div className="bg-amber-50 text-amber-500 p-4 rounded-xl shadow-sm border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-[15px] truncate">{doc.name || 'Document'}</p>
                      <p className="text-[13px] text-slate-500 font-medium">{doc.size || 'Unknown size'} • {doc.time}</p>
                    </div>
                    <a 
                      href={doc.url} 
                      download={doc.name || 'document'} 
                      className="p-3 bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-100 hover:border-indigo-600 shadow-sm outline-none"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-full border border-slate-100"><FileText className="w-12 h-12 opacity-20" /></div>
                  <p className="font-semibold text-[15px]">No documents shared yet</p>
                </div>
          )}

          {state.activeTab === 'links' && (
            linkFiles.length > 0 ? (
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {linkFiles.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white/70 p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:bg-white transition-all duration-300 group outline-none">
                    <div className="bg-indigo-50 text-indigo-500 p-4 rounded-xl shadow-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <LinkIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-indigo-600 text-[15px] truncate group-hover:underline tracking-tight">{link.url}</p>
                      <p className="text-[13px] text-slate-500 font-medium truncate mt-1">From: {link.msg.sender || 'Chat'} • {link.msg.time}</p>
                    </div>
                    <div className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors"><LinkIcon className="w-5 h-5" /></div>
                  </a>
                ))}
              </div>
            ) : <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-full border border-slate-100"><LinkIcon className="w-12 h-12 opacity-20" /></div>
                  <p className="font-semibold text-[15px]">No links shared yet</p>
                </div>
          )}

        </div>
      </div>
    </div>
  );
}