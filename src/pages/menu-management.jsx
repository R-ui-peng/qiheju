// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Plus, Search, Filter, Grid, List } from 'lucide-react';

import { MenuTable } from '@/components/MenuTable';
import { MenuForm } from '@/components/MenuForm';
export default function MenuManagement(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('table');
  useEffect(() => {
    loadMenuItems();
  }, [filters]);
  const loadMenuItems = async () => {
    try {
      setLoading(true);
      // 构建查询条件
      const query = {};
      if (filters.search) {
        query.name = {
          $regex: filters.search,
          $options: 'i'
        };
      }
      if (filters.category !== 'all') {
        query.category = filters.category;
      }
      if (filters.status !== 'all') {
        query.status = filters.status;
      }
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'menu_items',
        methodName: 'wedaGetRecordsV2',
        params: {
          query: query,
          select: {
            $master: true
          },
          sort: {
            createdAt: -1
          },
          getCount: true
        }
      });
      setMenuItems(result.records || []);
    } catch (error) {
      console.error('加载菜品失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载菜品信息，请重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };
  const handleEdit = item => {
    setEditingItem(item);
    setShowForm(true);
  };
  const handleDelete = async item => {
    if (!window.confirm(`确定要删除菜品"${item.name}"吗？此操作不可恢复。`)) return;
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'menu_items',
        methodName: 'wedaDeleteV2',
        params: {
          query: {
            _id: item._id
          }
        }
      });
      if (result.count > 0) {
        toast({
          title: "删除成功",
          description: `已删除菜品"${item.name}"`,
          variant: "default"
        });
        loadMenuItems();
      }
    } catch (error) {
      console.error('删除菜品失败:', error);
      toast({
        title: "删除失败",
        description: "删除菜品失败，请重试",
        variant: "destructive"
      });
    }
  };
  const handleToggleStatus = async item => {
    const newStatus = item.status === 'available' ? 'unavailable' : 'available';
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'menu_items',
        methodName: 'wedaUpdateV2',
        params: {
          query: {
            _id: item._id
          },
          update: {
            status: newStatus,
            updatedAt: new Date().getTime()
          }
        }
      });
      if (result.count > 0) {
        toast({
          title: newStatus === 'available' ? "上架成功" : "下架成功",
          description: `已${newStatus === 'available' ? '上架' : '下架'}菜品"${item.name}"`,
          variant: "default"
        });
        loadMenuItems();
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      toast({
        title: "操作失败",
        description: "更新菜品状态失败，请重试",
        variant: "destructive"
      });
    }
  };
  const handleSubmit = async data => {
    try {
      setLoading(true);
      if (editingItem) {
        // 更新菜品
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'menu_items',
          methodName: 'wedaUpdateV2',
          params: {
            query: {
              _id: editingItem._id
            },
            update: {
              ...data,
              price: parseFloat(data.price),
              stock: parseInt(data.stock) || 0,
              updatedAt: new Date().getTime()
            }
          }
        });
        if (result.count > 0) {
          toast({
            title: "更新成功",
            description: `已更新菜品"${data.name}"`,
            variant: "default"
          });
        }
      } else {
        // 创建菜品
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'menu_items',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              ...data,
              price: parseFloat(data.price),
              stock: parseInt(data.stock) || 0,
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime()
            }
          }
        });
        if (result.id) {
          toast({
            title: "创建成功",
            description: `已创建菜品"${data.name}"`,
            variant: "default"
          });
        }
      }
      setShowForm(false);
      setEditingItem(null);
      loadMenuItems();
    } catch (error) {
      console.error('保存菜品失败:', error);
      toast({
        title: "保存失败",
        description: "保存菜品失败，请重试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };
  if (showForm) {
    return <div className="min-h-screen bg-gray-50 p-6">
        <MenuForm initialData={editingItem} onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 p-6">
      {/* 顶部操作栏 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">菜品管理</h1>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              添加菜品
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('table')} className="p-2">
                <List className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} className="p-2">
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="搜索菜品名称..." value={filters.search} onChange={e => setFilters(prev => ({
              ...prev,
              search: e.target.value
            }))} className="pl-10" />
            </div>
          </div>
          
          <div>
            <Select value={filters.category} onValueChange={value => setFilters(prev => ({
            ...prev,
            category: value
          }))}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="全部分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="热菜">热菜</SelectItem>
                <SelectItem value="凉菜">凉菜</SelectItem>
                <SelectItem value="主食">主食</SelectItem>
                <SelectItem value="汤类">汤类</SelectItem>
                <SelectItem value="饮品">饮品</SelectItem>
                <SelectItem value="甜点">甜点</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={filters.status} onValueChange={value => setFilters(prev => ({
            ...prev,
            status: value
          }))}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="available">上架中</SelectItem>
                <SelectItem value="unavailable">已下架</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 菜品列表 */}
      <MenuTable menuItems={menuItems} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} loading={loading} />
    </div>;
}