import React, { useState } from 'react';
import { X, Search, Send, Users, User } from 'lucide-react';

export function ForwardModal({ chats, onClose, onForward }) {
  const [state, setState] = useState({
    search: '',
    selectedChats: []
  });
  
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(state.search.toLowerCase()));

  const toggleSelection = (id) => {
    setState(prev => ({
      ...prev,
      selectedChats: prev.selectedChats.includes(id) 
        ? prev.selectedChats.filter(chatId => chatId !== id) 
        : [...prev.selectedChats, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-300 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.15s_ease-out]" onClick={onClose}>
      <div className="bg-white w-100 max-w-[90vw] rounded-xl shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-medium text-slate-800">Forward Message</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={state.search} 
              onChange={e => setState(prev => ({ ...prev, search: e.target.value }))} 
              className="ml-2 flex-1 outline-none text-sm text-slate-700 bg-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
          {filteredChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => toggleSelection(chat.id)} 
              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                checked={state.selectedChats.includes(chat.id)} 
                readOnly 
                className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
              />
              <div className="h-10 w-10 shrink-0">{chat.avatar ? (
          <img src={chat.avatar} alt="DP" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="h-full w-full rounded-full flex items-center justify-center">
            {chat.isGroup ? <Users className="h-5.5 w-5.5 text-white" /> : <User className="h-5.5 w-5.5 text-white" />}
          </div>
        )}</div>
              <span className="flex-1 font-medium text-[15px] text-slate-700">{chat.name}</span>
            </div>
          ))}
          {filteredChats.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No chats found.</p>}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {state.selectedChats.length} {state.selectedChats.length === 1 ? 'chat' : 'chats'} selected
          </span>
          <button 
            disabled={state.selectedChats.length === 0}
            onClick={() => onForward(state.selectedChats)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors ${state.selectedChats.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>

      </div>
    </div>
  );
}