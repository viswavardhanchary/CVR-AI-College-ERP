import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, User, CheckCheck, FileText, Video as VideoIcon, ChevronDown, Heart, Bookmark, Eraser, Trash2, ArrowLeft } from 'lucide-react';
import { getAvatarColor } from './avatarUtils';
import { useParams, Link } from 'react-router';

export function ChatSidebar({ chats, participants = [], onlineUsers = {}, activeChatId, onSelectChat, onSelectParticipant, onCreateGroup, onToggleFavorite, onToggleImportant, onClearChat, onDeleteChat }) {
  const [state, setState] = useState({
    search: '',
    filter: 'All',
    openDropdown: null,
    showContacts: false
  });
  const { type } = useParams();
  const filteredParticipants = participants.filter(participant => participant.name.toLowerCase().includes(state.search.toLowerCase()));
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && searchRef.current && !searchRef.current.contains(event.target)) {
        setState(prev => ({ ...prev, openDropdown: null, showContacts: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(state.search.toLowerCase());
    if (state.filter === 'Favorites') return matchesSearch && chat.isFavorite;
    if (state.filter === 'Important') return matchesSearch && chat.isImportant;
    return matchesSearch;
  });

  return (
    <div className="flex h-full w-full flex-col border-r border-white/60 bg-white/40 backdrop-blur-xl relative z-10 select-none">
      
      <div className="flex h-[60px] items-center justify-between px-5 bg-[#3551FD] border-b border-[#2a45d8] shadow-md shrink-0 relative z-20">
        <Link to={`/${type}`} className="flex items-center gap-3 group transition-all">
          <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
          <h1 className="text-[19px] font-semibold text-white tracking-wide font-heading">Messages</h1>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={onCreateGroup} className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/25 transition-colors outline-none">
            <Users className="w-3.5 h-3.5" />
            New Group
          </button>
        </div>
      </div>



      <div ref={searchRef} className="px-4 pt-5 pb-3 bg-transparent shrink-0 z-10 relative">
        <div className="flex items-center rounded-xl bg-white/70 px-4 py-2 border border-white shadow-sm focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all duration-300">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input type="text" placeholder="Search or start a new conversation" value={state.search} onFocus={() => setState(prev => ({ ...prev, showContacts: true }))} onChange={(e) => setState(prev => ({ ...prev, search: e.target.value, showContacts: true }))} className="ml-3 w-full bg-transparent text-[13.5px] text-slate-700 outline-none placeholder:text-slate-400 font-medium"/>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-5 py-3 no-scrollbar bg-transparent border-b border-white/60 shrink-0">
        {['All', 'Favorites', 'Important'].map(f => (
          <div key={f} onClick={() => setState(prev => ({ ...prev, filter: f }))} className={`px-4 py-1.5 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-300 border shadow-sm ${state.filter === f ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20' : 'bg-white text-slate-600 border-white/80 hover:bg-slate-50 hover:-translate-y-[1px]'}`}>
            {f}
          </div>
        ))}
      </div>

      {state.showContacts && filteredParticipants.length > 0 && (
        <div className="px-4 py-3 border-b border-white/60 bg-white/30 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[12.5px] font-semibold text-slate-700 uppercase tracking-wide font-heading">College Contacts</h2>
            <span className="text-[11px] text-slate-500 font-medium">{filteredParticipants.length} found</span>
          </div>
          <div className="space-y-1.5">
            {filteredParticipants.slice(0, 6).map(participant => {
              const participantId = participant.user_id || participant._id || participant.id;
              const isOnline = Boolean(onlineUsers[participantId]);
              return (
                <button key={participantId} type="button" onClick={() => { onSelectParticipant(participant); setState(prev => ({ ...prev, showContacts: false, search: '' })); }} className="w-full rounded-xl px-3 py-2.5 flex items-center gap-3 text-left bg-white/80 border border-white hover:border-indigo-300 hover:bg-indigo-50/60 transition-all shadow-sm">
                  <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: getAvatarColor(String(participantId) || participant.name) }}>
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-slate-800">{participant.name}</p>
                    <p className="truncate text-[11.5px] text-slate-500 font-medium capitalize">{participant.user_type || 'College member'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 bg-transparent">
        {filteredChats.map(chat => (
          <div key={chat.id} onClick={() => onSelectChat(chat.id)} className={`relative flex h-[76px] cursor-pointer items-center gap-3 px-4 transition-all duration-200 group border-b border-slate-200 ${activeChatId === chat.id ? 'bg-white/70 border-l-4 border-l-indigo-600 pl-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'hover:bg-white/40 border-l-4 border-l-transparent pl-3 hover:border-l-indigo-300'}`}>
            
            <div className="relative h-12 w-12 shrink-0">
              {chat.avatar ? (
                <img src={chat.avatar} alt="DP" className="h-full w-full rounded-full object-cover shadow-sm group-hover:shadow md:transition-shadow border border-slate-200/60 bg-white" />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center shadow-sm border border-slate-200/60" style={{ backgroundColor: getAvatarColor(String(chat.id) || chat.name) }}>
                  {chat.isGroup ? <Users className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
                </div>
              )}
              <span className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${chat.online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            </div>
            
            <div className="flex flex-1 flex-col justify-center h-full overflow-hidden relative">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`truncate text-[15px] pb-0.5 font-semibold pr-2 tracking-tight ${activeChatId === chat.id ? 'text-indigo-900' : 'text-slate-800'}`}>{chat.name}</span>
                <span className={`text-[11px] font-medium shrink-0 ${chat.unread > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>{chat.time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[13.5px] truncate pr-4">
                  {chat.status === 'read' && <CheckCheck className="h-4 w-4 text-emerald-500 shrink-0" />}
                  {chat.message === '📄 Document' && <FileText className="h-3.5 w-3.5 ml-0.5 text-indigo-500 shrink-0" />}
                  {chat.message === '🎥 Video' && <VideoIcon className="h-3.5 w-3.5 ml-0.5 text-rose-500 shrink-0" />}
                  <span className={`truncate ${activeChatId === chat.id ? 'text-indigo-700/80' : 'text-slate-500'}`}>{chat.message}</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {chat.unread > 0 && <span className="bg-indigo-600 text-white text-[11px] font-bold px-1.5 py-[2px] rounded-full min-w-5 text-center shadow-sm shadow-indigo-500/20">{chat.unread}</span>}
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, openDropdown: prev.openDropdown === chat.id ? null : chat.id })); }} 
                    className={`transition-opacity p-1 outline-none rounded-full hover:bg-white/80 ${activeChatId === chat.id ? 'opacity-100 text-indigo-600 hover:text-indigo-700' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600'}`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {state.openDropdown === chat.id && (
              <div ref={dropdownRef} className="absolute right-4 top-12 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 w-52 py-1.5 border border-slate-100 animate-[fadeIn_0.1s_ease-out]">
                <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-[14px] font-medium transition-colors">
                  <Heart className={`w-4 h-4 ${chat.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} /> {chat.isFavorite ? 'Remove Favorite' : 'Favorite'}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleImportant(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-[14px] font-medium transition-colors">
                  <Bookmark className={`w-4 h-4 ${chat.isImportant ? 'fill-indigo-500 text-indigo-500' : 'text-slate-400'}`} /> {chat.isImportant ? 'Remove Important' : 'Important'}
                </button>
                <div className="h-px bg-slate-100 my-1.5 mx-3"></div>
                <button onClick={(e) => { e.stopPropagation(); onClearChat(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-[14px] font-medium transition-colors">
                  <Eraser className="w-4 h-4 text-red-500" /> Clear Chat
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-[14px] font-medium transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" /> Delete Chat
                </button>
              </div>
            )}

          </div>
        ))}
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
            <Search className="w-8 h-8 opacity-40" />
            <p className="text-[13px] font-medium">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
}