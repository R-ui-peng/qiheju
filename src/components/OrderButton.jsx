// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { ShoppingCart } from 'lucide-react';

export function OrderButton({
  itemCount,
  totalAmount,
  onOrderClick
}) {
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl text-lg" onClick={onOrderClick}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span>开始点餐</span>
            {itemCount > 0 && <span className="ml-2 bg-white text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                {itemCount}
              </span>}
          </div>
          {totalAmount > 0 && <span className="text-white font-bold">¥{totalAmount}</span>}
        </div>
      </Button>
    </div>;
}