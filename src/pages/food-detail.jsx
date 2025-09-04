// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Star, ShoppingBag } from 'lucide-react';

import { FoodImageGallery } from '@/components/FoodImageGallery';
import { SpecificationSelector } from '@/components/SpecificationSelector';
import { QuantityControl } from '@/components/QuantityControl';
export default function FoodDetail(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [specTotalPrice, setSpecTotalPrice] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 从URL参数获取菜品ID
  const foodId = $w.page.dataset.params?.id;
  useEffect(() => {
    loadFoodDetail();
  }, [foodId]);
  const loadFoodDetail = async () => {
    if (!foodId) {
      toast({
        title: "错误",
        description: "未找到菜品信息",
        variant: "destructive"
      });
      $w.utils.navigateBack();
      return;
    }
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'menu_items',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: foodId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setFood(result);

        // 初始化规格选择
        const initialSpecs = {};
        if (result.specifications) {
          result.specifications.forEach(group => {
            if (group.required && group.options.length > 0) {
              initialSpecs[group.id] = group.options[0].id;
            }
          });
        }
        setSelectedSpecs(initialSpecs);
      } else {
        toast({
          title: "错误",
          description: "菜品不存在或已下架",
          variant: "destructive"
        });
        $w.utils.navigateBack();
      }
    } catch (error) {
      console.error('加载菜品详情失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载菜品信息，请重试",
        variant: "destructive"
      });
      $w.utils.navigateBack();
    } finally {
      setLoading(false);
    }
  };
  const handleSpecChange = (groupId, optionId) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [groupId]: optionId
    }));
  };
  const handleSpecPriceChange = price => {
    setSpecTotalPrice(prev => prev + price);
  };
  const handleAddToCart = async () => {
    if (!food) return;

    // 验证必选规格
    const missingRequired = food.specifications?.filter(group => group.required && !selectedSpecs[group.id]);
    if (missingRequired && missingRequired.length > 0) {
      toast({
        title: "请选择规格",
        description: `请选择${missingRequired.map(g => g.name).join('、')}`,
        variant: "destructive"
      });
      return;
    }
    setIsAddingToCart(true);
    try {
      // 这里应该调用购物车相关的数据模型
      // 暂时使用本地存储模拟
      const cartItem = {
        foodId: food._id,
        name: food.name,
        price: food.price + specTotalPrice,
        quantity,
        image: food.images?.[0] || food.image,
        specifications: selectedSpecs,
        totalPrice: (food.price + specTotalPrice) * quantity
      };

      // 模拟添加到购物车
      const existingCart = JSON.parse(localStorage.getItem('restaurant_cart') || '[]');
      const newCart = [...existingCart, cartItem];
      localStorage.setItem('restaurant_cart', JSON.stringify(newCart));
      toast({
        title: "添加成功",
        description: `已添加 ${food.name} 到购物车`,
        variant: "default"
      });

      // 延迟返回让用户看到提示
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('添加到购物车失败:', error);
      toast({
        title: "添加失败",
        description: "添加到购物车失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>;
  }
  if (!food) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">菜品不存在</p>
        </div>
      </div>;
  }
  const totalPrice = (food.price + specTotalPrice) * quantity;
  const baseImages = food.images || [food.image];
  return <div className="min-h-screen bg-white pb-24">
      {/* 头部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => $w.utils.navigateBack()} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="flex-1 text-center font-semibold text-gray-900">菜品详情</h1>
        <div className="w-9"></div>
      </div>

      {/* 图片展示 */}
      <FoodImageGallery images={baseImages} foodName={food.name} />

      {/* 菜品信息 */}
      <div className="px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{food.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {food.rating && <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span>{food.rating}</span>
              </div>}
            {food.sales && <span>已售 {food.sales}</span>}
            {food.favorites && <span>{food.favorites} 收藏</span>}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-orange-600">¥{food.price}</span>
            {food.originalPrice && food.originalPrice > food.price && <span className="text-sm text-gray-500 line-through">¥{food.originalPrice}</span>}
          </div>
        </div>

        {/* 菜品描述 */}
        {food.description && <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">菜品描述</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{food.description}</p>
          </div>}

        {/* 规格选择 */}
        {food.specifications && food.specifications.length > 0 && <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">规格选择</h3>
            <SpecificationSelector specifications={food.specifications} selectedSpecs={selectedSpecs} onSpecChange={handleSpecChange} onSpecPriceChange={handleSpecPriceChange} />
          </div>}

        {/* 数量调整 */}
        <div className="mb-6">
          <QuantityControl quantity={quantity} onQuantityChange={setQuantity} />
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-orange-600">¥{totalPrice}</span>
            <span className="text-sm text-gray-500">总计</span>
          </div>
        </div>
        
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl text-lg" onClick={handleAddToCart} disabled={isAddingToCart || !food.available}>
          {isAddingToCart ? <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              添加中...
            </div> : !food.available ? "已售罄" : <div className="flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              加入购物车
            </div>}
        </Button>
      </div>
    </div>;
}