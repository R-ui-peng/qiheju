// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Eye, XCircle, CheckCircle, Clock, ChefHat, Truck, Edit } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function AdminOrderTable({
  orders,
  onViewDetails,
  onUpdateStatus,
  onCancelOrder,
  loading = false
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
  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  const getNextStatus = currentStatus => {
    switch (currentStatus) {
      case 'pending':
        return {
          value: 'confirmed',
          label: '确认订单'
        };
      case 'confirmed':
        return {
          value: 'preparing',
          label: '开始制作'
        };
      case 'preparing':
        return {
          value: 'ready',
          label: '制作完成'
        };
      case 'ready':
        return {
          value: 'completed',
          label: '完成订单'
        };
      default:
        return null;
    }
  };
  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">加载中...</p>
      </div>;
  }
  if (orders.length === 0) {
    return <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-gray-600 font-medium mb-2">暂无订单</h3>
        <p className="text-gray-400 text-sm">当前筛选条件下没有找到订单</p>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            const nextStatus = getNextStatus(order.status);
            return <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                    <div className="text-sm text-gray-500">
                      {order.payment_method === 'wechat' ? '微信支付' : order.payment_method === 'alipay' ? '支付宝' : '现金支付'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.customer_phone}</div>
                    {order.delivery_address && <div className="text-xs text-gray-400 truncate max-w-xs">
                        {order.delivery_address}
                      </div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span className="font-semibold text-orange-600">¥{order.total_amount}</span>
                    {order.delivery_fee > 0 && <span className="text-xs text-gray-500 ml-1">(含配送¥{order.delivery_fee})</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={cn("p-2 rounded-full", statusInfo.bgColor)}>
                      <StatusIcon className={cn("w-4 h-4", statusInfo.color)} />
                    </div>
                    <span className={cn("ml-2 text-sm font-medium", statusInfo.color)}>
                      {statusInfo.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(order)} className="text-blue-600 hover:text-blue-800 p-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {nextStatus && <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(order, nextStatus.value)} className="text-green-600 hover:text-green-800 p-1">
                        <Edit className="w-4 h-4" />
                      </Button>}
                    
                    {order.status !== 'cancelled' && order.status !== 'completed' && <Button variant="ghost" size="sm" onClick={() => onCancelOrder(order)} className="text-red-600 hover:text-red-800 p-1">
                        <XCircle className="w-4 h-4" />
                      </Button>}
                  </div>
                </td>
              </tr>;
          })}
          </tbody>
        </table>
      </div>
    </div>;
}