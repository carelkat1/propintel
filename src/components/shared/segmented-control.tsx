'use client';

import { useState, useRef, useEffect } from 'react';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeIndex = options.indexOf(value);
    const buttons = container.querySelectorAll('button');
    if (buttons[activeIndex]) {
      const btn = buttons[activeIndex] as HTMLElement;
      setPillStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex bg-bg-active rounded-[10px] p-1"
    >
      {/* Sliding pill */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] bg-white rounded-[8px] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ left: pillStyle.left, width: pillStyle.width }}
      />
      {options.map(option => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors duration-150 ${
            value === option ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
