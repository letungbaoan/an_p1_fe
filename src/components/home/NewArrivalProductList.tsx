import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import UserFeatureCard from '@/components/home/UserFeatureCard'
import VerticalPromotionCard from '@/components/home/VerticalPromotionCard'
import ProductCard from '@/components/common/VerticalProductCard'
import { useTranslation } from 'react-i18next'

import type { BannerData } from '@/types/banner'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'

const NewArrivalProductList: React.FC = () => {
  const { newProducts, loadingNew, error } = useAppSelector((state) => state.products)
  const { t } = useTranslation('promotion')

  const [banner, setBanner] = useState<BannerData | null>(null)
  const [bannerLoading, setBannerLoading] = useState(true)
  const [bannerError, setBannerError] = useState<string | null>(null)

  const displayProducts = newProducts.slice(0, 5)
  const CARD_HEIGHT = 'h-[280px]'
  const CARD_MIN_H = 'h-[332px]'

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROMOTIONS)
        const bannerData = response.data.find((item: BannerData) => item.id === '4')
        setBanner(bannerData)
        setBannerLoading(false)
      } catch (err) {
        setBannerError(t('fetch_error', { error: err }))
        setBannerLoading(false)
      }
    }

    fetchBanner()
  }, [t])

  const renderProducts = () => {
    if (loadingNew === 'pending' || loadingNew === 'idle') {
      return displayProducts.map((_, i) => (
        <div key={i} className='w-full shrink-0'>
          <div className={`${CARD_MIN_H} animate-pulse rounded-xl bg-gray-200`}></div>
        </div>
      ))
    }

    if (loadingNew === 'failed' || error) {
      return <div className='p-4 text-center text-red-500'>{t('status:error_fetch', { error: error })}</div>
    }

    if (newProducts.length === 0) {
      return <div className='p-4 text-center text-gray-500'>{t('status:empty_products')}</div>
    }

    return displayProducts.map((product) => (
      <div key={product.id} className='w-[196px] shrink-0'>
        <ProductCard product={product} className={`${CARD_MIN_H} h-full`} />
      </div>
    ))
  }

  return (
    <div className='my-6'>
      <div className={`grid grid-cols-1 md:grid-cols-5 ${CARD_HEIGHT}`}>
        <div className='flex h-full flex-col justify-between md:col-span-1'>
          <UserFeatureCard />
          <div className='grow'>
            {bannerLoading ? (
              <div className='flex h-full items-center justify-center text-gray-500'>{t('loading')}</div>
            ) : bannerError ? (
              <div className='flex h-full items-center justify-center text-red-500'>{bannerError}</div>
            ) : banner ? (
              <VerticalPromotionCard
                titleKey={banner.titleKey}
                subtitleKey={banner.subtitleKey}
                imageSrc={banner.imgUrl}
                className='h-full'
              />
            ) : (
              <div className='flex h-full items-center justify-center text-gray-500'>{t('no_banner')}</div>
            )}
          </div>
        </div>

        <div className='h-full overflow-hidden md:col-span-4'>
          <div className='flex h-full overflow-x-auto pb-4'>
            <div className='flex h-full flex-row flex-nowrap'>{renderProducts()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewArrivalProductList
