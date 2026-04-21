import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = 'md'
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Menambahkan sedikit delay untuk efek transisi masuk animasi
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      document.body.style.overflow = 'hidden'; // cegah scroll background
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      const timer = setTimeout(() => setShow(false), 0);
      document.body.style.overflow = 'unset';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Kontainer Modal */}
      <div 
        className={`relative w-full ${maxWidths[width]} bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-all duration-300 transform w-full max-h-[90vh] flex flex-col ${
          show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        {/* Header Modal, jika ada tittle */}
        {title && (
          <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/80 rounded-t-2xl">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Konten Bebas dari Children (Mendukung Scroll) */}
        <div className="p-1 overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
