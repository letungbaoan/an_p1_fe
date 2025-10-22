import { useMemo } from 'react'
import SectionHeader from '@/components/home/SectionHeader'
import HorizontalProductCard from '@/components/common/HorizontalProductCard'
import ProductCardLarge from '@/components/common/ProductCardLarge'
import { useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import DealsOfTheDayFooter from '@/components/home/DealsOfTheDayFooter'

export default function DealsOfTheDaySection() {
  const { t } = useTranslation('status')
  const { featuredProducts, loading, error } = useAppSelector((state) => ({
    featuredProducts: state.products.featuredProducts || [],
    loading: state.products.loadingFeatured,
    error: state.products.error
  }))

  const dealProducts = useMemo(() => {
    return featuredProducts.slice(0, 3)
  }, [featuredProducts])

  const productSmall1 = dealProducts[0]
  const productSmall2 = dealProducts[1]
  const productLarge = dealProducts[2]

  const isLoading = loading === 'pending' || loading === 'idle'
  const hasData = dealProducts.length >= 3

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='grid h-96 grid-cols-3 gap-6'>
          <div className='col-span-1 space-y-4'>
            <div className='h-40 animate-pulse rounded-xl bg-gray-200'></div>
            <div className='h-40 animate-pulse rounded-xl bg-gray-200'></div>
          </div>
          <div className='col-span-2 h-full animate-pulse rounded-xl bg-gray-200'></div>
        </div>
      )
    }

    if (error || !hasData) {
      return <div className='p-10 text-center text-red-500'>{t('no_deals')}</div>
    }

    return (
      <div className='mt-6 grid grid-cols-3 gap-6'>
        <div className='col-span-1 flex flex-col justify-between space-y-4'>
          <div className='h-1/2'>{productSmall1 && <HorizontalProductCard product={productSmall1} />}</div>
          <div className='h-1/2'>{productSmall2 && <HorizontalProductCard product={productSmall2} />}</div>
        </div>

        <div className='col-span-2 h-full'>{productLarge && <ProductCardLarge product={productLarge} />}</div>
      </div>
    )
  }

  return (
    <div className='mt-8'>
      <SectionHeader
        titleKey='section_headers.deals_of_the_day.title'
        subtitleKey='section_headers.deals_of_the_day.subtitle'
        showViewAll={true}
      />

      {renderContent()}

      <DealsOfTheDayFooter />
    </div>
  )
}
