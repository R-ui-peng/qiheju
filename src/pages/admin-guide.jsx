// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft } from 'lucide-react';

import { AdminAccessGuide } from '@/components/AdminAccessGuide';
export default function AdminGuide(props) {
  const {
    $w
  } = props;
  const handleNavigateToAdmin = () => {
    $w.utils.navigateTo({
      pageId: 'admin-dashboard',
      params: {}
    });
  };
  const handleGoBack = () => {
    $w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Button variant="ghost" onClick={handleGoBack} className="mb-6 text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        
        {/* 指引内容 */}
        <AdminAccessGuide onNavigateToAdmin={handleNavigateToAdmin} />
        
        {/* 快速入口 */}
        <div className="mt-8 text-center">
          <Button onClick={handleNavigateToAdmin} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            立即进入管理后台
          </Button>
        </div>
      </div>
    </div>;
}