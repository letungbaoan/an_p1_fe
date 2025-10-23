import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { API_ENDPOINTS } from '@/constants/api'

interface PromotionCardProps {
  titleKey: string
  subtitleKey: string
  imageSrc: string
  isFullWidth?: boolean
}

const cardBaseStyles: React.CSSProperties = {
  backgroundSize: 'cover',
  backgroundPosition: 'center right',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#FFF0F0'
}

const HorizontalPromotionCard: React.FC<PromotionCardProps> = ({
  titleKey,
  subtitleKey,
  imageSrc,
  isFullWidth = false
}) => {
  const { t } = useTranslation('promotion')

  const cardWidthClass = isFullWidth ? 'col-span-full h-48 sm:h-64' : 'h-64'

  return (
    <div
      className={`relative flex items-center rounded-xl p-6 shadow-md transition duration-300 hover:shadow-xl ${cardWidthClass}`}
      style={{
        ...cardBaseStyles,
        backgroundImage: `url(${imageSrc})`
      }}
    >
      <div className='relative z-10 flex h-full max-w-[60%] flex-col justify-between sm:max-w-[50%]'>
        <span className='text-sm font-semibold text-orange-500'>{t('only_this_week')}</span>

        <div>
          <h3 className='mb-2 mt-1 text-lg font-extrabold leading-tight text-gray-900'>{t(titleKey)}</h3>
          <p className='text-sm text-black'>{t(subtitleKey)}</p>
        </div>

        <Link
          to={API_ENDPOINTS.PRODUCTS}
          className='mt-4 flex max-w-32 items-center gap-1 rounded-full border border-gray-700 bg-white px-4 py-2 text-sm font-semibold text-[#1A1821] transition hover:bg-gray-100'
        >
          {t('common:shop_now')}
          <ArrowRight size={16} className='ml-1' />
        </Link>
      </div>
    </div>
  )
}

export default HorizontalPromotionCard
