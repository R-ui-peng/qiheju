// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Button } from '@/components/ui';
// @ts-ignore;
import { Plus, Star } from 'lucide-react';

export function FoodCard({
  food,
  onAddToCart
}) {
  return <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <img src={food.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop"} alt={food.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
        {food.isPopular && <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            热门
          </div>}
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{food.name}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{food.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-bold text-sm">¥{food.price}</span>
          <Button variant="default" size="sm" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white p-1 h-8 w-8" onClick={() => onAddToCart(food)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
}