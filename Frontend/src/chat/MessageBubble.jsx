import React, { useState, useEffect, useRef } from "react";
import {
  CheckCheck,
  Copy,
  Forward,
  Reply,
  Trash2,
  Download,
  ChevronDown,
  FileText,
} from "lucide-react";

export function MessageBubble({
  index,
  msg,
  activeChat,
  onImageClick,
  onForwardClick,
  onReplyClick,
  onDeleteClick,
  onReactionClick,
}) {
  const [state, setState] = useState({
    copied: false,
    menuOpen: false
  });
  
  const menuRef = useRef(null);

  const isOut = msg.type === "out";
  const isGroupIn = !isOut && activeChat?.isGroup;
  const forceWhite = msg.type_media === "img";
  const hasForwardedFrom = Boolean(msg.forwardedFrom && (msg.forwardedFrom.originalSender?.name || msg.forwardedFrom.messageId || msg.forwardedFrom.text || msg.forwardedFrom.url || msg.forwardedFrom.caption));
  const senderName = typeof msg.sender === 'string'
    ? msg.sender
    : msg.sender?.name || msg.sender?.user_id || msg.sender?.userId || 'Unknown';
  const replySenderName = msg.replyTo?.sender
    ? (typeof msg.replyTo.sender === 'string'
        ? msg.replyTo.sender
        : msg.replyTo.sender?.name || msg.replyTo.sender?.user_id || msg.replyTo.sender?.userId || 'Unknown')
    : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setState(prev => ({ ...prev, menuOpen: false }));
      }
    };
    if (state.menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.menuOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content || "");
    setState(prev => ({ ...prev, copied: true }));
    setTimeout(() => setState(prev => ({ ...prev, copied: false })), 2000);
  };

  const handleDownloadMedia = () => {
    if (!msg.url) return;
    const a = document.createElement("a");
    a.href = msg.url;
    a.download = msg.name || msg.caption || `download_${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const bubbleOutClass = forceWhite
    ? `bg-white text-[#1e293b] rounded-[12px_0_12px_12px] after:content-[''] after:absolute after:-right-[8px] after:top-[-1px] after:w-3 after:h-3 after:bg-white after:[clip-path:polygon(0_0,100%_0,0_100%)]`
    : `bg-[#2563eb] text-white rounded-[12px_0_12px_12px] after:content-[''] after:absolute after:-right-[8px] after:top-[-1px] after:w-3 after:h-3 after:bg-[#2563eb] after:[clip-path:polygon(0_0,100%_0,0_100%)]`;

  const bubbleInClass = `bg-white text-[#1e293b] rounded-[0_12px_12px_12px] border border-[#e2e8f0] before:content-[''] before:absolute before:-left-[8px] before:top-[-1px] before:w-3 before:h-3 before:bg-white before:border-l before:border-t before:border-[#e2e8f0] before:[clip-path:polygon(100%_0,0_0,100%_100%)]`;

  const bubbleClass = `relative shadow-sm w-fit max-w-full ${isOut ? bubbleOutClass : bubbleInClass}`;
  const availableEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  return (
    <div
      className={`flex ${isOut ? "justify-end" : "justify-start"} w-full mb-2`}
    >
      {isGroupIn && (
        <div className="h-8 w-8 rounded-full overflow-hidden mr-2 mt-1 shrink-0">
          <img
            src={
              msg.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`
            }
            alt="sender"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className={`flex flex-col ${isOut ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%] relative group`}
      >
        {isGroupIn && senderName && (
          <span className="text-[13px] font-medium text-brand-600 ml-1 mb-1">
            {senderName}
          </span>
        )}

        <div className={bubbleClass} onMouseLeave={() => !state.menuOpen}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setState(prev => ({ ...prev, menuOpen: !prev.menuOpen }));
            }}
            className={`absolute top-1 ${isOut ? "left-1" : "right-1"} p-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-500 hover:text-slate-800 z-10 transition-opacity outline-none ${state.menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {state.menuOpen && (
            <div
              ref={menuRef}
              className={`absolute top-8 ${isOut ? "right-full mr-2" : "left-full ml-2"} bg-white border border-slate-200 shadow-xl rounded-xl z-100 w-52 flex flex-col overflow-hidden animate-[fadeIn_0.1s_ease-out]`}
            >
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReactionClick(emoji);
                      setState(prev => ({ ...prev, menuOpen: false }));
                    }}
                    className="text-lg hover:scale-125 transition-transform outline-none leading-none"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex flex-col py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplyClick();
                    setState(prev => ({ ...prev, menuOpen: false }));
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 text-slate-700 text-[14px] outline-none"
                >
                  <Reply className="w-4 h-4 text-slate-400" /> Reply
                </button>
                {!msg.type_media && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                      setState(prev => ({ ...prev, menuOpen: false }));
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 text-slate-700 text-[14px] outline-none"
                  >
                    <Copy className="w-4 h-4 text-slate-400" /> Copy
                  </button>
                )}
                {msg.type_media && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadMedia();
                      setState(prev => ({ ...prev, menuOpen: false }));
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 text-slate-700 text-[14px] outline-none"
                  >
                    <Download className="w-4 h-4 text-slate-400" /> Download
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onForwardClick(msg);
                    setState(prev => ({ ...prev, menuOpen: false }));
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 text-slate-700 text-[14px] outline-none"
                >
                  <Forward className="w-4 h-4 text-slate-400" /> Forward
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick();
                    setState(prev => ({ ...prev, menuOpen: false }));
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-[14px] outline-none mt-1 border-t border-slate-100 pt-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" /> Delete
                </button>
              </div>
            </div>
          )}

          {hasForwardedFrom && (
            <div className="m-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-500">
              Forwarded from {msg.forwardedFrom.originalSender?.name || 'Unknown'}
            </div>
          )}
          {msg.replyTo && (
            <div
              className={`m-1.5 flex cursor-pointer rounded-lg overflow-hidden ${isOut && !forceWhite ? "bg-black/10 border-l-blue-300" : "bg-slate-100 border-l-blue-500"} border-l-4`}
            >
              <div className="flex flex-col flex-1 px-2.5 py-1.5 justify-center min-w-0">
                <span
                  className={`text-[12px] font-bold ${isOut && !forceWhite ? "text-blue-200" : "text-blue-600"} mb-0.5`}
                >
                  {msg.replyTo.type === "out"
                    ? "You"
                    : replySenderName || activeChat.name}
                </span>
                <span
                  className={`text-[13.5px] truncate opacity-90 ${isOut && !forceWhite ? "text-white" : "text-slate-600"}`}
                >
                  {msg.replyTo.type_media === "img"
                    ? "📷 Photo"
                    : msg.replyTo.type_media
                      ? `📎 Attachment`
                      : msg.replyTo.content}
                </span>
              </div>
              {msg.replyTo.type_media === "img" && msg.replyTo.url && (
                <div className="w-12 h-12 shrink-0 ml-2">
                  <img
                    src={msg.replyTo.url}
                    className="w-full h-full object-cover"
                    alt="reply-thumb"
                  />
                </div>
              )}
            </div>
          )}

          <div className={msg.type_media ? "p-1.5" : "px-3 pt-2 pb-1.5"}>
            {msg.type_media === "img" && (
              <div className="relative group/image max-w-70">
                <img
                  src={msg.url}
                  alt="attachment"
                  onClick={() => onImageClick(msg.url)}
                  className="rounded-md w-full h-auto object-cover cursor-pointer"
                />
              </div>
            )}
            {msg.type_media === "video" && (
              <div className="max-w-75">
                <video
                  src={msg.url}
                  controls
                  className="w-full rounded-md bg-black"
                />
              </div>
            )}
            {msg.type_media === "audio" && (
              <div className="w-62.5 p-1">
                <audio src={msg.url} controls className="w-full h-10" />
              </div>
            )}
            {msg.type_media === "doc" && (
              <a
                href={msg.url}
                download={msg.name || msg.caption}
                className={`flex items-center gap-3 p-3 rounded-lg min-w-50 mb-1 ${isOut && !forceWhite ? "bg-blue-700/50 hover:bg-blue-700" : "bg-slate-100 hover:bg-slate-200"} transition-colors`}
              >
                <div
                  className={`p-2 rounded-full ${isOut && !forceWhite ? "bg-blue-500/50" : "bg-white shadow-sm"}`}
                >
                  <FileText
                    className={`w-6 h-6 ${isOut && !forceWhite ? "text-white" : "text-blue-500"}`}
                  />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span
                    className={`text-sm font-medium truncate ${isOut && !forceWhite ? "text-white" : "text-slate-700"}`}
                  >
                    {msg.caption || msg.name || "Document"}
                  </span>
                </div>
              </a>
            )}
            {msg.content && (
              <p
                className={`text-[14.5px] whitespace-pre-wrap break-all leading-relaxed ${msg.type_media ? "mt-1.5 px-1" : ""} ${isOut && !forceWhite ? "text-white" : "text-[#1e293b]"}`}
              >
                {msg.content}
              </p>
            )}

            <div
              className={`flex justify-end items-center gap-1 ${msg.type_media ? "mt-1 px-1 mb-0.5" : "mt-0.5"} ${isOut && !forceWhite ? "text-blue-100" : "text-[#94a3b8]"}`}
            >
              <span className="text-[10px] leading-none opacity-90">
                {msg.time}
              </span>
              {isOut && (
                <CheckCheck
                  className={`h-3.5 w-3.5 ${forceWhite ? "text-blue-500" : "opacity-80"}`}
                />
              )}
            </div>
          </div>
        </div>

        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className={`absolute -bottom-3 ${isOut ? "right-2" : "left-2"} bg-white border border-slate-200 shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5 z-10 text-[12px]`}
          >
            {msg.reactions.map((emoji, i) => (
              <span key={i} className="leading-none">
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}