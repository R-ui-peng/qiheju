// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { X, Phone, MapPin, Clock, DollarSign } from 'lucide-react';

export function OrderDetailModal({
  order,
  orderItems = [],
  isOpen,
  onClose
}) {
  if (!isOpen || !order) return null;
  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">订单详情 - #{order.order_number}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* 订单状态和时间信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span>创建时间</span>
              </div>
              <div className="font-medium text-gray-900">{formatTime(order.createdAt)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span>更新时间</span>
              </div>
              <div className="font-medium text-gray-900">{formatTime(order.updatedAt)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span>支付方式</span>
              </div>
              <div className="font-medium text-gray-900">
                {order.payment_method === 'wechat' ? '微信支付' : order.payment_method === 'alipay' ? '支付宝' : '现金支付'}
              </div>
            </div>
          </div>
          
          {/* 客户信息 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">客户信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{order.customer_name?.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{order.customer_name}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {order.customer_phone}
                  </div>
                </div>
              </div>
              {order.delivery_address && <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">配送地址</div>
                    <div className="text-sm text-gray-600">{order.delivery_address}</div>
                    {order.delivery_fee > 0 && <div className="text-sm text-orange-600 mt-1">
                        配送费: ¥{order.delivery_fee}
                      </div>}
                  </div>
                </div>}
            </div>
          </div>
          
          {/* 订单商品 */}
          {orderItems.length > 0 && <div>
              <h3 className="font-semibold text-gray-900 mb-3">订单商品</h3>
              <div className="space-y-2">
                {orderItems.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop"} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">¥{item.price} × {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-orange-600 font-semibold">
                      ¥{item.price * item.quantity}
                    </div>
                  </div>)}
              </div>
            </div>}
          
          {/* 价格明细 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">价格明细</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>商品金额</span>
                <span>¥{(order.total_amount - (order.delivery_fee || 0)).toFixed(2)}</span>
              </div>
              {order.delivery_fee > 0 && <div className="flex justify-between text-sm text-gray-600">
                  <span>配送费</span>
                  <span>¥{order.delivery_fee}</span>
                </div>}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">总计</span>
                  <span className="text-orange-600 font-bold text-xl">
                    <span className="text-sm">¥</span>
                    {order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 备注信息 */}
          {order.note && <div>
              <h3 className="font-semibold text-gray-900 mb-2">备注信息</h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-800">{order.note}</p>
              </div>
            </div>}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            关闭
          </Button>
        </div>
      </div>
    </div>;
}