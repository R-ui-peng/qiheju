// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Textarea } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

import { CartItem } from '@/components/CartItem';
export default function CartPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    loadCartItems();
  }, []);
  const loadCartItems = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('restaurant_cart') || '[]');
      setCartItems(savedCart);
    } catch (error) {
      console.error('加载购物车失败:', error);
      setCartItems([]);
    }
  };
  const handleQuantityChange = (item, newQuantity) => {
    const updatedItems = cartItems.map(cartItem => cartItem.foodId === item.foodId ? {
      ...cartItem,
      quantity: newQuantity,
      totalPrice: cartItem.price * newQuantity
    } : cartItem);
    setCartItems(updatedItems);
    localStorage.setItem('restaurant_cart', JSON.stringify(updatedItems));
  };
  const handleRemoveItem = item => {
    const updatedItems = cartItems.filter(cartItem => cartItem.foodId !== item.foodId);
    setCartItems(updatedItems);
    localStorage.setItem('restaurant_cart', JSON.stringify(updatedItems));
    toast({
      title: "删除成功",
      description: `已删除 ${item.name}`,
      variant: "default"
    });
  };
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    if (window.confirm('确定要清空购物车吗？')) {
      setCartItems([]);
      localStorage.setItem('restaurant_cart', '[]');
      toast({
        title: "购物车已清空",
        variant: "default"
      });
    }
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "购物车为空",
        description: "请先添加菜品到购物车",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      // 跳转到订单确认页面
      $w.utils.navigateTo({
        pageId: 'order-confirm',
        params: {
          items: JSON.stringify(cartItems),
          remarks: remarks
        }
      });
    } catch (error) {
      console.error('跳转失败:', error);
      toast({
        title: "操作失败",
        description: "请重试",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 计算价格明细
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packingFee = cartItems.length > 0 ? 2 : 0;
  const discount = 0; // 暂时没有优惠
  const totalAmount = itemsTotal + packingFee - discount;
  if (cartItems.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">购物车空空如也</h2>
          <p className="text-gray-500 mb-6">快去添加喜欢的菜品吧</p>
          <Button onClick={() => $w.utils.navigateBack()} className="bg-orange-600 hover:bg-orange-700 text-white">
            返回点餐
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => $w.utils.navigateBack()} className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg font-semibold text-gray-800">购物车</h1>
            
            <Button variant="ghost" size="sm" onClick={handleClearCart} disabled={cartItems.length === 0} className="text-red-500 hover:text-red-600 p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* 商品列表 */}
        <div className="space-y-3">
          {cartItems.map(item => <CartItem key={`${item.foodId}-${JSON.stringify(item.specifications)}`} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} disabled={isProcessing} />)}
        </div>

        {/* 价格明细 */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">价格明细</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>商品金额</span>
              <span>¥{itemsTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>打包费</span>
              <span>¥{packingFee.toFixed(2)}</span>
            </div>
            
            {discount > 0 && <div className="flex justify-between text-sm text-green-600">
                <span>优惠</span>
                <span>-¥{discount.toFixed(2)}</span>
              </div>}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">合计</span>
                <div className="text-orange-600 font-bold text-xl">
                  <span className="text-sm">¥</span>
                  {totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 备注输入 */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold text-gray-900 mb-3">订单备注</h3>
          
          <Textarea placeholder="请输入特殊要求或备注（可选）" value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full min-h-[80px]" />
          
          <div className="text-right text-xs text-gray-400 mt-2">
            {remarks.length}/200
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-gray-600 text-sm">总计</span>
              <div className="text-orange-600 font-bold text-xl">
                <span className="text-sm">¥</span>
                {totalAmount.toFixed(2)}
              </div>
            </div>
            
            <span className="text-gray-500 text-sm">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} 件商品
            </span>
          </div>
          
          <Button onClick={handleCheckout} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl text-lg" disabled={isProcessing}>
            {isProcessing ? <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                处理中...
              </div> : "去结算"}
          </Button>
        </div>
      </div>
    </div>;
}