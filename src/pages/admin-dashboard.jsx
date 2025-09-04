// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button } from '@/components/ui';
// @ts-ignore;
import { Bell, LogOut, Users, DollarSign, Package, ChefHat, BarChart3, Settings, ClipboardList, TrendingUp, Calendar } from 'lucide-react';

import { DataCard } from '@/components/DataCard';
import { ModuleCard } from '@/components/ModuleCard';
export default function AdminDashboard(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [dashboardData, setDashboardData] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalMenuItems: 0,
    availableTables: 0,
    totalTables: 10
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 获取今日订单数据
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const ordersResult = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: {
            createdAt: {
              $gte: todayStart.getTime()
            }
          },
          select: {
            $master: true
          },
          getCount: true
        }
      });
      // 获取待处理订单
      const pendingOrdersResult = await $w.cloud.callDataSource({
        dataSourceName: 'orders',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: {
            status: {
              $in: ['pending', 'confirmed', 'preparing']
            }
          },
          select: {
            $master: true
          },
          getCount: true
        }
      });
      // 获取菜品总数
      const menuItemsResult = await $w.cloud.callDataSource({
        dataSourceName: 'menu_items',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true
        }
      });
      // 获取可用桌台
      const tablesResult = await $w.cloud.callDataSource({
        dataSourceName: 'table_status',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: {
            status: 'available'
          },
          select: {
            $master: true
          },
          getCount: true
        }
      });
      // 计算今日营业额（模拟数据）
      const todayRevenue = ordersResult.records?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      setDashboardData({
        todayOrders: ordersResult.total || 0,
        todayRevenue: todayRevenue,
        pendingOrders: pendingOrdersResult.total || 0,
        totalMenuItems: menuItemsResult.total || 0,
        availableTables: tablesResult.total || 0,
        totalTables: 10 // 假设总桌台数
      });
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载仪表盘数据，请重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = () => {
    loadDashboardData();
  };
  const handleLogout = () => {
    toast({
      title: "退出登录",
      description: "已退出管理后台",
      variant: "default"
    });
    // 这里应该调用退出登录的逻辑
    $w.utils.redirectTo({
      pageId: 'index',
      params: {}
    });
  };
  const formatCurrency = amount => {
    return `¥${amount.toFixed(2)}`;
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            <p className="text-gray-600 text-sm">餐厅经营管理平台</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className="text-gray-600">
              <TrendingUp className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 数据概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataCard title="今日订单" value={dashboardData.todayOrders} subtitle="今日已完成订单数" icon={Package} trend="up" trendValue="+12%" onClick={() => $w.utils.navigateTo({
          pageId: 'order-management',
          params: {}
        })} />
          <DataCard title="今日营业额" value={formatCurrency(dashboardData.todayRevenue)} subtitle="今日总营业额" icon={DollarSign} trend="up" trendValue="+8%" onClick={() => $w.utils.navigateTo({
          pageId: 'revenue-stats',
          params: {}
        })} />
          <DataCard title="待处理订单" value={dashboardData.pendingOrders} subtitle="需要处理的订单" icon={ClipboardList} trend="down" trendValue="-3%" className="border-orange-200 bg-orange-50" onClick={() => $w.utils.navigateTo({
          pageId: 'order-management',
          params: {
            status: 'pending'
          }
        })} />
          <DataCard title="可用桌台" value={`${dashboardData.availableTables}/${dashboardData.totalTables}`} subtitle="当前可用桌台数" icon={Users} onClick={() => $w.utils.navigateTo({
          pageId: 'table-management',
          params: {}
        })} />
        </div>

        {/* 功能模块入口 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ModuleCard title="订单管理" description="查看和处理所有订单" icon={Package} count={dashboardData.pendingOrders} variant={dashboardData.pendingOrders > 0 ? 'warning' : 'default'} onClick={() => $w.utils.navigateTo({
          pageId: 'order-management',
          params: {}
        })} />
          <ModuleCard title="菜品管理" description="管理菜单和菜品信息" icon={ChefHat} onClick={() => $w.utils.navigateTo({
          pageId: 'menu-management',
          params: {}
        })} />
          <ModuleCard title="营收统计" description="查看销售数据和报表" icon={BarChart3} onClick={() => $w.utils.navigateTo({
          pageId: 'revenue-stats',
          params: {}
        })} />
          <ModuleCard title="桌台管理" description="管理桌台状态和预订" icon={Users} onClick={() => $w.utils.navigateTo({
          pageId: 'table-management',
          params: {}
        })} />
          <ModuleCard title="员工管理" description="管理员工账号和权限" icon={Users} onClick={() => $w.utils.navigateTo({
          pageId: 'staff-management',
          params: {}
        })} />
          <ModuleCard title="系统设置" description="系统配置和参数设置" icon={Settings} onClick={() => $w.utils.navigateTo({
          pageId: 'system-settings',
          params: {}
        })} />
        </div>

        {/* 快捷操作区 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => $w.utils.navigateTo({
            pageId: 'order-create',
            params: {}
          })} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Package className="w-4 h-4 mr-2" />
              新建订单
            </Button>
            <Button onClick={() => $w.utils.navigateTo({
            pageId: 'menu-create',
            params: {}
          })} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ChefHat className="w-4 h-4 mr-2" />
              添加菜品
            </Button>
            <Button onClick={() => $w.utils.navigateTo({
            pageId: 'daily-report',
            params: {}
          })} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Calendar className="w-4 h-4 mr-2" />
              今日报表
            </Button>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 美味餐厅管理系统 | 版本 1.0.0</p>
          <p className="mt-1">最后更新: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>;
}