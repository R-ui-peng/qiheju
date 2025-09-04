// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { X, Upload } from 'lucide-react';

// @ts-ignore;
import { useForm } from 'react-hook-form';
// @ts-ignore;

export function MenuForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    setValue,
    watch
  } = useForm({
    defaultValues: initialData || {
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      status: 'available',
      image: ''
    }
  });
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setValue('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const imageUrl = watch('image');
  return <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialData ? '编辑菜品' : '添加菜品'}
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 菜品图片 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">菜品图片</label>
            <div className="flex items-center space-x-4">
              {imageUrl && <div className="relative">
                  <img src={imageUrl} alt="菜品预览" className="w-20 h-20 rounded-md object-cover" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setValue('image', '')} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                    <X className="w-3 h-3" />
                  </Button>
                </div>}
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">上传</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
          
          {/* 菜品名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">菜品名称</label>
            <Input {...register('name', {
            required: '请输入菜品名称'
          })} placeholder="请输入菜品名称" className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          
          {/* 菜品价格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">价格</label>
            <Input type="number" step="0.01" {...register('price', {
            required: '请输入价格',
            min: {
              value: 0.01,
              message: '价格必须大于0'
            }
          })} placeholder="0.00" className={errors.price ? 'border-red-500' : ''} />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
          
          {/* 菜品分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <Select onValueChange={value => setValue('category', value)} defaultValue={initialData?.category}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="热菜">热菜</SelectItem>
                <SelectItem value="凉菜">凉菜</SelectItem>
                <SelectItem value="主食">主食</SelectItem>
                <SelectItem value="汤类">汤类</SelectItem>
                <SelectItem value="饮品">饮品</SelectItem>
                <SelectItem value="甜点">甜点</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>
          
          {/* 库存数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">库存数量</label>
            <Input type="number" {...register('stock', {
            min: {
              value: 0,
              message: '库存不能为负数'
            }
          })} placeholder="0" className={errors.stock ? 'border-red-500' : ''} />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
          </div>
          
          {/* 菜品状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <Select onValueChange={value => setValue('status', value)} defaultValue={initialData?.status || 'available'}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">上架</SelectItem>
                <SelectItem value="unavailable">下架</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* 菜品描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">菜品描述</label>
          <Textarea {...register('description')} placeholder="请输入菜品描述" rows={3} />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            取消
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>;
}