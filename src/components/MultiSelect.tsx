'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Option {
  id: string;
  name: string;
  disabled?: boolean;
  [key: string]: any;
}

interface MultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  label?: string;
  id: string;
  className?: string;
  displayField?: string;
  secondaryField?: string;
  disabledField?: string;
  disabledMessage?: string;
}

export default function MultiSelect({
  options,
  selectedOptions,
  onChange,
  placeholder = 'Select options',
  label,
  id,
  className = '',
  displayField = 'name',
  secondaryField,
  disabledField = 'disabled',
  disabledMessage = 'Not available'
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle option selection
  const toggleOption = (option: Option) => {
    // Don't allow toggling disabled options
    if (option[disabledField]) {
      return;
    }
    
    const isSelected = selectedOptions.some(item => item.id === option.id);
    if (isSelected) {
      onChange(selectedOptions.filter(item => item.id !== option.id));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  // Remove a selected option
  const removeOption = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedOptions.filter(item => item.id !== option.id));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
      >
        <div className="flex flex-wrap items-center">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => (
                <div 
                  key={option.id} 
                  className="bg-blue-100 text-blue-800 rounded-md px-2 py-1 text-xs flex items-center"
                >
                  <span>{option[displayField]}</span>
                  <button 
                    type="button" 
                    onClick={(e) => removeOption(option, e)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="ml-auto">
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="max-h-60 overflow-auto rounded-md py-1 text-base sm:text-sm">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {options.map(option => {
                  const isSelected = selectedOptions.some(item => item.id === option.id);
                  const isDisabled = option[disabledField];
                  
                  return (
                    <li 
                      key={option.id}
                      onClick={() => toggleOption(option)}
                      className={`px-4 py-2 flex items-center ${
                        isDisabled 
                          ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                          : `cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {}}
                        className={`h-4 w-4 rounded border-gray-300 mr-2 ${
                          isDisabled 
                            ? 'text-gray-400 bg-gray-100' 
                            : 'text-blue-600 focus:ring-blue-500'
                        }`}
                      />
                      <div className="flex-grow">
                        <div className={`text-sm font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                          {option[displayField]}
                        </div>
                        {secondaryField && option[secondaryField] && (
                          <div className="text-xs text-gray-500">{option[secondaryField]}</div>
                        )}
                      </div>
                      {isDisabled && (
                        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5 ml-2">
                          {disabledMessage}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 