// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function FoodImageGallery({
  images,
  foodName
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextImage = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };
  return <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
      <img src={images[currentIndex] || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop"} alt={foodName} className="w-full h-full object-cover" />
      
      {images.length > 1 && <>
          <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-orange-500' : 'bg-white/50'}`} />)}
          </div>
        </>}
    </div>;
}