import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchNewProducts } from '@/redux/slices/productsSlice'
import ProductCard from '@/components/common/ProductCard'
import { useTranslation } from 'react-i18next'

const NewProductList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { newProducts, loading, error } = useAppSelector((state) => state.product)
  const { t } = useTranslation()

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchNewProducts())
    }
  }, [dispatch, loading])

  const renderContent = () => {
    if (loading === 'pending' || loading === 'idle') {
      return <div className='p-8 text-center'>{t('status:loading_products')}</div>
    }

    if (loading === 'failed' || error) {
      return (
        <div className='p-8 text-center text-red-500'>
          {t('status:error_fetch', { error: error || 'Unknown Error' })}
        </div>
      )
    }

    if (newProducts.length === 0) {
      return <div className='p-8 text-center text-gray-500'>{t('status:empty_products')}</div>
    }

    return (
      <div className='flex overflow-x-auto pb-4'>
        {newProducts.map((product) => (
          <div key={product.id} className='w-52 shrink-0'>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    )
  }

  return <div className='mt-6'>{renderContent()}</div>
}

export default NewProductList
