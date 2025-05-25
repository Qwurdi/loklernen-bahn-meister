
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600'
  };

  const Icon = icons[type];

  return (
    <div
      className={`
        ${colors[type]} 
        border rounded-lg p-4 shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">{title}</h3>
          {description && (
            <p className="text-sm opacity-90 mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(id), 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} />
    ))}
  </div>
);

// Loading states
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg p-6 border animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="flex justify-between mt-4">
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="bg-white rounded-lg border overflow-hidden">
    {/* Header */}
    <div className="border-b bg-gray-50 p-4">
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: 5 }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b p-4 animate-pulse">
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
