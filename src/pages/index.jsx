// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { Settings } from 'lucide-react';

import { RestaurantHeader } from '@/components/RestaurantHeader';
import { CategoryTabs } from '@/components/CategoryTabs';
import { HotRecommendations } from '@/components/HotRecommendations';
import { CategoryFoods } from '@/components/CategoryFoods';
import { OrderButton } from '@/components/OrderButton';
export default function RestaurantHome(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();

  // 模拟数据
  const restaurantInfo = {
    name: "美味餐厅",
    slogan: "用心做好每一道菜",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop"
  };
  const categories = [{
    id: 'all',
    name: '全部'
  }, {
    id: 'hot',
    name: '热门'
  }, {
    id: 'main',
    name: '主食'
  }, {
    id: 'appetizer',
    name: '小吃'
  }, {
    id: 'drink',
    name: '饮品'
  }, {
    id: 'dessert',
    name: '甜点'
  }];
  const allFoods = [{
    id: 1,
    name: "招牌红烧肉",
    price: 68,
    description: "精选五花肉，肥而不腻，入口即化",
    image: "https://images.unsplash.com/photo-1565299585323-38174bb73824?w=500&h=500&fit=crop",
    category: 'main',
    isPopular: true
  }, {
    id: 2,
    name: "香辣小龙虾",
    price: 128,
    description: "新鲜小龙虾，麻辣鲜香，回味无穷",
    image: "https://images.unsplash.com/photo-1585036156172-6d6b3bffa66f?w=500&h=500&fit=crop",
    category: 'main',
    isPopular: true
  }, {
    id: 3,
    name: "蒜蓉粉丝蒸扇贝",
    price: 88,
    description: "新鲜扇贝，蒜香浓郁，粉丝入味",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop",
    category: 'main'
  }, {
    id: 4,
    name: "爽口拍黄瓜",
    price: 18,
    description: "清脆爽口，开胃小菜",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
    category: 'appetizer'
  }, {
    id: 5,
    name: "鲜榨西瓜汁",
    price: 25,
    description: "新鲜西瓜现榨，清甜解渴",
    image: "https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=500&h=500&fit=crop",
    category: 'drink',
    isPopular: true
  }, {
    id: 6,
    name: "芒果布丁",
    price: 22,
    description: "香甜芒果味，口感细腻",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&h=500&fit=crop",
    category: 'dessert'
  }];
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const hotFoods = allFoods.filter(food => food.isPopular);
  const categoryFoods = activeCategory === 'all' ? allFoods : allFoods.filter(food => food.category === activeCategory);
  const handleAddToCart = food => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === food.id);
      if (existingItem) {
        return prev.map(item => item.id === food.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      } else {
        return [...prev, {
          ...food,
          quantity: 1
        }];
      }
    });
    toast({
      title: "添加成功",
      description: `已添加 ${food.name} 到购物车`,
      variant: "default"
    });
  };
  const handleOrderClick = () => {
    if (cartItems.length === 0) {
      toast({
        title: "购物车为空",
        description: "请先添加菜品到购物车",
        variant: "destructive"
      });
      return;
    }
    $w.utils.navigateTo({
      pageId: 'order',
      params: {
        items: JSON.stringify(cartItems)
      }
    });
  };
  const handleAdminClick = () => {
    $w.utils.navigateTo({
      pageId: 'admin-dashboard',
      params: {}
    });
  };
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return <div className="min-h-screen bg-gray-50 pb-20">
      <RestaurantHeader restaurantInfo={restaurantInfo} onLogoClick={() => $w.utils.navigateTo({
      pageId: 'about'
    })} />
      
      {/* 管理后台入口按钮 */}
      <div className="fixed top-20 right-4 z-50">
        <Button onClick={handleAdminClick} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg rounded-full px-4 py-2" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          管理后台
        </Button>
      </div>
      
      <CategoryTabs categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {activeCategory === 'all' && <HotRecommendations foods={hotFoods} onAddToCart={handleAddToCart} />}

      <CategoryFoods foods={categoryFoods} onAddToCart={handleAddToCart} />

      <OrderButton itemCount={totalItems} totalAmount={totalAmount} onOrderClick={handleOrderClick} />
    </div>;
}