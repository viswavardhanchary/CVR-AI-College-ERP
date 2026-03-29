import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const TYPE_CLASSES = {
  success: "bg-emerald-50 border-emerald-300 text-emerald-900",
  error: "bg-red-50 border-red-300 text-red-900",
  warning: "bg-amber-50 border-amber-300 text-amber-900",
  info: "bg-blue-50 border-blue-300 text-blue-900",
};

const ICON_MAP = {
  success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
};

const toastAnimationStyle = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  .toast-enter {
    animation: slideIn 0.3s ease-out;
  }
`;

export const Toast = ({ message = "", type = "info", duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const classes = TYPE_CLASSES[type] || TYPE_CLASSES.info;
  const icon = ICON_MAP[type] || ICON_MAP.info;

  return (
    <>
      <style>{toastAnimationStyle}</style>
      <div
        className={`w-full rounded-lg px-4 py-3 flex items-center gap-3 border shadow-sm ${classes} ${
          isExiting ? "opacity-0 transition-opacity duration-300" : "toast-enter"
        }`}
        role="status"
      >
        {icon}
        <div className="flex-1 text-sm font-medium">{message}</div>
        <span onClick={onClose}>
            <X/>
        </span>
      </div>
    </>
  );
};

export default Toast;
