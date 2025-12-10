'use client';

import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: 'success' | 'error' | 'info';
}

export default function AlertModal({
  isOpen,
  title,
  message,
  onClose,
  variant = 'info'
}: AlertModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Focus sur le bouton OK après un court délai pour l'animation
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') return null;

  const variantStyles = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      icon: AlertCircle,
      iconColor: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icône et titre */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end mt-6">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={`px-6 py-2.5 text-white font-medium rounded-lg transition-colors ${styles.button}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
