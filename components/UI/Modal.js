import React, { forwardRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  {
    variants: {
      variant: {
        default: "",
        centered: "items-center justify-center",
        top: "items-start justify-center pt-20",
        bottom: "items-end justify-center pb-20"
      },
      size: {
        sm: "p-2",
        md: "p-4", 
        lg: "p-6",
        xl: "p-8",
        full: "p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const modalContentVariants = cva(
  "bg-white rounded-lg shadow-xl border border-gray-200 max-h-[90vh] overflow-hidden",
  {
    variants: {
      size: {
        sm: "max-w-sm w-full",
        md: "max-w-md w-full",
        lg: "max-w-lg w-full", 
        xl: "max-w-2xl w-full",
        full: "max-w-none w-full h-full rounded-none"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const Modal = forwardRef(({
  isOpen = false,
  onClose,
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  // Gestione ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(modalVariants({ variant, size }), className)}
      {...props}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(modalContentVariants({ size }), "relative z-10")}>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

const ModalHeader = forwardRef(({
  className,
  children,
  showClose = true,
  onClose,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-6 border-b border-gray-200", className)}
      {...props}
    >
      <div className="flex-1">
        {children}
      </div>
      {showClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h2>
  );
});

ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 mt-1", className)}
      {...props}
    >
      {children}
    </p>
  );
});

ModalDescription.displayName = "ModalDescription";

const ModalContent = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-end space-x-3 p-6 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = "ModalFooter";

// Modal con icona e varianti predefinite
const AlertModal = forwardRef(({
  type = "info",
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Conferma",
  cancelText = "Annulla",
  size = "md",
  ...props
}, ref) => {
  const iconMap = {
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />,
    danger: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
  };

  const variantMap = {
    info: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50", 
    warning: "border-orange-200 bg-orange-50",
    danger: "border-red-200 bg-red-50"
  };

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      {...props}
    >
      <ModalHeader onClose={onClose}>
        <div className="flex items-center space-x-3">
          {iconMap[type]}
          <div>
            <ModalTitle>{title}</ModalTitle>
            {description && <ModalDescription>{description}</ModalDescription>}
          </div>
        </div>
      </ModalHeader>
      
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            "px-4 py-2 text-white rounded-md transition-colors",
            {
              "bg-blue-600 hover:bg-blue-700": type === "info",
              "bg-green-600 hover:bg-green-700": type === "success", 
              "bg-orange-600 hover:bg-orange-700": type === "warning",
              "bg-red-600 hover:bg-red-700": type === "danger"
            }
          )}
        >
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
});

AlertModal.displayName = "AlertModal";

export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  AlertModal
};
export default Modal;
