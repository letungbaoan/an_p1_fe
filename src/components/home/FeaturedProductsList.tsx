import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchFeaturedProducts } from '@/redux/slices/productsSlice'
import VerticalPromotionCard from '@/components/home/VerticalPromotionCard'
import ProductCard from '@/components/common/VerticalProductCard'
import { useTranslation } from 'react-i18next'

import type { BannerData } from '@/types/banner'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'

const FeaturedProductsList: React.FC = () => {
  const { t } = useTranslation('status')
  const dispatch = useAppDispatch()

  const { featuredProducts, loading, error } = useAppSelector((state) => ({
    featuredProducts: state.products.featuredProducts || [],
    loading: state.products.loadingFeatured,
    error: state.products.error
  }))

  const [banner, setBanner] = useState<BannerData | null>(null)
  const [bannerLoading, setBannerLoading] = useState(true)
  const [bannerError, setBannerError] = useState<string | null>(null)

  const LIMIT = 4
  const PAGE = 3

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchFeaturedProducts({ limit: LIMIT, page: PAGE }))
    }
  }, [dispatch, loading])

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROMOTIONS)
        const bannerData = response.data.find((item: BannerData) => item.id === '7')
        setBanner(bannerData)
        setBannerLoading(false)
      } catch (err) {
        setBannerError(t('promotion:fetch_error', { error: err }))
        setBannerLoading(false)
      }
    }

    fetchBanner()
  }, [t])

  const renderProducts = () => {
    if (loading === 'pending' || loading === 'idle') {
      return <div className='col-span-4 p-8 text-center text-gray-500'>{t('loading_products')}</div>
    }

    if (loading === 'failed' || error) {
      return (
        <div className='col-span-4 p-8 text-center text-red-500'>
          {t('error_fetch', { error: error || 'Unknown Error' })}
        </div>
      )
    }

    if (!featuredProducts.length) {
      return <div className='col-span-4 p-8 text-center text-gray-500'>{t('empty_products')}</div>
    }

    return featuredProducts.map((product) => (
      <div key={product.id} className='w-full'>
        <ProductCard product={product} />
      </div>
    ))
  }

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-5 gap-0'>
        <div className='col-span-1 h-full'>
          {bannerLoading ? (
            <div className='flex h-full items-center justify-center text-gray-500'>{t('promotion:loading')}</div>
          ) : bannerError ? (
            <div className='flex h-full items-center justify-center text-red-500'>{bannerError}</div>
          ) : banner ? (
            <VerticalPromotionCard
              titleKey={banner.titleKey}
              subtitleKey={banner.subtitleKey}
              imageSrc={banner.imgUrl}
              className='h-full'
              showButton
            />
          ) : (
            <div className='flex h-full items-center justify-center text-gray-500'>{t('promotion:no_banner')}</div>
          )}
        </div>

        <div className='col-span-4 h-full'>
          <div className='grid grid-cols-4 gap-0'>{renderProducts()}</div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProductsList
