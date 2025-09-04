// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  disabled = false
}) {
  const decrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item, item.quantity - 1);
    }
  };
  const increase = () => {
    onQuantityChange(item, item.quantity + 1);
  };
  const handleRemove = () => {
    if (window.confirm(`确定要删除 ${item.name} 吗？`)) {
      onRemove(item);
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-start space-x-3">
        <img src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop"} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{item.name}</h3>
          
          {item.specifications && Object.keys(item.specifications).length > 0 && <div className="text-xs text-gray-500 mb-2">
              {Object.entries(item.specifications).map(([key, value]) => <div key={key}>{value}</div>)}
            </div>}
          
          <div className="flex items-center justify-between">
            <div className="text-orange-600 font-bold text-sm">
              ¥{item.price}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={decrease} disabled={item.quantity <= 1 || disabled} className="w-6 h-6 p-0 rounded-full border-gray-300 hover:border-orange-500 hover:text-orange-600">
                <Minus className="w-3 h-3" />
              </Button>
              
              <span className="w-6 text-center font-semibold text-gray-900 text-sm">
                {item.quantity}
              </span>
              
              <Button variant="outline" size="sm" onClick={increase} disabled={disabled} className="w-6 h-6 p-0 rounded-full border-gray-300 hover:border-orange-500 hover:text-orange-600">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={handleRemove} disabled={disabled} className="text-gray-400 hover:text-red-500 p-1">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 text-right">
        <span className="text-orange-600 font-semibold">
          小计: ¥{item.price * item.quantity}
        </span>
      </div>
    </div>;
}