// src/components/home/CategoryTag.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { type CategoryData } from '@/types/category'

interface CategoryTagProps {
  category: CategoryData
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const { t } = useTranslation('category')

  return (
    <Link
      to={category.route}
      className='group flex basis-[11.11%] flex-col items-center border-r border-gray-100 p-4 transition duration-300 ease-in-out hover:shadow-md'
    >
      <div className='flex h-24 w-full items-center justify-center p-2'>
        <img src={category.image} alt={t(category.nameKey)} className='max-h-full max-w-full object-contain' />
      </div>

      <span className='mt-3 text-sm font-medium text-gray-800 group-hover:text-purple-600'>{t(category.nameKey)}</span>
    </Link>
  )
}

export default CategoryTag
