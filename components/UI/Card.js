import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  "bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-gray-200 hover:shadow-md hover:border-gray-300",
        elevated: "shadow-lg border-transparent hover:shadow-xl",
        outlined: "border-2 border-gray-300 bg-transparent hover:border-gray-400",
        ghost: "border-transparent shadow-none hover:bg-gray-50",
        danger: "border-red-200 bg-red-50 hover:border-red-300",
        success: "border-green-200 bg-green-50 hover:border-green-300",
        warning: "border-orange-200 bg-orange-50 hover:border-orange-300",
        info: "border-blue-200 bg-blue-50 hover:border-blue-300"
      },
      size: {
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
        xl: "p-10"
      },
      interactive: {
        true: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false
    }
  }
);

const Card = React.forwardRef(({
  className,
  variant = "default",
  size = "md",
  interactive = false,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

// Sub-components per struttura
const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

// Export principale e sub-components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
