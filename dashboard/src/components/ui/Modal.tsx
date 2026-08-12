import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content - full screen on mobile, centered on desktop */}
      <div className="relative bg-[var(--color-surface)] border-t sm:border border-[var(--color-border)] rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg sm:mx-4 max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-slide-down shadow-lg sm:shadow-xl" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-5rem)] sm:max-h-[calc(85vh-5rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
