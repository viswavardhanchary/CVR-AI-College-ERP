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
    <div className="fixed inset-0 z-[300] bg-black/20 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.15s_ease-out]" onClick={onClose}>
      <div className="bg-white w-100 max-w-[90vw] rounded-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Forward Message</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center bg-white rounded-xl px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={state.search} 
              onChange={e => setState(prev => ({ ...prev, search: e.target.value }))} 
              className="ml-2 flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          {filteredChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => toggleSelection(chat.id)} 
              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 shadow-sm hover:shadow"
            >
              <input 
                type="checkbox" 
                checked={state.selectedChats.includes(chat.id)} 
                readOnly 
                className="w-4.5 h-4.5 text-indigo-600 rounded bg-white border-slate-300 cursor-pointer focus:ring-indigo-500 transition-colors"
              />
              <div className="h-10 w-10 shrink-0">{chat.avatar ? (
                <img src={chat.avatar} alt="DP" className="h-full w-full rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center bg-indigo-100">
                  {chat.isGroup ? <Users className="h-5 w-5 text-indigo-500" /> : <User className="h-5 w-5 text-indigo-500" />}
                </div>
              )}</div>
              <span className="flex-1 font-medium text-[15px] text-slate-800">{chat.name}</span>
            </div>
          ))}
          {filteredChats.length === 0 && <p className="text-center text-slate-500 text-sm py-4">No chats found.</p>}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            {state.selectedChats.length} {state.selectedChats.length === 1 ? 'chat' : 'chats'} selected
          </span>
          <button 
            disabled={state.selectedChats.length === 0}
            onClick={() => onForward(state.selectedChats)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 outline-none ${state.selectedChats.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/30 hover:-translate-y-[1px]' : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'}`}
          >
            <Send className="w-4 h-4 ml-0.5" /> Send
          </button>
        </div>

      </div>
    </div>
  );
}