// CustomSelect.tsx
import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  phoneNo?: string;
  subLabel?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select",
  disabled = false,
  className = ""
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`custom-input px-4 py-2 rounded-lg text-sm h-12.5 w-full text-left flex items-center justify-between cursor-pointer ${className}`}
      >
        <span className={selectedOption ? "text-primary dark:text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Dropdown Arrow */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path 
            d="M5 7.5L10 12.5L15 7.5" 
            stroke="#4A4A4A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-primary rounded-lg shadow-lg overflow-y-auto max-h-50 z-50 border dark:border-border-dark py-1">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400">No options available</div>
          ) : (
            options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-full px-4 py-2 text-left text-sm text-primary dark:text-white transition-colors cursor-pointer ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === options.length - 1 ? 'rounded-b-lg' : ''
                } flex flex-col`}
                style={{
                  backgroundColor: hoveredIndex === index 
                    ? 'var(--background-secondary-light, #F5F5F5)' 
                    : 'var(--backgroundOne, #FFFFFF)'
                }}
              >
                <span className="font-medium">{option.label}</span>
                {(option.phoneNo || option.subLabel) && (
                  <span className="text-xs text-secondary mt-0.5 opacity-80">
                    {option.phoneNo || option.subLabel}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;