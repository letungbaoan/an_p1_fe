import React, { useState, useEffect } from 'react'
import SectionHeader from '@/components/home/SectionHeader'
import PromotionCard from '@/components/home/HorizontalPromotionCard'
import FeaturedProductsList from '@/components/home/FeaturedProductsList'
import type { BannerData } from '@/types/banner'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { useTranslation } from 'react-i18next'

const FeaturedProductsSection: React.FC = () => {
  const [promotions, setPromotions] = useState<BannerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation('promotion')

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROMOTIONS)
        setPromotions(response.data)
        setLoading(false)
      } catch (err) {
        setError(t('fetch_error', { error: err }))
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [t])

  if (loading) {
    return (
      <div className='space-y-6'>
        <SectionHeader
          titleKey='section_headers.featured_products.title'
          subtitleKey='section_headers.featured_products.subtitle'
        />
        <FeaturedProductsList />
        <div className='py-8 text-center'>{t('loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <SectionHeader
          titleKey='section_headers.featured_products.title'
          subtitleKey='section_headers.featured_products.subtitle'
        />
        <FeaturedProductsList />
        <div className='py-8 text-center text-red-500'>{error}</div>
      </div>
    )
  }

  const displayedPromotions = promotions.slice(7, 10)

  return (
    <div className='space-y-6'>
      <SectionHeader
        titleKey='section_headers.featured_products.title'
        subtitleKey='section_headers.featured_products.subtitle'
      />

      <FeaturedProductsList />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {displayedPromotions.map((promo) => (
          <PromotionCard
            key={promo.id}
            titleKey={promo.titleKey}
            subtitleKey={promo.subtitleKey}
            imageSrc={promo.imgUrl}
            isFullWidth={false}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedProductsSection
