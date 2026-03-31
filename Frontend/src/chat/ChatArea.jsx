import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ArrowLeft, EllipsisVertical, Plus, X, Smile, Send, FileText, Video, Heart, Bookmark, Eraser, Trash2, Image as ImageIcon, Music, Users, User, Search } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { BgChat } from './BgChat';

export function ChatArea({ 
  activeChat, messages, onSendMessage, onToggleInfo, onBack, onImageClick, onForwardClick, replyingTo, onSetReply, onDeleteMessage, onAddReaction,
  onToggleFavorite, onToggleImportant, onClearChat, onDeleteChat, onTyping, typingUsers = []
}) {
  const [state, setState] = useState({
    inputText: '',
    mediaPreviews: [],
    showEmojiPicker: false,
    showHeaderMenu: false,
    showAttachMenu: false,
    acceptType: '*/*'
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); 
  const textInputRef = useRef(null); 
  const headerMenuRef = useRef(null); 
  const attachMenuRef = useRef(null);
  const typingTimerRef = useRef(null);

  const emojiList = ['😀','😂','🥰','😎','😭','😡','👍','🙏','🔥','🎉','👀','✨'];

  const stopTyping = () => {
    if (onTyping) {
      clearTimeout(typingTimerRef.current);
      onTyping(false);
    }
  };

  const handleInputChange = (value) => {
    setState(prev => ({ ...prev, inputText: value }));
    if (onTyping) {
      onTyping(true);
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 1200);
    }
  };

  const typingStatus = typingUsers?.length > 0
    ? `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` and ${typingUsers.length - 2} more` : ''} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`
    : '';

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeChat?.id]);

  useEffect(() => {
    if (activeChat) setTimeout(() => textInputRef.current?.focus(), 50);
  }, [activeChat?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
          setState(prev => ({ ...prev, showHeaderMenu: false }));
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
          setState(prev => ({ ...prev, showAttachMenu: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = (e) => {
    if(e) e.preventDefault();
    if (state.inputText.trim() || state.mediaPreviews.length > 0) {
      if (state.mediaPreviews.length > 0) {
        state.mediaPreviews.forEach((media, index) => onSendMessage(index === 0 ? state.inputText : '', media));
      } else {
        onSendMessage(state.inputText);
      }
      setState(prev => ({ ...prev, inputText: '', mediaPreviews: [], showEmojiPicker: false })); 
      textInputRef.current?.focus(); 
      stopTyping();
    }
  };

  const handleAttachClick = (type) => {
    setState(prev => ({ ...prev, acceptType: type, showAttachMenu: false }));
    setTimeout(() => fileInputRef.current?.click(), 50); 
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => {
        const url = URL.createObjectURL(file);
        let type_media = 'doc';
        if (file.type.startsWith('image/')) type_media = 'img';
        else if (file.type.startsWith('video/')) type_media = 'video';
        else if (file.type.startsWith('audio/')) type_media = 'audio';
        return {
          url,
          type_media,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          file
        };
      });
      setState(prev => ({ ...prev, mediaPreviews: [...prev.mediaPreviews, ...newFiles] }));
      e.target.value = ''; 
      textInputRef.current?.focus();
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          pastedFiles.push({ url: URL.createObjectURL(file), type_media: 'img', name: 'Pasted Image', file });
        }
      }
    }
    if (pastedFiles.length > 0) {
        setState(prev => ({ ...prev, mediaPreviews: [...prev.mediaPreviews, ...pastedFiles] }));
    }
  };

  if (!activeChat) { 
    return (
      <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col z-0 max-md:hidden">
        <div className="flex flex-1 flex-col items-center justify-center text-center px-10 relative z-10">
          <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(79,70,229,0.1)] border border-white mb-8"><MessageSquare className="w-24 h-24 text-indigo-500" /></div>
          <h1 className="text-4xl font-semibold text-slate-800 tracking-tight mb-4 font-heading">Campus Connect</h1>
          <p className="text-slate-500 text-[16px] leading-relaxed font-medium max-w-sm">Select a conversation from the sidebar or start a new chat to instantly connect with your college community.</p>
        </div>
      </div>
    );
  }

  const isSendDisabled = !state.inputText.trim() && state.mediaPreviews.length === 0;

  return (
    <div className={`relative flex-1 bg-slate-100 overflow-hidden flex flex-col z-0 max-md:fixed max-md:inset-0 max-md:z-50 ${activeChat ? 'max-md:flex' : 'max-md:hidden'}`}>
      <BgChat />

      <div className="flex h-[60px] items-center justify-between px-6 bg-[#3551FD] border-b border-[#2a45d8] shadow-md shrink-0 z-20 relative">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={onBack} className="hidden max-md:flex items-center justify-center text-white/90 hover:text-white outline-none shrink-0 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-3.5 cursor-pointer min-w-0 group" onClick={onToggleInfo}>
            <div className="h-10 w-10 shrink-0 relative">
              {activeChat.avatar ? (
                <img src={activeChat.avatar} alt="DP" className="h-full w-full rounded-full object-cover shadow-sm border border-white/20 group-hover:border-white/50 transition-colors" />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center bg-white/20 border border-white/20">
                  {activeChat.isGroup ? <Users className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
                </div>
              )}
              {!activeChat.isGroup && <div className={`absolute bottom-0 right-0 w-3 h-3 ${activeChat.online ? 'bg-emerald-400' : 'bg-slate-400'} border-2 border-[#3551FD] rounded-full`}></div>}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[16px] font-semibold text-white truncate group-hover:text-blue-50 transition-colors tracking-tight font-heading">{activeChat.name}</h2>
              <p className="text-[12.5px] font-medium text-blue-100/90 truncate">
                {typingUsers?.length > 0 ? typingStatus : activeChat.isGroup ? `${activeChat.totalMembers || activeChat.members?.length || 0} members` : (activeChat.online ? 'Online' : 'Offline')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative shrink-0" ref={headerMenuRef}>
          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all outline-none shrink-0"><Search className="w-5 h-5" /></button>
          <button onClick={() => setState(prev => ({ ...prev, showHeaderMenu: !prev.showHeaderMenu }))} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all outline-none shrink-0"><EllipsisVertical className="w-5 h-5" /></button>
          {state.showHeaderMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[200] w-64 border border-slate-100 flex flex-col py-2 animate-[fadeIn_0.1s_ease-out]">
              <button onClick={() => { onToggleFavorite(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-slate-700 text-[14.5px] font-medium outline-none transition-colors"><Heart className={`w-5 h-5 ${activeChat.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} /> {activeChat.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</button>
              <button onClick={() => { onToggleImportant(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-slate-700 text-[14.5px] font-medium outline-none transition-colors"><Bookmark className={`w-5 h-5 ${activeChat.isImportant ? 'fill-indigo-500 text-indigo-500' : 'text-slate-400'}`} /> {activeChat.isImportant ? 'Remove Important' : 'Add to Important'}</button>
              <div className="h-px bg-slate-100 my-1.5 mx-4"></div>
              <button onClick={() => { onClearChat(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 text-[14.5px] font-medium outline-none transition-colors"><Eraser className="w-5 h-5 text-red-500" /> Clear Chat</button>
              <button onClick={() => { onDeleteChat(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 text-[14.5px] font-medium outline-none transition-colors"><Trash2 className="w-5 h-5 text-red-500" /> Delete Chat</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 flex flex-col gap-3 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 relative">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} index={idx} msg={msg} activeChat={activeChat} onImageClick={onImageClick} onForwardClick={onForwardClick} onReplyClick={() => onSetReply(msg)} onDeleteClick={() => onDeleteMessage(idx)} onReactionClick={(emoji) => onAddReaction(idx, emoji)} />
        ))}
        <div ref={messagesEndRef} /> 
      </div>

      <div className="relative flex flex-col px-4 sm:px-10 pb-6 pt-2 shrink-0 z-20 bg-transparent">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={state.acceptType} multiple className="hidden" />

        <div className="relative flex-1 flex flex-col bg-white rounded-3xl shadow-[0_8px_30px_rgba(79,70,229,0.08)] border border-slate-300 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all duration-300 w-full overflow-visible">
          
          {replyingTo && (
            <div className="flex justify-between items-center bg-slate-50 border-l-[3px] border-indigo-500 p-2.5 rounded-t-3xl border-b border-slate-100">
              <div className="flex flex-col overflow-hidden flex-1 px-3 py-1">
                <span className="text-[13px] font-bold text-indigo-600 mb-0.5">{replyingTo.type === 'out' ? 'You' : (replyingTo.sender?.name || replyingTo.sender || activeChat.name)}</span>
                <span className="text-[14px] font-medium text-slate-500 truncate">{replyingTo.type_media === 'img' ? '📷 Photo' : (replyingTo.type_media ? '📎 Attachment' : replyingTo.content)}</span>
              </div>
              {replyingTo.type_media === 'img' && replyingTo.url && <img src={replyingTo.url} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-slate-200 mr-4" alt="reply-thumb"/>}
              <button type="button" onClick={() => onSetReply(null)} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-200/50 rounded-full transition-colors outline-none mr-3"><X className="w-5 h-5"/></button>
            </div>
          )}

          {state.mediaPreviews.length > 0 && (
             <div className="flex flex-wrap gap-3 p-4 bg-slate-50/80 border-b border-slate-100 rounded-t-3xl">
                {state.mediaPreviews.map((media, idx) => (
                  <div key={idx} className="relative bg-white rounded-xl shadow-sm border border-slate-100 p-2.5 flex items-center gap-3">
                    <button type="button" onClick={() => setState(prev => ({ ...prev, mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== idx) }))} className="absolute -top-2.5 -right-2.5 bg-white text-slate-500 rounded-full p-1.5 shadow-sm border border-slate-200 hover:text-red-500 z-10 outline-none transition-colors"><X className="w-4 h-4" /></button>
                    {media.type_media === 'img' && <img src={media.url} alt="Preview" className="h-[60px] w-[60px] object-cover rounded-lg border border-slate-100" />}
                    {media.type_media === 'video' && <div className="h-[60px] w-[60px] bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100"><Video className="w-8 h-8 text-rose-500" /></div>}
                    {media.type_media === 'audio' && <div className="h-[60px] w-[60px] bg-teal-50 rounded-lg flex items-center justify-center border border-teal-100"><Music className="w-8 h-8 text-teal-500" /></div>}
                    {media.type_media === 'doc' && <div className="h-[60px] w-[60px] bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100"><FileText className="w-8 h-8 text-amber-500" /></div>}
                    {media.type_media !== 'img' && <div className="flex flex-col w-32 pr-2"><span className="text-[13px] font-semibold text-slate-700 truncate">{media.name}</span><span className="text-[11px] text-slate-500 mt-0.5">{media.size}</span></div>}
                  </div>
                ))}
             </div>
          )}

          <form onSubmit={handleSend} className="flex items-center px-1.5 py-1.5 gap-1.5">
            <div className="relative">
              <button type="button" onClick={() => setState(prev => ({ ...prev, showEmojiPicker: !prev.showEmojiPicker }))} className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100 outline-none"><Smile className="w-[22px] h-[22px]" /></button>
              {state.showEmojiPicker && (
                <div className="absolute bottom-[calc(100%+12px)] -left-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl p-3 grid grid-cols-6 gap-2 z-[100] w-max animate-[fadeIn_0.1s_ease-out] origin-bottom-left">
                  {emojiList.map(emoji => <button key={emoji} type="button" onClick={() => setState(prev => ({ ...prev, inputText: prev.inputText + emoji }))} className="text-2xl hover:bg-slate-50 p-2 rounded-lg transition-transform hover:scale-110 outline-none">{emoji}</button>)}
                </div>
              )}
            </div>

            <div className="relative" ref={attachMenuRef}>
              <button type="button" onClick={() => setState(prev => ({ ...prev, showAttachMenu: !prev.showAttachMenu }))} className={`flex items-center justify-center w-9 h-9 text-slate-400 hover:text-indigo-600 transition-all duration-200 rounded-full hover:bg-slate-100 outline-none ${state.showAttachMenu ? 'rotate-45' : ''}`}><Plus className="w-[22px] h-[22px]" /></button>
              {state.showAttachMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl py-1.5 w-48 z-[100] animate-[fadeIn_0.1s_ease-out]">
                  <button type="button" onClick={() => handleAttachClick('image/*')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14px] font-medium outline-none transition-colors"><div className="bg-indigo-50 p-2 rounded-lg shadow-sm border border-indigo-100"><ImageIcon className="w-[18px] h-[18px] text-indigo-600" /></div> Photos</button>
                  <button type="button" onClick={() => handleAttachClick('video/mp4,video/quicktime,video/webm')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14px] font-medium outline-none transition-colors"><div className="bg-rose-50 p-2 rounded-lg shadow-sm border border-rose-100"><Video className="w-[18px] h-[18px] text-rose-500" /></div> Video</button>
                  <button type="button" onClick={() => handleAttachClick('audio/mp3,audio/wav,audio/ogg')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14px] font-medium outline-none transition-colors"><div className="bg-teal-50 p-2 rounded-lg shadow-sm border border-teal-100"><Music className="w-[18px] h-[18px] text-teal-500" /></div> Audio</button>
                  <button type="button" onClick={() => handleAttachClick('.pdf,.doc,.docx,.txt,.xls')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14px] font-medium outline-none transition-colors"><div className="bg-amber-50 p-2 rounded-lg shadow-sm border border-amber-100"><FileText className="w-[18px] h-[18px] text-amber-500" /></div> Document</button>
                </div>
              )}
            </div>
            
            <input type="text" ref={textInputRef} placeholder="Type your message..." value={state.inputText} onChange={(e) => handleInputChange(e.target.value)} onBlur={stopTyping} onPaste={handlePaste} className="flex-1 bg-transparent px-2 py-1.5 text-[14.5px] outline-none text-slate-700 placeholder:text-slate-400 font-medium" />
            
            <button type="submit" disabled={isSendDisabled} className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-all duration-200 outline-none shrink-0 mr-1 ${isSendDisabled ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed' : 'bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)] hover:-translate-y-[1px]'}`}>
              <Send className="w-[16px] h-[16px] ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}