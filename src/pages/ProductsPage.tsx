import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchProductList, type ProductFilters as FilterType } from '@/redux/slices/productsSlice'
import ProductCard from '@/components/common/VerticalProductCard'
import ProductFilters from '@/components/product/ProductFilter'
import Pagination from '@/components/common/Pagination'
import { useSearchParams } from 'react-router-dom'

const ITEMS_PER_PAGE = 10

const ProductsPage: React.FC = () => {
  const { t } = useTranslation(['product', 'status'])
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryIdParam = searchParams.get('category_id')
  const initialCategoryFilters = categoryIdParam ? { categoryIds: [Number(categoryIdParam)] } : {}

  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<Omit<FilterType, 'limit' | 'page'>>(initialCategoryFilters)
  const { listProducts, totalPages, loadingList, error } = useAppSelector((state) => state.products)

  const loadProducts = useCallback(
    (page: number, filters: Omit<FilterType, 'limit' | 'page'>) => {
      dispatch(
        fetchProductList({
          page,
          limit: ITEMS_PER_PAGE,
          ...filters
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    loadProducts(currentPage, currentFilters)
  }, [currentPage, currentFilters, loadProducts])

  const handleApplyFilters = (filters: Omit<FilterType, 'limit' | 'page'>) => {
    setCurrentFilters(filters)
    setCurrentPage(1)

    const newParams = new URLSearchParams(searchParams)
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      newParams.set('category_id', filters.categoryIds[0].toString())
    } else {
      newParams.delete('category_id')
    }
    setSearchParams(newParams)
  }

  const renderProductList = () => {
    if (loadingList === 'pending' || loadingList === 'idle') {
      return <div className='p-10 text-center'>{t('status:loading_products')}</div>
    }

    if (error) {
      return <div className='p-10 text-center text-red-500'>{t('status:error_fetch', { error })}</div>
    }

    if (listProducts.length === 0) {
      return <div className='p-10 text-center text-gray-500'>{t('product:no_results')}</div>
    }

    return (
      <>
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
          {listProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className='mt-8'>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </>
    )
  }

  return (
    <div className='py-8'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
        <div className='lg:col-span-1'>
          <ProductFilters onApplyFilters={handleApplyFilters} />
        </div>

        <div className='lg:col-span-3'>
          <h1 className='mb-4 text-2xl font-bold'>{t('product:results_count', { count: listProducts.length })}</h1>
          {renderProductList()}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
