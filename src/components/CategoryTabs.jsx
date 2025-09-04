// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange
}) {
  return <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => <Button key={category.id} variant={activeCategory === category.id ? "default" : "ghost"} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => onCategoryChange(category.id)}>
            {category.name}
          </Button>)}
      </div>
    </div>;
}