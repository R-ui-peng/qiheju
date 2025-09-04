// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Minus, Plus } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function QuantityControl({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false
}) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };
  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };
  return <div className="flex items-center space-x-3">
      <span className="text-gray-600 font-medium">数量</span>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={decrease} disabled={quantity <= min || disabled} className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-orange-500 hover:text-orange-600">
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className="w-8 text-center font-semibold text-gray-900">
          {quantity}
        </span>
        
        <Button variant="outline" size="sm" onClick={increase} disabled={quantity >= max || disabled} className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-orange-500 hover:text-orange-600">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>;
}