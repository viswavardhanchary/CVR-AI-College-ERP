import { useState, useEffect, useRef, useCallback } from "react";
import "./ChatbotWidget.css";

const CHATBOT_URL = "https://cmscampusflow-chatbot.onrender.com/";

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function RobotIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px" }}>
      {/* Antenna */}
      <line x1="20" y1="4" x2="20" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="20" cy="3" r="2" fill="currentColor"/>
      {/* Head */}
      <rect x="8" y="10" width="24" height="18" rx="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
      {/* Eyes */}
      <circle cx="14" cy="18" r="3" fill="currentColor"/>
      <circle cx="26" cy="18" r="3" fill="currentColor"/>
      <circle cx="14.8" cy="17.2" r="1" fill="white"/>
      <circle cx="26.8" cy="17.2" r="1" fill="white"/>
      {/* Mouth */}
      <path d="M14 24 Q20 27 26 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Body / Shoulders */}
      <path d="M12 28 H28 V33 Q20 36 12 33 Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
      <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
      <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="10" height="10">
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="currentColor"/>
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showIframe, setShowIframe] = useState(false); // lazy load
  const [pulseActive, setPulseActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Stop pulse after 5s
  useEffect(() => {
    const timer = setTimeout(() => setPulseActive(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Lazy load iframe only when first opened
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setPulseActive(false);
    if (!showIframe) setShowIframe(true);
    // On mobile → go fullscreen automatically
    if (isMobile) setIsFullscreen(true);
  }, [showIframe, isMobile]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Keyboard: Escape closes
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  return (
    <>
      {/* ── Fullscreen backdrop ── */}
      {isFullscreen && isOpen && (
        <div
          className="chatbot-backdrop"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ── Chat window ── */}
      <div
        className={[
          "chatbot-window",
          isOpen ? "chatbot-window--open" : "",
          isFullscreen ? "chatbot-window--fullscreen" : "",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Campus Assistant chatbot"
      >
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">
              <RobotIcon />
            </div>
            <div className="chatbot-title-wrap">
              <span className="chatbot-title">Campus Assistant</span>
              <span className="chatbot-status">
                <span className="chatbot-status-dot" />
                Online
              </span>
            </div>
          </div>

          <div className="chatbot-controls">
            <button
              className="chatbot-ctrl-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Minimize" : "Fullscreen"}
              aria-label={isFullscreen ? "Minimize chatbot" : "Expand chatbot to fullscreen"}
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
            <button
              className="chatbot-ctrl-btn chatbot-ctrl-btn--close"
              onClick={handleClose}
              title="Close"
              aria-label="Close chatbot"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body / iframe */}
        <div className="chatbot-body">
          {/* Loading skeleton shown until iframe loads */}
          {showIframe && !iframeLoaded && (
            <div className="chatbot-loading">
              <div className="chatbot-loading-icon">
                <RobotIcon />
              </div>
              <p className="chatbot-loading-text">Starting Campus Assistant…</p>
              <div className="chatbot-loading-dots">
                <span /><span /><span />
              </div>
            </div>
          )}

          {showIframe && (
            <iframe
              ref={iframeRef}
              src={CHATBOT_URL}
              title="Campus Assistant Chatbot"
              className={["chatbot-iframe", iframeLoaded ? "chatbot-iframe--visible" : ""].join(" ")}
              onLoad={() => setIframeLoaded(true)}
              allow="microphone; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          )}

          {/* Placeholder when not yet opened */}
          {!showIframe && (
            <div className="chatbot-placeholder">
              <div className="chatbot-placeholder-icon">
                <RobotIcon />
              </div>
              <p>Ask me anything about<br />campus life, schedules, or academics.</p>
            </div>
          )}
        </div>

        {/* Footer badge */}
        <div className="chatbot-footer">
          <SparkleIcon />
          <span>Powered by CampusFlow AI</span>
        </div>
      </div>

      {/* ── Launcher button ── */}
      {!isOpen && (
        <button
          id="chatbot-launcher"
          className={["chatbot-launcher", pulseActive ? "chatbot-launcher--pulse" : ""].join(" ")}
          onClick={handleOpen}
          aria-label="Open Campus Assistant chatbot"
          title="Chat with Campus Assistant"
        >
          <span className="chatbot-launcher-icon">
            <RobotIcon />
          </span>
          <span className="chatbot-launcher-label">Ask AI</span>
          {pulseActive && <span className="chatbot-launcher-ring" aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
