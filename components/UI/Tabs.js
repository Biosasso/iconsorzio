import React, { forwardRef, createContext, useContext, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const TabsContext = createContext();

const tabsVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        underlined: "",
        pills: "",
        cards: ""
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const tabsListVariants = cva(
  "flex items-center justify-center w-full",
  {
    variants: {
      variant: {
        default: "border-b border-gray-200",
        underlined: "border-b-2 border-gray-200",
        pills: "bg-gray-100 p-1 rounded-lg",
        cards: "bg-gray-50 p-1 rounded-lg"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-b-2 border-transparent px-3 py-2 hover:text-gray-600 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600",
        underlined: "border-b-2 border-transparent px-3 py-2 hover:text-gray-600 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600",
        pills: "rounded-md px-3 py-2 hover:text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
        cards: "rounded-lg px-3 py-2 hover:text-gray-700 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
      },
      size: {
        sm: "text-sm px-2 py-1.5",
        md: "text-base px-3 py-2",
        lg: "text-lg px-4 py-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const tabsContentVariants = cva(
  "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        underlined: "",
        pills: "",
        cards: "bg-white rounded-lg border border-gray-200 p-4"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Tabs = forwardRef(({
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ selectedValue, handleValueChange, variant, size }}>
      <div
        ref={ref}
        className={cn(tabsVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = "Tabs";

const TabsList = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  const { variant, size } = useContext(TabsContext);

  return (
    <div
      ref={ref}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

TabsList.displayName = "TabsList";

const TabsTrigger = forwardRef(({
  value,
  className,
  children,
  disabled = false,
  ...props
}, ref) => {
  const { selectedValue, handleValueChange, variant, size } = useContext(TabsContext);
  const isActive = selectedValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      data-state={isActive ? "active" : "inactive"}
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      onClick={() => !disabled && handleValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef(({
  value,
  className,
  children,
  ...props
}, ref) => {
  const { selectedValue, variant } = useContext(TabsContext);
  const isActive = selectedValue === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn(tabsContentVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = "TabsContent";

// Componente Tabs avanzato con indicatori
const TabsWithIndicator = forwardRef(({
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  const updateIndicator = (triggerElement) => {
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      const parentRect = triggerElement.parentElement.getBoundingClientRect();
      
      setIndicatorStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
        height: variant === "default" || variant === "underlined" ? "2px" : "100%"
      });
    }
  };

  return (
    <TabsContext.Provider value={{ selectedValue, handleValueChange, variant, size, updateIndicator }}>
      <div
        ref={ref}
        className={cn(tabsVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        
        {/* Indicatore animato */}
        {(variant === "default" || variant === "underlined") && (
          <div
            className="absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        )}
      </div>
    </TabsContext.Provider>
  );
});

TabsWithIndicator.displayName = "TabsWithIndicator";

// Componente Tabs con contenuto lazy
const TabsLazy = forwardRef(({
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}, ref) => {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);
  const [loadedTabs, setLoadedTabs] = useState(new Set([selectedValue]));

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    setLoadedTabs(prev => new Set([...prev, newValue]));
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ selectedValue, handleValueChange, variant, size, loadedTabs }}>
      <div
        ref={ref}
        className={cn(tabsVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

TabsLazy.displayName = "TabsLazy";

// Componente TabsContent per lazy loading
const TabsContentLazy = forwardRef(({
  value,
  className,
  children,
  ...props
}, ref) => {
  const { selectedValue, variant, loadedTabs } = useContext(TabsContext);
  const isActive = selectedValue === value;
  const isLoaded = loadedTabs.has(value);

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn(tabsContentVariants({ variant }), className)}
      {...props}
    >
      {isLoaded ? children : <div className="animate-pulse">Caricamento...</div>}
    </div>
  );
});

TabsContentLazy.displayName = "TabsContentLazy";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsWithIndicator,
  TabsLazy,
  TabsContentLazy
};
export default Tabs;
