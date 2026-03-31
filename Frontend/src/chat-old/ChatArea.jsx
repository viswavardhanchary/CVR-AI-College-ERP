import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, ArrowLeft, EllipsisVertical, Plus, X, Smile, Send, FileText, Video, Heart, Bookmark, Eraser, Trash2, Image as ImageIcon, Music, Users, User } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

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
      <div className="relative flex-1 bg-white overflow-hidden flex flex-col z-0 max-md:hidden">
        <div className="flex flex-1 flex-col items-center justify-center text-center px-10">
          <div className="w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 mb-10"><MessageSquare className="w-32 h-32 text-blue-600" /></div>
          <h1 className="text-3xl font-light text-[#1e293b] mb-4">ERP Chat</h1>
          <p className="text-[#64748b] text-[14px]">Connect with your college community in real-time.</p>
        </div>
      </div>
    );
  }

  const isSendDisabled = !state.inputText.trim() && state.mediaPreviews.length === 0;

  return (
    <div className={`relative flex-1 bg-[#efeae2] overflow-hidden flex flex-col z-0 max-md:fixed max-md:inset-0 max-md:z-50 ${activeChat ? 'max-md:flex' : 'max-md:hidden'}`}>
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>

      <div className="flex h-14 items-center justify-between px-4 bg-brand-600 border-b border-brand-700 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="hidden max-md:flex items-center justify-center text-blue-200 hover:text-white mr-1 outline-none shrink-0"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={onToggleInfo}>
            <div className="h-10 w-10 shrink-0">{activeChat.avatar ? (
          <img src={activeChat.avatar} alt="DP" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="h-full w-full rounded-full flex items-center justify-center">
            {activeChat.isGroup ? <Users className="h-5.5 w-5.5 text-white" /> : <User className="h-5.5 w-5.5 text-white" />}
          </div>
        )}</div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[15.5px] font-medium text-white truncate">{activeChat.name}</h2>
              <p className="text-[12px] text-blue-200 truncate">{typingUsers?.length > 0 ? typingStatus : activeChat.isGroup ? `${activeChat.totalMembers || activeChat.members?.length || 0} members` : (activeChat.online ? 'online' : 'offline')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5 text-white relative shrink-0" ref={headerMenuRef}>
          <button onClick={() => setState(prev => ({ ...prev, showHeaderMenu: !prev.showHeaderMenu }))} className="hover:text-blue-200 transition-colors outline-none shrink-0"><EllipsisVertical className="w-5 h-5" /></button>
          {state.showHeaderMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl z-200 w-56 border border-slate-200 flex flex-col py-1.5 animate-[fadeIn_0.1s_ease-out]">
              <button onClick={() => { onToggleFavorite(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14.5px] outline-none"><Heart className={`w-4 h-4 ${activeChat.isFavorite ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} /> {activeChat.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</button>
              <button onClick={() => { onToggleImportant(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[14.5px] outline-none"><Bookmark className={`w-4 h-4 ${activeChat.isImportant ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} /> {activeChat.isImportant ? 'Remove Important' : 'Add to Important'}</button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button onClick={() => { onClearChat(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-[14.5px] outline-none"><Eraser className="w-4 h-4 text-red-400" /> Clear Chat</button>
              <button onClick={() => { onDeleteChat(); setState(prev => ({ ...prev, showHeaderMenu: false })); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-[14.5px] outline-none"><Trash2 className="w-4 h-4 text-red-400" /> Delete Chat</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-4 flex flex-col gap-2 z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} index={idx} msg={msg} activeChat={activeChat} onImageClick={onImageClick} onForwardClick={onForwardClick} onReplyClick={() => onSetReply(msg)} onDeleteClick={() => onDeleteMessage(idx)} onReactionClick={(emoji) => onAddReaction(idx, emoji)} />
        ))}
        <div ref={messagesEndRef} /> 
      </div>

      <div className="relative flex flex-col px-4 pb-4 pt-2 shrink-0 z-20 bg-transparent">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={state.acceptType} multiple className="hidden" />

        <div className="relative flex-1 flex flex-col bg-white rounded-xl shadow-md border border-[#e2e8f0] focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300 w-full overflow-visible">
          
          {replyingTo && (
            <div className="flex justify-between items-center bg-slate-50 border-l-4 border-blue-500 p-2 rounded-t-xl border-b">
              <div className="flex flex-col overflow-hidden flex-1 px-2">
                <span className="text-xs font-semibold text-blue-600 mb-0.5">{replyingTo.type === 'out' ? 'You' : (replyingTo.sender?.name || replyingTo.sender || activeChat.name)}</span>
                <span className="text-[13px] text-slate-600 truncate">{replyingTo.type_media === 'img' ? '📷 Photo' : (replyingTo.type_media ? '📎 Attachment' : replyingTo.content)}</span>
              </div>
              {replyingTo.type_media === 'img' && replyingTo.url && <img src={replyingTo.url} className="w-10 h-10 object-cover rounded mr-3" alt="reply-thumb"/>}
              <button type="button" onClick={() => onSetReply(null)} className="text-slate-400 hover:text-slate-700 p-1 bg-white rounded-full shadow-sm outline-none mr-2"><X className="w-4 h-4"/></button>
            </div>
          )}

          {state.mediaPreviews.length > 0 && (
             <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border-b border-slate-100 rounded-t-xl">
                {state.mediaPreviews.map((media, idx) => (
                  <div key={idx} className="relative bg-white rounded-lg shadow-sm border border-slate-200 p-2 flex items-center gap-3">
                    <button type="button" onClick={() => setState(prev => ({ ...prev, mediaPreviews: prev.mediaPreviews.filter((_, i) => i !== idx) }))} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 shadow hover:bg-slate-800 z-10 outline-none"><X className="w-3.5 h-3.5" /></button>
                    {media.type_media === 'img' && <img src={media.url} alt="Preview" className="h-14 w-14 object-cover rounded-md" />}
                    {media.type_media === 'video' && <Video className="w-8 h-8 text-blue-500" />}
                    {media.type_media === 'audio' && <Music className="w-8 h-8 text-emerald-500" />}
                    {media.type_media === 'doc' && <FileText className="w-8 h-8 text-orange-500" />}
                    {media.type_media !== 'img' && <div className="flex flex-col w-32"><span className="text-xs font-medium text-slate-700 truncate">{media.name}</span></div>}
                  </div>
                ))}
             </div>
          )}

          <form onSubmit={handleSend} className="flex items-center px-2 py-1.5 gap-2">
            <div className="relative">
              <button type="button" onClick={() => setState(prev => ({ ...prev, showEmojiPicker: !prev.showEmojiPicker }))} className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-50 outline-none"><Smile className="w-6 h-6" /></button>
              {state.showEmojiPicker && (
                <div className="absolute bottom-[calc(100%+12px)] -left-2 bg-white border border-slate-200 shadow-2xl rounded-xl p-3 grid grid-cols-6 gap-2 z-100 w-max animate-[fadeIn_0.1s_ease-out] origin-bottom-left">
                  {emojiList.map(emoji => <button key={emoji} type="button" onClick={() => setState(prev => ({ ...prev, inputText: prev.inputText + emoji }))} className="text-2xl hover:bg-slate-100 p-1.5 rounded-lg transition-transform hover:scale-110 outline-none">{emoji}</button>)}
                </div>
              )}
            </div>

            <div className="relative" ref={attachMenuRef}>
              <button type="button" onClick={() => setState(prev => ({ ...prev, showAttachMenu: !prev.showAttachMenu }))} className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-50 outline-none"><Plus className="w-6 h-6" /></button>
              {state.showAttachMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-48 z-100 animate-[fadeIn_0.1s_ease-out]">
                  <button type="button" onClick={() => handleAttachClick('image/*')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 outline-none transition-colors"><div className="bg-blue-100 p-2 rounded-full text-blue-600"><ImageIcon className="w-4 h-4" /></div> Photos</button>
                  <button type="button" onClick={() => handleAttachClick('video/mp4,video/quicktime,video/webm')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 outline-none transition-colors"><div className="bg-pink-100 p-2 rounded-full text-pink-600"><Video className="w-4 h-4" /></div> Video</button>
                  <button type="button" onClick={() => handleAttachClick('audio/mp3,audio/wav,audio/ogg')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 outline-none transition-colors"><div className="bg-orange-100 p-2 rounded-full text-orange-600"><Music className="w-4 h-4" /></div> Audio</button>
                  <button type="button" onClick={() => handleAttachClick('.pdf,.doc,.docx,.txt,.xls')} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 outline-none transition-colors"><div className="bg-purple-100 p-2 rounded-full text-purple-600"><FileText className="w-4 h-4" /></div> Document</button>
                </div>
              )}
            </div>
            
            <input type="text" ref={textInputRef} placeholder="Type a message..." value={state.inputText} onChange={(e) => handleInputChange(e.target.value)} onBlur={stopTyping} onPaste={handlePaste} className="flex-1 bg-transparent px-2 py-2 text-[14.5px] outline-none text-[#1e293b]" />
            
            <button type="submit" disabled={isSendDisabled} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-sm outline-none shrink-0 ${isSendDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}