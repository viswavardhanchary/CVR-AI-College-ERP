import React, { useState, useRef, useEffect } from 'react';
import { Users, User, CheckCheck, FileText, Video, Pin, ChevronDown, Heart, Bookmark, Eraser, Trash2 } from 'lucide-react';
import { getAvatarColor } from './avatarUtils';

export const ChatCard = ({ chat, isActive, onSelect, onToggleFavorite, onToggleImportant }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(chat.id);
    setIsDropdownOpen(false);
  };

  const handleImportantClick = (e) => {
    e.stopPropagation();
    onToggleImportant(chat.id);
    setIsDropdownOpen(false);
  };



  return (
    <div onClick={() => onSelect(chat.id)} className={`chat-card relative flex h-18 cursor-pointer items-center gap-3 px-3 hover:bg-[#f1f5f9] transition-colors group ${isActive ? 'bg-brand-50' : ''}`}>
      
      <div className="relative h-12 w-12 shrink-0">
        {chat.avatar ? (
          <img src={chat.avatar} alt="DP" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="h-full w-full rounded-full flex items-center justify-center">
            {chat.isGroup ? <Users className="h-5.5 w-5.5 text-white" /> : <User className="h-5.5 w-5.5 text-white" />}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center border-b border-[#f1f5f9] h-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={`truncate text-[15.5px] font-medium ${chat.unread > 0 ? 'text-[#1e293b]' : 'text-[#1e293b]'}`}>{chat.name}</span>
          <span className={`text-[11px] ${chat.unread > 0 ? 'text-brand-600' : 'text-[#64748b]'}`}>{chat.time}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1 text-[13px] text-[#64748b] truncate">
            {chat.status === 'read' && <CheckCheck className="h-3.5 w-3.5 text-[#10b981]" />}
            <span className="truncate">{chat.message}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="dropdown-trigger opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-brand-600 text-[#94a3b8]" onClick={handleDropdownClick}>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl z-50 min-w-55 py-1 border border-slate-200 animate-[fadeIn_0.1s_ease-out]">
          
          <button onClick={handleFavoriteClick} className="flex w-full items-center gap-4 px-6 py-2.5 text-[14.5px] text-[#475569] hover:bg-[#f8fafc] group/item rounded-lg whitespace-nowrap">
            <Heart className={`h-4 w-4 ${chat.isFavorite ? 'fill-red-500 text-red-500' : 'text-[#94a3b8] group-hover/item:text-brand-600'}`} /> 
            {chat.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          </button>
          
          <button onClick={handleImportantClick} className="flex w-full items-center gap-4 px-6 py-2.5 text-[14.5px] text-[#475569] hover:bg-[#f8fafc] group/item rounded-lg whitespace-nowrap">
            <Bookmark className={`h-4 w-4 ${chat.isImportant ? 'fill-yellow-500 text-yellow-500' : 'text-[#94a3b8] group-hover/item:text-brand-600'}`} /> 
            {chat.isImportant ? 'Remove from Important' : 'Add to Important'}
          </button>
          
          <hr className="border-[#f1f5f9] my-1" />
          
          <button onClick={(e) => e.stopPropagation()} className="flex w-full items-center gap-4 px-6 py-2.5 text-[14.5px] text-[#475569] hover:bg-red-50 group/item rounded-lg whitespace-nowrap">
            <Eraser className="h-4 w-4 text-[#94a3b8] group-hover/item:text-red-500" /> Clear chat
          </button>
          <button onClick={(e) => e.stopPropagation()} className="flex w-full items-center gap-4 px-6 py-2.5 text-[14.5px] text-red-600 hover:bg-red-50 group/item rounded-lg whitespace-nowrap">
            <Trash2 className="h-4 w-4 text-[#94a3b8] group-hover/item:text-red-600" /> Delete chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatCard;