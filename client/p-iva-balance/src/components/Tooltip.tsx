import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Reset any previous transforms
      tooltipRef.current.style.transform = 'translateX(-50%)';
      
      // Get the updated tooltip position
      const tooltipTop = buttonRect.bottom + 8; // 8px spacing
      const tooltipBottom = tooltipTop + tooltipRect.height;
      
      // Check if tooltip would go below viewport
      if (tooltipBottom > viewportHeight) {
        // Position above the button if it would go below viewport
        tooltipRef.current.style.top = `${buttonRect.top - tooltipRect.height - 8}px`;
      } else {
        tooltipRef.current.style.top = `${tooltipTop}px`;
      }
      
      tooltipRef.current.style.left = `${buttonRect.left + (buttonRect.width / 2)}px`;
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="Mostra informazioni"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            width: 'min(500px, 90vw)',
            transform: 'translateX(-50%)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <div className="text-gray-700 whitespace-normal">{content}</div>
        </div>
      )}
    </div>
  );
}
