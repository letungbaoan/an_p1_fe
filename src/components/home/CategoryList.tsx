// src/components/home/CategoryList.tsx

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import CategoryItem from './CategoryItem'
import { fetchCategories } from '@/redux/slices/categorySlice'
import { useTranslation } from 'react-i18next'

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { categories, loading, error } = useAppSelector((state) => state.category)
  const { t } = useTranslation()

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchCategories())
    }
  }, [dispatch, loading])

  if (loading === 'idle' || loading === 'pending') {
    return <div className='p-8 text-center'>{t('common:loading')}</div>
  }

  if (loading === 'failed' && error) {
    return <div className='p-8 text-center text-red-500'>{`Lỗi: ${error}`}</div>
  }

  return (
    <div className='mx-auto my-8 w-full max-w-7xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm'>
      <div className='flex flex-row flex-nowrap'>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
        <div className='border-r border-gray-100' style={{ flexBasis: '0px' }}></div>
      </div>
    </div>
  )
}

export default CategoryList
