import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  let color = "bg-blue-500";
  if (type === "success") color = "bg-green-500";
  if (type === "error") color = "bg-red-500";

  return (
    <div
      className={`fixed z-50 bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg text-white flex items-center gap-2 md:gap-3 animate-fade-in-up ${color}`}
      style={{
        minWidth: '70vw',
        maxWidth: 400,
        width: 'auto',
        fontSize: '1rem',
        fontWeight: 500,
        boxSizing: 'border-box',
      }}
      role="alert"
    >
      <span className="truncate" style={{ maxWidth: 220 }}>{message}</span>
      <button
        className="ml-2 md:ml-4 px-2 py-1 md:px-3 md:py-1.5 bg-white/20 rounded hover:bg-white/30 transition text-xs md:text-base"
        onClick={onClose}
        style={{ minWidth: 48 }}
      >
        Close
      </button>
    </div>
  );
}
