import { ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

export function Dialog({ open, title, children, onClose, actions }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-[90vw] w-full sm:w-[350px] p-6 relative animate-fade-in-up">
        {title && <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>}
        <div className="mb-4 text-gray-700">{children}</div>
        <div className="flex justify-end gap-2">{actions}</div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
      </div>
    </div>
  );
}
