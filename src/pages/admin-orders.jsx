// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { RefreshCw, Search, Filter, Calendar } from 'lucide-react';

import { AdminOrderTable } from '@/components/AdminOrderTable';
import { OrderDetailModal } from '@/components/OrderDetailModal';
export default function AdminOrders(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    hasMore: true
  });
  useEffect(() => {
    loadOrders();
  }, [filters, pagination.page]);
  const loadOrders = async () => {
    try {
      if (pagination.page === 1) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      // 构建查询条件
      const query = {};
      if (filters.status !== 'all') {
        query.status = filters.status;
      }
      if (filters.search) {
        query.$or = [{
          order_number: {
            $regex: filters.search,
            $options: 'i'
          }
        }, {
          customer_name: {
            $regex: filters.search,
            $options: 'i'
          }
        }, {
          customer_phone: {
            $regex: filters.search,
            $options: 'i'
          }
        }];
      }
      // 时间筛选逻辑
      let dateFilter = {};
      if (filters.date !== 'all') {
        const now = new Date();
        let startDate;
        switch (filters.date) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        }
        dateFilter = {
          createdAt: {
            $gte: startDate.getTime()
          }
        };
      }
      const finalQuery = {
        ...query,
        ...dateFilter
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: finalQuery,
          select: {
            $master: true
          },
          sort: {
            createdAt: -1
          },
          pageSize: pagination.pageSize,
          pageNumber: pagination.page,
          getCount: true
        }
      });
      if (pagination.page === 1) {
        setOrders(result.records || []);
      } else {
        setOrders(prev => [...prev, ...(result.records || [])]);
      }
      setPagination(prev => ({
        ...prev,
        hasMore: (result.records || []).length === pagination.pageSize
      }));
    } catch (error) {
      console.error('加载订单失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载订单信息，请重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const loadOrderItems = async orderId => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'order_items',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: {
            order_id: orderId
          },
          select: {
            $master: true
          }
        }
      });
      setOrderItems(result.records || []);
    } catch (error) {
      console.error('加载订单商品失败:', error);
      setOrderItems([]);
    }
  };
  const handleRefresh = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    loadOrders();
  };
  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      date: 'all',
      search: ''
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  const handleViewDetails = async order => {
    setSelectedOrder(order);
    await loadOrderItems(order._id);
    setShowDetailModal(true);
  };
  const handleUpdateStatus = async (order, newStatus) => {
    const statusLabels = {
      confirmed: '确认订单',
      preparing: '开始制作',
      ready: '制作完成',
      completed: '完成订单'
    };
    if (!window.confirm(`确定要将订单状态更新为"${statusLabels[newStatus]}"吗？`)) return;
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaUpdateV2',
        params: {
          query: {
            _id: order._id
          },
          update: {
            status: newStatus,
            updatedAt: new Date().getTime()
          }
        }
      });
      if (result.count > 0) {
        toast({
          title: "更新成功",
          description: `订单状态已更新`,
          variant: "default"
        });
        handleRefresh();
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
      toast({
        title: "更新失败",
        description: "更新订单状态失败，请重试",
        variant: "destructive"
      });
    }
  };
  const handleCancelOrder = async order => {
    if (!window.confirm('确定要取消这个订单吗？')) return;
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaUpdateV2',
        params: {
          query: {
            _id: order._id
          },
          update: {
            status: 'cancelled',
            updatedAt: new Date().getTime()
          }
        }
      });
      if (result.count > 0) {
        toast({
          title: "取消成功",
          description: "订单已取消",
          variant: "default"
        });
        handleRefresh();
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      toast({
        title: "取消失败",
        description: "取消订单失败，请重试",
        variant: "destructive"
      });
    }
  };
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
    return stats;
  };
  const stats = getOrderStats();
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
            <p className="text-gray-600 text-sm">订单处理和管理平台</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing} className="text-gray-600">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 订单统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">总订单数</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600">待处理订单</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-700">{stats.preparing}</div>
            <div className="text-sm text-orange-600">制作中订单</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-600">已完成订单</div>
          </div>
        </div>

        {/* 筛选条件 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="搜索订单号、客户姓名或电话..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="pl-10" />
              </div>
            </div>
            
            <div>
              <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="preparing">制作中</SelectItem>
                  <SelectItem value="ready">待取餐</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={filters.date} onValueChange={value => handleFilterChange('date', value)}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部时间</SelectItem>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <AdminOrderTable orders={orders} onViewDetails={handleViewDetails} onUpdateStatus={handleUpdateStatus} onCancelOrder={handleCancelOrder} loading={loading} />

        {/* 加载更多 */}
        {pagination.hasMore && <div className="text-center mt-6">
            <Button variant="outline" onClick={() => setPagination(prev => ({
          ...prev,
          page: prev.page + 1
        }))} disabled={loading} className="border-blue-300 text-blue-600 hover:bg-blue-50">
              {loading ? '加载中...' : '加载更多'}
            </Button>
          </div>}
      </div>

      {/* 订单详情模态框 */}
      <OrderDetailModal order={selectedOrder} orderItems={orderItems} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>;
}