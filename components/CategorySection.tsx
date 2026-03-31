import React, { useState } from 'react';
import { Category } from './categories';

const ChevronIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface CategorySectionProps {
  category: Category;
  onItemSelect?: (item: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, onItemSelect }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
      >
        <span>{category.name}</span>
        <ChevronIcon expanded={expanded} />
      </button>
      {expanded && (
        <div className="mt-1 space-y-0.5">
          {category.items.map(item => (
            <button
              key={item}
              onClick={() => onItemSelect?.(item)}
              className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6] flex-shrink-0" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
