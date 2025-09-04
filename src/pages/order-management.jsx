// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, RefreshCw } from 'lucide-react';

import { OrderFilter } from '@/components/OrderFilter';
import { OrderCard } from '@/components/OrderCard';
export default function OrderManagement(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
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
  const handleRefresh = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    loadOrders();
  };
  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
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
  const handleReorder = order => {
    toast({
      title: "再来一单",
      description: "功能开发中",
      variant: "default"
    });
  };
  const handleContact = order => {
    toast({
      title: "联系客服",
      description: "功能开发中",
      variant: "default"
    });
  };
  if (loading && pagination.page === 1) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => $w.utils.navigateBack()} className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg font-semibold text-gray-800">订单管理</h1>
            
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing} className="text-gray-600">
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 筛选组件 */}
        <OrderFilter statusFilter={filters.status} onStatusFilterChange={value => handleFilterChange('status', value)} dateFilter={filters.date} onDateFilterChange={value => handleFilterChange('date', value)} searchText={filters.search} onSearchChange={value => handleFilterChange('search', value)} onClearFilters={handleClearFilters} />

        {/* 订单列表 */}
        <div className="space-y-4">
          {orders.length === 0 ? <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-gray-600 font-medium mb-2">暂无订单</h3>
              <p className="text-gray-400 text-sm">当前筛选条件下没有找到订单</p>
            </div> : orders.map(order => <OrderCard key={order._id} order={order} isExpanded={expandedOrderId === order._id} onToggle={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)} onCancel={handleCancelOrder} onReorder={handleReorder} onContact={handleContact} />)}
        </div>

        {/* 加载更多 */}
        {pagination.hasMore && <div className="text-center mt-6">
            <Button variant="outline" onClick={handleLoadMore} disabled={loading} className="border-orange-300 text-orange-600 hover:bg-orange-50">
              {loading ? '加载中...' : '加载更多'}
            </Button>
          </div>}
      </div>
    </div>;
}