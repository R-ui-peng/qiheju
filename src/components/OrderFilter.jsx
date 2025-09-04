// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Filter, Calendar, Search } from 'lucide-react';

export function OrderFilter({
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  searchText,
  onSearchChange,
  onClearFilters
}) {
  const statusOptions = [{
    value: 'all',
    label: '全部'
  }, {
    value: 'pending',
    label: '待确认'
  }, {
    value: 'confirmed',
    label: '已确认'
  }, {
    value: 'preparing',
    label: '制作中'
  }, {
    value: 'ready',
    label: '待取餐'
  }, {
    value: 'completed',
    label: '已完成'
  }, {
    value: 'cancelled',
    label: '已取消'
  }];
  const dateOptions = [{
    value: 'all',
    label: '全部时间'
  }, {
    value: 'today',
    label: '今天'
  }, {
    value: 'week',
    label: '本周'
  }, {
    value: 'month',
    label: '本月'
  }];
  return <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 状态筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            订单状态
          </label>
          <select value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500">
            {statusOptions.map(option => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </select>
        </div>
        
        {/* 时间筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            时间范围
          </label>
          <select value={dateFilter} onChange={e => onDateFilterChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500">
            {dateOptions.map(option => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </select>
        </div>
        
        {/* 搜索 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            搜索订单
          </label>
          <div className="relative">
            <input type="text" value={searchText} onChange={e => onSearchChange(e.target.value)} placeholder="输入订单号或客户名" className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
            <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onClearFilters} className="text-gray-600 border-gray-300">
          清除筛选
        </Button>
      </div>
    </div>;
}