import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, User, CheckCheck, FileText, Video as VideoIcon, ChevronDown, Heart, Bookmark, Eraser, Trash2 } from 'lucide-react';
import { getAvatarColor } from './avatarUtils';
import { useParams,Link } from 'react-router';

export function ChatSidebar({ chats, participants = [], onlineUsers = {}, activeChatId, onSelectChat, onSelectParticipant, onCreateGroup, onToggleFavorite, onToggleImportant, onClearChat, onDeleteChat }) {
  const [state, setState] = useState({
    search: '',
    filter: 'All',
    openDropdown: null,
    showContacts: false
  });
  const {type} = useParams();
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
    <div className="flex h-full w-full flex-col border-r border-[#e2e8f0] bg-[#f8fafc] relative select-none">
      
      <div className="flex h-14 items-center justify-between px-4 bg-blue-600 border-b border-blue-700 shrink-0">
        <h1 className="text-[17px] font-medium text-white">Chats</h1>
        <button onClick={onCreateGroup} className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors outline-none">
          <Users className="w-4 h-4" />
          Create Group
        </button>
      </div>
      <Link to={`/${type}`}>Back to Dashboard</Link>
      <div ref={searchRef} className="px-3 pb-2 pt-3 bg-[#ffffff] shrink-0 relative">
        <div className="flex items-center rounded-lg bg-[#f1f5f9] px-3 py-1.5 border border-[#e2e8f0] transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4 w-4 text-[#94a3b8]" />
          <input type="text" placeholder="Search or start a new chat" value={state.search} onFocus={() => setState(prev => ({ ...prev, showContacts: true }))} onChange={(e) => setState(prev => ({ ...prev, search: e.target.value, showContacts: true }))} className="ml-3 w-full bg-transparent text-[13px] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"/>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 no-scrollbar bg-[#f8fafc] border-b border-[#e2e8f0] shrink-0">
        {['All', 'Favorites', 'Important'].map(f => (
          <div key={f} onClick={() => setState(prev => ({ ...prev, filter: f }))} className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-300 border ${state.filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-[#f1f5f9]'}`}>
            {f}
          </div>
        ))}
      </div>

      {state.showContacts && (
      <div className="px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-[#334155]">College Contacts</h2>
          <span className="text-[11px] text-[#64748b]">{filteredParticipants.length} found</span>
        </div>
        <div className="space-y-2">
          {filteredParticipants.slice(0, 6).map(participant => {
            const participantId = participant.user_id || participant._id || participant.id;
            const isOnline = Boolean(onlineUsers[participantId]);
            return (
              <button key={participantId} type="button" onClick={() => { onSelectParticipant(participant); setState(prev => ({ ...prev, showContacts: false, search: '' })); }} className="w-full rounded-xl px-3 py-2 flex items-center gap-3 text-left bg-white border border-[#e2e8f0] hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden bg-slate-100">
                  {participant.avatar ? (
                    <img src={participant.avatar} alt={participant.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white ${isOnline ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-medium text-[#0f172a]">{participant.name}</p>
                  <p className="truncate text-[11px] text-[#64748b]">{participant.user_type || 'College member'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
        {filteredChats.map(chat => (
          <div key={chat.id} onClick={() => onSelectChat(chat.id)} className={`relative flex h-18 cursor-pointer items-center gap-3 px-3 transition-colors group ${activeChatId === chat.id ? 'bg-brand-50' : 'hover:bg-[#f1f5f9]'}`}>
            
            <div className="relative h-12 w-12 shrink-0">
              {chat.avatar ? (
                <img src={chat.avatar} alt="DP" className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center" style={{ backgroundColor: getAvatarColor(chat.id || chat.name) }}>
                  {chat.isGroup ? <Users className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
                </div>
              )}
              <span className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white ${chat.online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            </div>
            
            <div className="flex flex-1 flex-col justify-center border-b border-[#f1f5f9] h-full overflow-hidden relative">
              <div className="flex items-center justify-between">
                <span className="truncate text-[15.5px] font-medium text-[#1e293b] pr-2">{chat.name}</span>
                <span className={`text-[11px] ${chat.unread > 0 ? 'text-brand-600' : 'text-[#64748b]'}`}>{chat.time}</span>
              </div>
              
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center gap-1 text-[13px] text-[#64748b] truncate pr-4">
                  {chat.status === 'read' && <CheckCheck className="h-3.5 w-3.5 text-[#10b981]" />}
                  {chat.message === '📄 Document' && <FileText className="h-3 w-3 ml-0.5" />}
                  {chat.message === '🎥 Video' && <VideoIcon className="h-3 w-3 ml-0.5" />}
                  <span className="truncate">{chat.message}</span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {chat.unread > 0 && <span className="bg-brand-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">{chat.unread}</span>}
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setState(prev => ({ ...prev, openDropdown: prev.openDropdown === chat.id ? null : chat.id })); }} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-blue-600 text-slate-400 outline-none"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {state.openDropdown === chat.id && (
              <div ref={dropdownRef} className="absolute right-4 top-10 bg-white rounded-lg shadow-xl z-50 w-48 py-1 border border-slate-200 animate-[fadeIn_0.1s_ease-out]">
                <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-[14px]">
                  <Heart className={`w-4 h-4 ${chat.isFavorite ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} /> Favorite
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleImportant(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 text-[14px]">
                  <Bookmark className={`w-4 h-4 ${chat.isImportant ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} /> Important
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button onClick={(e) => { e.stopPropagation(); onClearChat(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-[14px]">
                  <Eraser className="w-4 h-4 text-red-400" /> Clear Chat
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); setState(prev => ({ ...prev, openDropdown: null })); }} className="flex w-full items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-[14px]">
                  <Trash2 className="w-4 h-4 text-red-400" /> Delete Chat
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}