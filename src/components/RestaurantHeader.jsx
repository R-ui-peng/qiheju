// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';

export function RestaurantHeader({
  restaurantInfo,
  onLogoClick
}) {
  return <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12 border-2 border-orange-100" onClick={onLogoClick}>
          <AvatarImage src={restaurantInfo.logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop"} alt={restaurantInfo.name} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
            {restaurantInfo.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{restaurantInfo.name}</h1>
          <p className="text-sm text-orange-600 font-medium">{restaurantInfo.slogan}</p>
        </div>
      </div>
    </div>;
}