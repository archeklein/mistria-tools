import React, { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = "Select options...",
  label,
  id,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    } else if (selectedOptions.length === options.length) {
      return "All categories";
    } else if (selectedOptions.length === 1) {
      return selectedOptions[0];
    } else {
      return `${selectedOptions.length} categories selected`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-2 py-1 text-sm text-left border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8 ${className}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={
              selectedOptions.length === 0 ? "text-gray-500" : "text-gray-900"
            }
          >
            {getDisplayText()}
          </span>
        </button>
        {/* Custom dropdown arrow that matches native select styling */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Select All option */}
          <div
            onClick={handleSelectAll}
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-200 flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={selectedOptions.length === options.length}
              onChange={() => {}}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
            />
            <span className="font-medium">
              {selectedOptions.length === options.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </div>

          {/* Individual options */}
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleToggleOption(option)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => {}}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
