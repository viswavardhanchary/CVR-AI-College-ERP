import React, { useState, useMemo } from 'react';
import { X, Image as ImageIcon, ChevronRight, Heart, Bookmark, Eraser, Trash2, Users, User, Search, UserPlus, ShieldCheck } from 'lucide-react';
import { MediaGalleryModal } from './MediaGalleryModal';
import { getAvatarColor } from './avatarUtils';

export function ChatProfile({ activeChat, messages, onlineUsers = {}, onAddMembers, onClose, onToggleFavorite, onToggleImportant, onClearChat, onDeleteChat, onImageClick }) {
  const [state, setState] = useState({
    showGallery: false,
    memberSearch: '',
    expandedMembers: false
  });
  
  if (!activeChat) return null;

  const linkRegex = /(https?:\/\/[^\s]+)/;
  const totalItemsCount = messages.filter(m => m.type_media || (m.content && linkRegex.test(m.content))).length;
  const previewMediaFiles = messages.filter(msg => msg.type_media === 'img' || msg.type_media === 'video');

  const actionBtnClass = "flex w-full items-center gap-4 px-6 py-3.5 text-[15px] text-[#1e293b] hover:bg-[#f8fafc] transition-colors cursor-pointer group/item outline-none";
  const redActionBtnClass = "flex w-full items-center gap-4 px-6 py-3.5 text-[15px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer group/item outline-none";

  const members = activeChat.members || [];
  const createdBy = activeChat.createdBy || activeChat.participants?.find(participant => participant.user_type === 'admin') || activeChat.participants?.[0] || null;
  const createdAtLabel = activeChat.createdAt ? new Date(activeChat.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const filteredMembers = useMemo(() => {
    if (!state.memberSearch.trim()) return members;
    return members.filter(m => m.name.toLowerCase().includes(state.memberSearch.toLowerCase()));
  }, [members, state.memberSearch]);
  
  const displayMembers = state.expandedMembers || state.memberSearch ? filteredMembers : filteredMembers.slice(0, 5);

  return (
    <div className="absolute right-0 top-0 h-full w-87.5 md:w-100 bg-[#f1f5f9] border-l border-[#e2e8f0] shadow-[-4px_0_20px_rgba(0,0,0,0.1)] flex flex-col z-100 animate-[slideInRight_0.2s_ease-out] max-md:fixed max-md:inset-0 max-md:w-full">
      
      <div className="flex h-14 items-center px-4 gap-6 bg-brand-600 shrink-0 border-b border-brand-700">
        <button onClick={onClose} className="text-white hover:bg-blue-700 p-1.5 rounded-full outline-none"><X className="w-5 h-5" /></button>
        <h3 className="text-white font-medium text-[16px]">Contact Info</h3>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 pb-10">
        
        <div className="flex flex-col items-center py-8 bg-[#ffffff] shadow-sm mb-2">
          <div className="w-40 h-40 mb-4 rounded-full overflow-hidden border-4 border-[#f1f5f9] shadow-sm relative bg-slate-100 flex items-center justify-center">
            {activeChat.avatar ? (
              <img src={activeChat.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-green-500">
                {activeChat.isGroup ? <Users className="w-20 h-20 text-white" /> : <User className="w-20 h-20 text-white" />}
              </div>
            )}
          </div>
          <h2 className="text-[22px] text-[#1e293b] font-medium leading-tight text-center px-4">{activeChat.name}</h2>
          <p className="text-[#64748b] text-[14px] mt-1">{activeChat.isGroup ? `Group • ${members.length || 0} members` : (activeChat.online ? 'online' : 'offline')}</p>
          {activeChat.isGroup && createdBy && (
            <p className="text-[13px] text-slate-500 mt-2 text-center px-4">Created by <span className="font-medium text-slate-700">{createdBy.name}</span>{createdAtLabel ? ` • ${createdAtLabel}` : ''}</p>
          )}
          {!activeChat.isGroup && activeChat.members && activeChat.members[0] && (
            <div className="mt-4 text-left px-6 w-full">
              <div className="flex items-center justify-between mb-2 text-sm text-[#64748b]">
                <span>Role</span>
                <span className="font-medium text-[#1e293b] capitalize">{activeChat.members[0].role || activeChat.members[0].user_type || 'Member'}</span>
              </div>
              <div className="flex items-center justify-between mb-2 text-sm text-[#64748b]">
                <span>Roll No</span>
                <span className="font-medium text-[#1e293b]">{activeChat.members[0].roll_no || 'N/A'}</span>
              </div>
              {activeChat.members[0].user_id && (
                <div className="flex items-center justify-between text-sm text-[#64748b]">
                  <span>ID</span>
                  <span className="font-medium text-[#1e293b] truncate">{String(activeChat.members[0].user_id)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {activeChat.isGroup && (
          <div className="bg-white shadow-sm mb-2">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span className="text-[14px] font-medium text-slate-500">{members.length} members</span>
              <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />
                <input 
                  type="text" placeholder="Search members" value={state.memberSearch} onChange={e => setState(prev => ({ ...prev, memberSearch: e.target.value }))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-0 group-hover:w-48 opacity-0 group-hover:opacity-100 transition-all bg-slate-100 rounded-full px-3 py-1 text-sm outline-none border border-slate-200" 
                />
              </div>
            </div>

            <button onClick={() => onAddMembers?.(activeChat)} className="flex w-full items-center gap-4 px-6 py-3 hover:bg-[#f8fafc] transition-colors outline-none text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm"><UserPlus className="w-5 h-5"/></div>
              <span className="text-[15px] text-[#1e293b] font-medium">Add members</span>
            </button>
            <button onClick={() => onExitGroup?.(activeChat)} className="flex w-full items-center gap-4 px-6 py-3 hover:bg-red-50 text-red-600 transition-colors outline-none text-left">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm"><Trash2 className="w-5 h-5"/></div>
              <span className="text-[15px] font-medium">Leave group</span>
            </button>

            <div className="flex flex-col">
              {displayMembers.map(member => {
                const memberRole = member.role || member.user_type || 'Member';
                const isOnline = Boolean(onlineUsers[String(member.user_id)]);
                return (
                  <div key={member.user_id || member.id || member.name} className="flex items-center justify-between px-6 py-2.5 hover:bg-[#f8fafc] cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      {member.avatar ? (
                        <img src={member.avatar} alt="DP" className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-slate-200" style={{ backgroundColor: getAvatarColor(String(member.user_id) || member.name) }}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] text-[#1e293b] font-medium truncate">{member.name}</span>
                          <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{memberRole}</span>
                        </div>
                        <span className={`text-[13px] ${isOnline ? 'text-emerald-600' : 'text-[#64748b]'}`}>
                          {isOnline ? 'Online' : (member.status || 'Offline')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!state.expandedMembers && !state.memberSearch && members.length > 5 && (
              <button onClick={() => setState(prev => ({ ...prev, expandedMembers: true }))} className="w-full text-center py-4 text-blue-600 font-medium hover:bg-slate-50 transition-colors border-t border-slate-100 text-[14px]">
                View all ({members.length - 5} more)
              </button>
            )}
          </div>
        )}

        <div onClick={() => setState(prev => ({ ...prev, showGallery: true }))} className="p-4 px-6 bg-[#ffffff] mb-2 shadow-sm hover:bg-[#f8fafc] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[#64748b]">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[14px] text-[#475569] group-hover:text-brand-600 transition-colors">Media, links and docs</span>
            </div>
            <div className="flex items-center gap-1 text-[#64748b]"><span className="text-[14px]">{totalItemsCount}</span><ChevronRight className="w-4 h-4 opacity-50" /></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {previewMediaFiles.length > 0 ? (
              previewMediaFiles.slice(-4).reverse().map((media, idx) => (
                <div key={idx} className="aspect-square bg-[#f1f5f9] rounded-lg overflow-hidden border border-[#e2e8f0]">
                  {media.type_media === 'img' ? <img src={media.url} className="w-full h-full object-cover" alt="media" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Video className="w-6 h-6 text-white"/></div>}
                </div>
              ))
            ) : <p className="text-xs text-slate-400 col-span-4 text-left py-2">No media shared yet.</p>}
          </div>
        </div>

        <div className="bg-[#ffffff] shadow-sm mb-8 py-2">
           <button onClick={() => onToggleFavorite(activeChat.id)} className={actionBtnClass}><Heart className={`w-5 h-5 ${activeChat.isFavorite ? 'fill-blue-500 text-blue-500' : 'text-slate-400 group-hover/item:text-blue-500'}`} /> {activeChat.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</button>
           <button onClick={() => onToggleImportant(activeChat.id)} className={actionBtnClass}><Bookmark className={`w-5 h-5 ${activeChat.isImportant ? 'fill-blue-500 text-blue-500' : 'text-slate-400 group-hover/item:text-blue-500'}`} /> {activeChat.isImportant ? 'Remove from Important' : 'Add to Important'}</button>
           <div className="h-px bg-slate-100 my-1 mx-6"></div>
           <button onClick={() => { if(window.confirm("Clear all messages?")) onClearChat(activeChat.id); }} className={redActionBtnClass}><Eraser className="w-5 h-5 text-red-400" /><span>Clear Chat</span></button>
           <button onClick={() => { if(window.confirm("Delete this chat?")) onDeleteChat(activeChat.id); }} className={redActionBtnClass}><Trash2 className="w-5 h-5 text-red-400" /><span>Delete Chat</span></button>
        </div>

      </div>

      {state.showGallery && <MediaGalleryModal messages={messages} onClose={() => setState(prev => ({ ...prev, showGallery: false }))} onImageClick={onImageClick} />}
    </div>
  );
}