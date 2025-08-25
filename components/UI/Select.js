import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const selectVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "",
        error: "",
        success: "",
        warning: ""
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

const selectTriggerVariants = cva(
  "flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  {
    variants: {
      variant: {
        default: "hover:border-gray-400",
        error: "border-red-300 focus:ring-red-500 focus:border-red-500 hover:border-red-400",
        success: "border-green-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400",
        warning: "border-orange-300 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400"
      },
      size: {
        sm: "px-2 py-1.5 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg"
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed bg-gray-50",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false
    }
  }
);

const selectContentVariants = cva(
  "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const selectItemVariants = cva(
  "flex items-center px-3 py-2 cursor-pointer transition-colors duration-150",
  {
    variants: {
      size: {
        sm: "px-2 py-1.5",
        md: "px-3 py-2",
        lg: "px-4 py-3"
      },
      selected: {
        true: "bg-blue-50 text-blue-900",
        false: "hover:bg-gray-50 text-gray-900"
      }
    },
    defaultVariants: {
      size: "md",
      selected: false
    }
  }
);

const Select = forwardRef(({
  options = [],
  value,
  onChange,
  placeholder = "Seleziona un'opzione...",
  variant = "default",
  size = "md",
  disabled = false,
  searchable = false,
  multiple = false,
  clearable = false,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState(multiple ? (value || []) : []);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  // Gestione valori multipli
  useEffect(() => {
    if (multiple && value) {
      setSelectedValues(Array.isArray(value) ? value : [value]);
    }
  }, [value, multiple]);

  // Gestione click esterno
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) &&
          contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra opzioni per ricerca
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestione selezione
  const handleSelect = (option) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Gestione rimozione selezione multipla
  const handleRemoveValue = (valueToRemove) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Gestione pulizia
  const handleClear = () => {
    if (multiple) {
      setSelectedValues([]);
      onChange?.([]);
    } else {
      onChange?.(undefined);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  // Ottieni etichette per valori selezionati
  const getSelectedLabels = () => {
    if (multiple) {
      return selectedValues.map(v => 
        options.find(opt => opt.value === v)?.label || v
      );
    }
    return options.find(opt => opt.value === value)?.label || "";
  };

  // Verifica se un valore è selezionato
  const isSelected = (optionValue) => {
    if (multiple) {
      return selectedValues.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={cn(selectVariants({ variant, size }), className)} ref={ref}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={cn(selectTriggerVariants({ variant, size, disabled }))}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...props}
      >
        <div className="flex items-center flex-wrap gap-1 min-h-0">
          {multiple ? (
            selectedValues.length > 0 ? (
              selectedValues.map((val, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {options.find(opt => opt.value === val)?.label || val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveValue(val);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )
          ) : (
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {getSelectedLabels() || placeholder}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {clearable && ((multiple && selectedValues.length > 0) || (!multiple && value)) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <ChevronDownIcon 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(selectContentVariants({ size }))}
        >
          {/* Barra di ricerca */}
          {searchable && (
            <div className="sticky top-0 p-2 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Lista opzioni */}
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    selectItemVariants({ size, selected: isSelected(option.value) }),
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !option.disabled && handleSelect(option)}
                >
                  <span className="flex-1">{option.label}</span>
                  {isSelected(option.value) && (
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Nessuna opzione trovata
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Select.displayName = "Select";

// Componente Select con gruppi
const SelectGroup = forwardRef(({
  groups = [],
  value,
  onChange,
  placeholder = "Seleziona un'opzione...",
  variant = "default",
  size = "md",
  disabled = false,
  searchable = false,
  multiple = false,
  clearable = false,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState(multiple ? (value || []) : []);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  // Gestione valori multipli
  useEffect(() => {
    if (multiple && value) {
      setSelectedValues(Array.isArray(value) ? value : [value]);
    }
  }, [value, multiple]);

  // Gestione click esterno
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target) &&
          contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Appiattisci tutte le opzioni per la ricerca
  const allOptions = groups.flatMap(group => group.options);
  
  // Filtra opzioni per ricerca
  const filteredGroups = groups.map(group => ({
    ...group,
    options: group.options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.options.length > 0);

  // Gestione selezione
  const handleSelect = (option) => {
    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Gestione rimozione selezione multipla
  const handleRemoveValue = (valueToRemove) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Gestione pulizia
  const handleClear = () => {
    if (multiple) {
      setSelectedValues([]);
      onChange?.([]);
    } else {
      onChange?.(undefined);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  // Ottieni etichette per valori selezionati
  const getSelectedLabels = () => {
    if (multiple) {
      return selectedValues.map(v => 
        allOptions.find(opt => opt.value === v)?.label || v
      );
    }
    return allOptions.find(opt => opt.value === value)?.label || "";
  };

  // Verifica se un valore è selezionato
  const isSelected = (optionValue) => {
    if (multiple) {
      return selectedValues.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={cn(selectVariants({ variant, size }), className)} ref={ref}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={cn(selectTriggerVariants({ variant, size, disabled }))}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...props}
      >
        <div className="flex items-center flex-wrap gap-1 min-h-0">
          {multiple ? (
            selectedValues.length > 0 ? (
              selectedValues.map((val, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {allOptions.find(opt => opt.value === val)?.label || val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveValue(val);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )
          ) : (
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {getSelectedLabels() || placeholder}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {clearable && ((multiple && selectedValues.length > 0) || (!multiple && value)) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <ChevronDownIcon 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(selectContentVariants({ size }))}
        >
          {/* Barra di ricerca */}
          {searchable && (
            <div className="sticky top-0 p-2 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Lista gruppi e opzioni */}
          <div className="py-1">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.label}>
                  {group.label && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                      {group.label}
                    </div>
                  )}
                  {group.options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        selectItemVariants({ size, selected: isSelected(option.value) }),
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !option.disabled && handleSelect(option)}
                    >
                      <span className="flex-1">{option.label}</span>
                      {isSelected(option.value) && (
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Nessuna opzione trovata
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

SelectGroup.displayName = "SelectGroup";

export { Select, SelectGroup };
export default Select;
