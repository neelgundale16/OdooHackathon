
'use client';

import { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

export default function TagInput({ tags, onChange, suggestions = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const defaultSuggestions = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'HTML', 'CSS',
    'Next.js', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Express', 'Django', 'Flask', 'Git', 'Docker', 'AWS', 'Firebase'
  ];

  const allSuggestions = [...suggestions, ...defaultSuggestions];
  const filteredSuggestions = allSuggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion) &&
      inputValue.length > 0
  );

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
      onChange([...tags, tag.trim()]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-500 hover:text-blue-700 cursor-pointer w-4 h-4 flex items-center justify-center"
              >
                <i className="ri-close-line text-xs"></i>
              </button>
            </span>
          ))}
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full focus:outline-none text-sm"
          placeholder={tags.length === 0 ? "Add tags (e.g. React, JavaScript)" : "Add more tags..."}
          disabled={tags.length >= 5}
        />
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredSuggestions.slice(0, 10).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm cursor-pointer whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1">
        {tags.length}/5 tags • Press Enter to add, Backspace to remove
      </p>
    </div>
  );
}
