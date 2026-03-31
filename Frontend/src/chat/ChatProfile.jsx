import React, { useState, useMemo } from 'react';
import { X, Image as ImageIcon, ChevronRight, Heart, Bookmark, Eraser, Trash2, Users, User, Search, UserPlus, Video } from 'lucide-react';
import { MediaGalleryModal } from './MediaGalleryModal';
import { getAvatarColor } from './avatarUtils';

export function ChatProfile({ activeChat, messages, onlineUsers = {}, onAddMembers, onExitGroup, onClose, onToggleFavorite, onToggleImportant, onClearChat, onDeleteChat, onImageClick }) {
  const [state, setState] = useState({
    showGallery: false,
    memberSearch: '',
    expandedMembers: false
  });
  
  if (!activeChat) return null;

  const linkRegex = /(https?:\/\/[^\s]+)/;
  const totalItemsCount = messages.filter(m => m.type_media || (m.content && linkRegex.test(m.content))).length;
  const previewMediaFiles = messages.filter(msg => msg.type_media === 'img' || msg.type_media === 'video');

  const actionBtnClass = "flex w-full items-center gap-4 px-6 py-3.5 text-[15px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer group/item outline-none";
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
    <div className="absolute right-0 top-0 h-full w-[350px] md:w-[400px] bg-white/80 backdrop-blur-xl border-l border-white/60 shadow-[-8px_0_30px_rgba(0,0,0,0.02)] flex flex-col z-[100] animate-[slideInRight_0.25s_cubic-bezier(0.16,1,0.3,1)] max-md:fixed max-md:inset-0 max-md:w-full">
      
      <div className="flex h-[60px] items-center px-4 gap-4 bg-[#3551FD] shrink-0 border-b border-[#2a45d8] shadow-md relative z-20">
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full outline-none transition-all"><X className="w-5 h-5" /></button>
        <h3 className="text-white font-semibold text-[16.5px] tracking-tight font-heading">Contact Info</h3>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full pb-10">
        
        <div className="flex flex-col items-center py-8 bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-indigo-100/50 to-transparent"></div>
          <div className="w-36 h-36 mb-4 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(79,70,229,0.15)] border border-white relative bg-indigo-50 flex items-center justify-center z-10 hover:shadow-[0_12px_40px_rgba(79,70,229,0.25)] transition-shadow duration-300">
            {activeChat.avatar ? (
              <img src={activeChat.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-[2.5rem]" style={{ backgroundColor: getAvatarColor(String(activeChat.id) || activeChat.name) }}>
                {activeChat.isGroup ? <Users className="w-14 h-14 text-white" /> : <User className="w-14 h-14 text-white" />}
              </div>
            )}
          </div>
          <h2 className="text-[22px] text-slate-800 font-bold leading-tight text-center px-4 z-10 tracking-tight font-heading">{activeChat.name}</h2>
          <p className="text-slate-500 text-[14.5px] font-medium mt-1 z-10">{activeChat.isGroup ? `Group • ${members.length || 0} members` : (activeChat.online ? 'Online' : 'Offline')}</p>
          {activeChat.isGroup && createdBy && (
            <p className="text-[13px] text-slate-400 mt-2 text-center px-4 z-10">Created by <span className="font-semibold text-slate-600">{createdBy.name}</span>{createdAtLabel ? ` • ${createdAtLabel}` : ''}</p>
          )}
          {!activeChat.isGroup && activeChat.members && activeChat.members[0] && (
            <div className="mt-4 text-left px-6 w-full z-10">
              <div className="flex items-center justify-between mb-2 text-sm text-slate-500">
                <span>Role</span>
                <span className="font-semibold text-slate-700 capitalize">{activeChat.members[0].role || activeChat.members[0].user_type || 'Member'}</span>
              </div>
              <div className="flex items-center justify-between mb-2 text-sm text-slate-500">
                <span>Roll No</span>
                <span className="font-semibold text-slate-700">{activeChat.members[0].roll_no || 'N/A'}</span>
              </div>
              {activeChat.members[0].user_id && (
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>ID</span>
                  <span className="font-semibold text-slate-700 truncate">{String(activeChat.members[0].user_id)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {activeChat.isGroup && (
          <div className="bg-white border-b border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="text-[14px] font-semibold text-slate-800 font-heading">{members.length} members</span>
              <div className="relative group">
                <Search className="w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
                <input 
                  type="text" placeholder="Search members" value={state.memberSearch} onChange={e => setState(prev => ({ ...prev, memberSearch: e.target.value }))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-0 group-hover:w-48 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-full px-3 py-1.5 text-sm outline-none border border-slate-200 font-medium text-slate-700 placeholder:text-slate-400" 
                />
              </div>
            </div>

            <button onClick={() => onAddMembers?.(activeChat)} className="flex w-full items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors outline-none text-left">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100"><UserPlus className="w-5 h-5"/></div>
              <span className="text-[15px] text-indigo-600 font-semibold">Add members</span>
            </button>

            <button onClick={() => onExitGroup?.(activeChat)} className="flex w-full items-center gap-4 px-5 py-3.5 hover:bg-red-50 text-red-600 transition-colors outline-none text-left">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100"><Trash2 className="w-5 h-5"/></div>
              <span className="text-[15px] font-semibold">Leave group</span>
            </button>

            <div className="flex flex-col">
              {displayMembers.map(member => {
                const memberRole = member.role || member.user_type || 'Member';
                const isOnline = Boolean(onlineUsers[String(member.user_id)]);
                const memberId = member.user_id || member.id || member.name;
                return (
                  <div key={memberId} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {member.avatar ? (
                        <img src={member.avatar} alt="DP" className="w-10 h-10 rounded-full object-cover shrink-0 border border-white shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm" style={{ backgroundColor: getAvatarColor(String(memberId) || member.name) }}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14.5px] text-slate-700 font-semibold truncate tracking-tight">{member.name}</span>
                        <span className={`text-[12.5px] font-medium truncate ${isOnline ? 'text-emerald-500' : 'text-slate-500'}`}>{isOnline ? 'Online' : (member.status || memberRole)}</span>
                      </div>
                    </div>
                    {member.isAdmin && <span className="text-[10px] uppercase tracking-wide bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold shrink-0 border border-indigo-100 ml-2">Admin</span>}
                  </div>
                );
              })}
            </div>

            {!state.expandedMembers && !state.memberSearch && members.length > 5 && (
              <button onClick={() => setState(prev => ({ ...prev, expandedMembers: true }))} className="w-full text-center py-3.5 text-indigo-600 font-semibold hover:bg-slate-50 transition-colors border-t border-slate-100 text-[14px]">
                View all ({members.length - 5} more)
              </button>
            )}
          </div>
        )}

        <div onClick={() => setState(prev => ({ ...prev, showGallery: true }))} className="p-5 bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><ImageIcon className="w-4 h-4" /></div>
              <span className="text-[14.5px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Media, links and docs</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold"><span className="text-[13px]">{totalItemsCount}</span><ChevronRight className="w-4 h-4 opacity-60" /></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {previewMediaFiles.length > 0 ? (
              previewMediaFiles.slice(-4).reverse().map((media, idx) => (
                <div key={idx} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                  {media.type_media === 'img' ? <img src={media.url} className="w-full h-full object-cover" alt="media" /> : <div className="w-full h-full bg-slate-100/50 flex items-center justify-center"><Video className="w-6 h-6 text-slate-300"/></div>}
                </div>
              ))
            ) : <p className="text-[13px] font-medium text-slate-400 col-span-4 text-left py-2">No media shared yet.</p>}
          </div>
        </div>

        <div className="bg-white py-2">
           <button onClick={() => onToggleFavorite(activeChat.id)} className={actionBtnClass}><Heart className={`w-5 h-5 ${activeChat.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover/item:text-rose-500'}`} /> <span className="font-medium">{activeChat.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span></button>
           <button onClick={() => onToggleImportant(activeChat.id)} className={actionBtnClass}><Bookmark className={`w-5 h-5 ${activeChat.isImportant ? 'fill-indigo-500 text-indigo-500' : 'text-slate-400 group-hover/item:text-indigo-500'}`} /> <span className="font-medium">{activeChat.isImportant ? 'Remove from Important' : 'Add to Important'}</span></button>
           <div className="h-px bg-slate-100 my-1.5 mx-6"></div>
           <button onClick={() => { if(window.confirm("Clear all messages?")) onClearChat(activeChat.id); }} className={redActionBtnClass}><Eraser className="w-5 h-5 text-red-500" /><span className="font-medium">Clear Chat</span></button>
           <button onClick={() => { if(window.confirm("Delete this chat?")) onDeleteChat(activeChat.id); }} className={redActionBtnClass}><Trash2 className="w-5 h-5 text-red-500" /><span className="font-medium">Delete Chat</span></button>
        </div>

      </div>

      {state.showGallery && <MediaGalleryModal messages={messages} onClose={() => setState(prev => ({ ...prev, showGallery: false }))} onImageClick={onImageClick} />}
    </div>
  );
}