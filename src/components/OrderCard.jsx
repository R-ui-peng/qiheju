// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, ChefHat, Truck } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function OrderCard({
  order,
  isExpanded = false,
  onToggle,
  onCancel,
  onReorder,
  onContact
}) {
  const getStatusInfo = status => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: '待确认'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: '已确认'
        };
      case 'preparing':
        return {
          icon: ChefHat,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          label: '制作中'
        };
      case 'ready':
        return {
          icon: Truck,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: '待取餐'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: '已完成'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: '已取消'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: status
        };
    }
  };
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  return <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* 订单头部信息 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", statusInfo.bgColor)}>
              <StatusIcon className={cn("w-4 h-4", statusInfo.color)} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">订单号: {order.order_number}</h3>
              <p className="text-sm text-gray-500">{formatTime(order.createdAt)}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onToggle} className="p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-medium", statusInfo.color)}>
            {statusInfo.label}
          </span>
          <span className="text-lg font-bold text-orange-600">
            ¥{order.total_amount}
          </span>
        </div>
      </div>
      
      {/* 展开的订单详情 */}
      {isExpanded && <div className="p-4 border-t border-gray-100">
          <div className="space-y-3">
            {/* 客户信息 */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">客户: </span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-gray-500">电话: </span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
            </div>
            
            {/* 配送信息 */}
            {order.delivery_address && <div className="text-sm">
                <span className="text-gray-500">配送地址: </span>
                <span className="font-medium">{order.delivery_address}</span>
                {order.delivery_fee > 0 && <span className="text-orange-600 ml-2">(配送费: ¥{order.delivery_fee})</span>}
              </div>}
            
            {/* 支付方式 */}
            <div className="text-sm">
              <span className="text-gray-500">支付方式: </span>
              <span className="font-medium">
                {order.payment_method === 'wechat' ? '微信支付' : order.payment_method === 'alipay' ? '支付宝' : order.payment_method === 'cash' ? '现金支付' : order.payment_method}
              </span>
            </div>
            
            {/* 备注 */}
            {order.note && <div className="text-sm">
                <span className="text-gray-500">备注: </span>
                <span className="font-medium">{order.note}</span>
              </div>}
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              {order.status === 'pending' && <Button variant="outline" size="sm" onClick={() => onCancel(order)} className="text-red-600 border-red-300 hover:bg-red-50">
                  取消订单
                </Button>}
              
              {order.status === 'completed' && <Button variant="outline" size="sm" onClick={() => onReorder(order)} className="text-orange-600 border-orange-300 hover:bg-orange-50">
                  再来一单
                </Button>}
              
              <Button variant="outline" size="sm" onClick={() => onContact(order)} className="text-blue-600 border-blue-300 hover:bg-blue-50">
                联系客服
              </Button>
            </div>
          </div>
        </div>}
    </div>;
}