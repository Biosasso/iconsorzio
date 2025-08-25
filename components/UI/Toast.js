import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const toastVariants = cva(
  "relative flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        success: "bg-green-50 border-green-200 text-green-900",
        error: "bg-red-50 border-red-200 text-red-900",
        warning: "bg-orange-50 border-orange-200 text-orange-900",
        info: "bg-blue-50 border-blue-200 text-blue-900"
      },
      size: {
        sm: "p-3 max-w-xs",
        md: "p-4 max-w-sm",
        lg: "p-5 max-w-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const toastIconVariants = cva(
  "flex-shrink-0 w-5 h-5",
  {
    variants: {
      variant: {
        default: "text-gray-400",
        success: "text-green-500",
        error: "text-red-500",
        warning: "text-orange-500",
        info: "text-blue-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const toastContainerVariants = cva(
  "fixed z-50 flex flex-col gap-2 p-4",
  {
    variants: {
      position: {
        "top-left": "top-0 left-0",
        "top-center": "top-0 left-1/2 transform -translate-x-1/2",
        "top-right": "top-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "bottom-center": "bottom-0 left-1/2 transform -translate-x-1/2",
        "bottom-right": "bottom-0 right-0"
      }
    },
    defaultVariants: {
      position: "top-right"
    }
  }
);

const Toast = forwardRef(({
  variant = "default",
  size = "md",
  title,
  description,
  action,
  onClose,
  duration = 5000,
  persistent = false,
  className,
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);

  // Auto-dismiss timer
  useEffect(() => {
    if (!persistent && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Durata animazione di uscita
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircleIcon className={cn(toastIconVariants({ variant }))} />;
      case "error":
        return <XCircleIcon className={cn(toastIconVariants({ variant }))} />;
      case "warning":
        return <ExclamationTriangleIcon className={cn(toastIconVariants({ variant }))} />;
      case "info":
        return <InformationCircleIcon className={cn(toastIconVariants({ variant }))} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      className={cn(
        toastVariants({ variant, size }),
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100",
        className
      )}
      {...props}
    >
      {/* Icon */}
      {getIcon() && (
        <div className="mr-3 mt-0.5">
          {getIcon()}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="text-sm font-medium mb-1">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-90">
            {description}
          </div>
        )}
        {action && (
          <div className="mt-3">
            {action}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Chiudi"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
});

Toast.displayName = "Toast";

// Hook per gestire i toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const addToast = (toastProps) => {
    const id = `toast-${toastIdCounter.current++}`;
    const newToast = { id, ...toastProps };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearToasts
  };
};

// Componente ToastContainer per gestire più toast
const ToastContainer = forwardRef(({
  position = "top-right",
  className,
  ...props
}, ref) => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      ref={ref}
      className={cn(toastContainerVariants({ position }), className)}
      {...props}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
});

ToastContainer.displayName = "ToastContainer";

// Componente ToastProvider per il context
const ToastContext = React.createContext();

const ToastProvider = forwardRef(({
  children,
  position = "top-right",
  className,
  ...props
}, ref) => {
  const toastUtils = useToast();

  return (
    <ToastContext.Provider value={toastUtils}>
      {children}
      <ToastContainer
        ref={ref}
        position={position}
        className={className}
        {...props}
      />
    </ToastContext.Provider>
  );
});

ToastProvider.displayName = "ToastProvider";

// Hook per usare i toast dal context
const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext deve essere usato dentro ToastProvider");
  }
  return context;
};

// Componenti helper per toast comuni
const toast = {
  success: (title, description, options = {}) => ({
    variant: "success",
    title,
    description,
    ...options
  }),
  error: (title, description, options = {}) => ({
    variant: "error",
    title,
    description,
    ...options
  }),
  warning: (title, description, options = {}) => ({
    variant: "warning",
    title,
    description,
    ...options
  }),
  info: (title, description, options = {}) => ({
    variant: "info",
    title,
    description,
    ...options
  }),
  default: (title, description, options = {}) => ({
    variant: "default",
    title,
    description,
    ...options
  })
};

export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
  useToastContext,
  toast
};
export default Toast;
