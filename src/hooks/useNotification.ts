
import { toast } from "sonner";

interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
}

export function useNotification() {
  const success = (message: string, options?: NotificationOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible !== false,
    });
  };

  const error = (message: string, options?: NotificationOptions) => {
    return toast.error(message, {
      duration: options?.duration || 6000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible !== false,
    });
  };

  const info = (message: string, options?: NotificationOptions) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible !== false,
    });
  };

  const warning = (message: string, options?: NotificationOptions) => {
    return toast.warning(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible !== false,
    });
  };

  const loading = (message: string, options?: NotificationOptions) => {
    return toast.loading(message, {
      duration: options?.duration || Infinity,
      position: options?.position || 'bottom-right',
      dismissible: options?.dismissible !== false,
    });
  };

  const dismiss = (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  };
}
