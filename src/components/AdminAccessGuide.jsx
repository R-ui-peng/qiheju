// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Settings, ArrowRight, Smartphone, Monitor } from 'lucide-react';

export function AdminAccessGuide({
  onNavigateToAdmin
}) {
  return <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">管理后台进入指引</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 方法一：首页入口 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h3 className="font-semibold text-blue-900">首页右上角按钮</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            在餐厅首页右上角有一个蓝色的"管理后台"按钮，点击即可进入
          </p>
          <div className="bg-white p-3 rounded border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium">管理后台</span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 方法二：直接访问 */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold">2</span>
            </div>
            <h3 className="font-semibold text-green-900">直接访问链接</h3>
          </div>
          <p className="text-sm text-green-700 mb-4">
            您可以直接访问管理后台页面，无需经过首页
          </p>
          <Button onClick={onNavigateToAdmin} className="w-full bg-green-600 hover:bg-green-700 text-white">
            立即进入管理后台
          </Button>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">管理后台功能</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">数据概览</h4>
            <p className="text-sm text-gray-600">实时查看营业数据</p>
          </div>
          <div className="text-center">
            <Settings className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">订单管理</h4>
            <p className="text-sm text-gray-600">处理客户订单</p>
          </div>
          <div className="text-center">
            <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">菜品管理</h4>
            <p className="text-sm text-gray-600">管理菜单和库存</p>
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">使用提示</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 管理后台需要管理员权限才能访问</li>
          <li>• 建议使用电脑浏览器获得更好的操作体验</li>
          <li>• 数据会实时更新，确保信息准确性</li>
        </ul>
      </div>
    </div>;
}