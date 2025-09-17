import { useEffect } from "react";

export interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  duration?: number; // If you want auto-dismiss, otherwise omit
}

export function ConfirmToast({
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  duration
}: ConfirmToastProps) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onCancel, duration);
    return () => clearTimeout(timer);
  }, [onCancel, duration]);

  return (
    <div
      className="fixed z-50 bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-4 animate-fade-in-up bg-gray-800"
      style={{ minWidth: 260 }}
      role="alert"
    >
      <span>{message}</span>
      <button
        className="ml-2 px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
        onClick={onConfirm}
      >
        {confirmText}
      </button>
      <button
        className="ml-1 px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 transition"
        onClick={onCancel}
      >
        {cancelText}
      </button>
    </div>
  );
}
