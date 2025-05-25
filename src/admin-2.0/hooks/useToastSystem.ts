
import { useState, useCallback } from 'react';
import { ToastProps } from '../components/ui/VisualFeedback';

let toastId = 0;

export const useToastSystem = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((
    type: ToastProps['type'],
    title: string,
    description?: string,
    duration?: number
  ) => {
    const id = `toast-${++toastId}`;
    const newToast: ToastProps = {
      id,
      type,
      title,
      description,
      duration,
      onClose: (toastId) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, description?: string) => addToast('success', title, description),
    error: (title: string, description?: string) => addToast('error', title, description),
    info: (title: string, description?: string) => addToast('info', title, description),
    warning: (title: string, description?: string) => addToast('warning', title, description)
  };

  return {
    toasts,
    toast,
    removeToast
  };
};
