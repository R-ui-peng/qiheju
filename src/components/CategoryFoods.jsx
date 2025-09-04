// @ts-ignore;
import React from 'react';

import { FoodCard } from './FoodCard';
export function CategoryFoods({
  foods,
  onAddToCart
}) {
  if (!foods.length) return null;
  return <div className="px-4 py-6">
      <div className="grid grid-cols-2 gap-4">
        {foods.map(food => <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />)}
      </div>
    </div>;
}