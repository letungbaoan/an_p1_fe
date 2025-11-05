import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchProductList, type ProductFilters as FilterType } from '@/redux/slices/productsSlice'
import ProductCard from '@/components/common/VerticalProductCard'
import ProductFilters from '@/components/product/ProductFilter'
import Pagination from '@/components/common/Pagination'
import { useSearchParams } from 'react-router-dom'
import ProductSearchBar from '@/components/product/ProductSearchBar'
import { ROUTES } from '@/constants/routes'

const ITEMS_PER_PAGE = 10

interface ProductsPageProps {
  detailRoutePrefix?: string
  disableCart?: boolean
  disableWishlist?: boolean
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  detailRoutePrefix = ROUTES.PRODUCTS_BASE,
  disableCart = false,
  disableWishlist = false
}) => {
  const { t } = useTranslation(['product', 'status'])
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryIdParam = searchParams.get('category_id')
  const nameQueryParam = searchParams.get('name_query') || ''
  const initialCategoryFilters = categoryIdParam ? { categoryIds: [Number(categoryIdParam)] } : {}

  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilters, setCurrentFilters] = useState<Omit<FilterType, 'limit' | 'page'>>({
    ...initialCategoryFilters,
    nameQuery: nameQueryParam
  })

  const { listProducts, totalPages, loadingList, error } = useAppSelector((state) => state.products)

  const loadProducts = useCallback(
    (page: number, filters: Omit<FilterType, 'limit' | 'page'>) => {
      dispatch(fetchProductList({ page, limit: ITEMS_PER_PAGE, ...filters }))
    },
    [dispatch]
  )

  useEffect(() => {
    loadProducts(currentPage, currentFilters)
  }, [currentPage, currentFilters, loadProducts])

  const updateURLParams = (newFilters: Omit<FilterType, 'limit' | 'page'>) => {
    const newParams = new URLSearchParams(searchParams)

    if (newFilters.categoryIds?.length) {
      newParams.set('category_id', newFilters.categoryIds[0].toString())
    } else {
      newParams.delete('category_id')
    }

    if (newFilters.nameQuery) {
      newParams.set('name_query', newFilters.nameQuery)
    } else {
      newParams.delete('name_query')
    }

    setSearchParams(newParams)
  }

  const handleApplyFilters = (filters: Omit<FilterType, 'limit' | 'page'>) => {
    setCurrentFilters(filters)
    setCurrentPage(1)
    updateURLParams(filters)
  }

  const handleSearchByName = (query: string) => {
    const newFilters = { ...currentFilters, nameQuery: query.trim() || undefined }
    setCurrentFilters(newFilters)
    setCurrentPage(1)
    updateURLParams(newFilters)
  }

  const renderProductList = () => {
    if (loadingList === 'pending' || loadingList === 'idle')
      return <div className='p-10 text-center'>{t('status:loading_products')}</div>

    if (error) return <div className='p-10 text-center text-red-500'>{t('status:error_fetch', { error })}</div>

    if (!listProducts.length) return <div className='p-10 text-center text-gray-500'>{t('product:no_results')}</div>

    return (
      <>
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5'>
          {listProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              detailRoutePrefix={detailRoutePrefix}
              disableCart={disableCart}
              disableWishlist={disableWishlist}
            />
          ))}
        </div>
        <div className='mt-8'>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
      <div className='space-y-6 lg:col-span-1'>
        <ProductSearchBar currentQuery={nameQueryParam} onSearch={handleSearchByName} />
        <ProductFilters onApplyFilters={handleApplyFilters} />
      </div>

      <div className='lg:col-span-3'>
        <h1 className='mb-4 text-2xl font-bold'>{t('product:results_count', { count: listProducts.length })}</h1>
        {renderProductList()}
      </div>
    </div>
  )
}

export default ProductsPage
