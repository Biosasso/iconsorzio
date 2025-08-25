import React, { forwardRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

const inputVariants = cva(
  "flex w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:ring-blue-500",
        error: "border-red-500 focus:ring-red-500 bg-red-50",
        success: "border-green-500 focus:ring-green-500 bg-green-50",
        warning: "border-orange-500 focus:ring-orange-500 bg-orange-50"
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-4 py-3 text-lg"
      },
      hasLeftIcon: {
        true: "pl-10",
        false: ""
      },
      hasRightIcon: {
        true: "pr-10",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hasLeftIcon: false,
      hasRightIcon: false
    }
  }
);

const Input = forwardRef(({
  className,
  variant = "default",
  size = "md",
  type = "text",
  leftIcon,
  rightIcon,
  clearable = false,
  error,
  success,
  warning,
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  const [value, setValue] = useState(props.value || props.defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // Determina la variante basata sulle props
  const getVariant = () => {
    if (error) return "error";
    if (success) return "success";
    if (warning) return "warning";
    return variant;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleClear = () => {
    setValue('');
    if (props.onChange) {
      const event = {
        target: { value: '', name: props.name }
      };
      props.onChange(event);
    }
  };

  const currentVariant = getVariant();
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon || (clearable && value);

  return (
    <div className="relative">
      {/* Left Icon */}
      {leftIcon && (
        <div className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
        )}>
          {leftIcon}
        </div>
      )}

      {/* Input Field */}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        className={cn(
          inputVariants({ 
            variant: currentVariant, 
            size, 
            hasLeftIcon, 
            hasRightIcon 
          }),
          className
        )}
        disabled={disabled || loading}
        {...props}
      />

      {/* Right Icon or Clear Button */}
      {rightIcon && (
        <div className={cn(
          "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400",
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
        )}>
          {rightIcon}
        </div>
      )}

      {/* Clear Button */}
      {clearable && value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors",
            size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
          )}
        >
          <XMarkIcon />
        </button>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-500",
            size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
          )} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Success Message */}
      {success && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}

      {/* Warning Message */}
      {warning && (
        <p className="mt-1 text-sm text-orange-600">{warning}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
