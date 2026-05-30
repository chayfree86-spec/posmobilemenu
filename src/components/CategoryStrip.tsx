import React, { useRef, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import type { MenuItem } from '../services/pocketbase';

interface CategoryStripProps {
  menuItems: MenuItem[];
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({ menuItems }) => {
  const { activeCategory, setActiveCategory, setIsCategoryOpen } = useCartStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group unique categories
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  // Handle category switch
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setIsCategoryOpen(true);
  };

  // Auto-scroll active item into view within the horizontal strip
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCategory]);

  if (categories.length === 0) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 max-w-[480px] mx-auto z-30 bg-[#FAF6F0]/90 backdrop-blur-md border-t border-[#F0EAE1] shadow-[0_-4px_16px_rgba(46,21,19,0.03)] font-nunito animate-[fadeIn_0.3s_ease-out]">
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto py-3 px-4 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-[13px] font-black tracking-tight whitespace-nowrap active:scale-95 transition-all duration-200 shadow-sm border ${
                isActive
                  ? 'bg-[#2E1513] text-white border-[#2E1513] shadow-[0_4px_12px_rgba(46,21,19,0.15)]'
                  : 'bg-white text-[#7D7067] border-[#EFECE6] hover:border-[#E2D8CD]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
