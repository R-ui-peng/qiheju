// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Check, X } from 'lucide-react';

export function SpecificationSelector({
  specifications,
  selectedSpecs,
  onSpecChange,
  onSpecPriceChange
}) {
  const handleSpecChange = (groupId, optionId, optionPrice) => {
    onSpecChange(groupId, optionId);
    onSpecPriceChange(optionPrice);
  };
  return <div className="space-y-6">
      {specifications.map(group => <div key={group.id} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{group.name}</h3>
            {group.required && <span className="text-red-500 text-sm">必选</span>}
          </div>
          
          <div className="space-y-2">
            {group.options.map(option => {
          const isSelected = selectedSpecs[group.id] === option.id;
          const isAvailable = option.stock > 0;
          return <label key={option.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'} ${!isAvailable && 'opacity-50 cursor-not-allowed'}`}>
                  <div className="flex items-center space-x-3">
                    {group.type === 'radio' ? <input type="radio" name={group.id} value={option.id} checked={isSelected} onChange={() => handleSpecChange(group.id, option.id, option.price)} disabled={!isAvailable} className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" /> : <input type="checkbox" checked={isSelected} onChange={() => handleSpecChange(group.id, option.id, option.price)} disabled={!isAvailable} className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />}
                    <span className={`font-medium ${!isAvailable && 'text-gray-500'}`}>
                      {option.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {option.price > 0 && <span className="text-orange-600 font-semibold">
                        +¥{option.price}
                      </span>}
                    {!isAvailable && <span className="text-red-500 text-sm flex items-center">
                        <X className="w-3 h-3 mr-1" />
                        售罄
                      </span>}
                    {isSelected && isAvailable && <Check className="w-4 h-4 text-orange-600" />}
                  </div>
                </label>;
        })}
          </div>
        </div>)}
    </div>;
}