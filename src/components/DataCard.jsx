// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';
// @ts-ignore;
import { TrendingUp, TrendingDown, Users, DollarSign, Package, ChefHat } from 'lucide-react';

export function DataCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  onClick,
  className
}) {
  const getTrendColor = trend => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };
  return <div onClick={onClick} className={cn("bg-white rounded-lg shadow-sm border p-6 cursor-pointer hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && <div className={cn("flex items-center text-sm mt-2", getTrendColor(trend))}>
              {getTrendIcon(trend)}
              <span className="ml-1">{trendValue}</span>
            </div>}
        </div>
        {Icon && <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Icon className="w-6 h-6" />
          </div>}
      </div>
    </div>;
}