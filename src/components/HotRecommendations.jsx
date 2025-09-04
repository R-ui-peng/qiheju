// @ts-ignore;
import React from 'react';

import { FoodCard } from './FoodCard';
export function HotRecommendations({
  foods,
  onAddToCart
}) {
  if (!foods.length) return null;
  return <div className="px-4 py-6 bg-gray-50">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">热门推荐</h2>
        <p className="text-gray-600 text-sm">大家都在点的美味</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {foods.slice(0, 4).map(food => <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />)}
      </div>
    </div>;
}