import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { API_ENDPOINTS } from '@/constants/api'

interface PromotionCardProps {
  titleKey: string
  subtitleKey: string
  imageSrc: string
  className?: string
  showButton?: boolean
}

const cardBaseStyles: React.CSSProperties = {
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#FFF0F0'
}

const VerticalPromotionCard: React.FC<PromotionCardProps> = ({
  titleKey,
  subtitleKey,
  imageSrc,
  className = '',
  showButton = false
}) => {
  const { t } = useTranslation(['promotion', 'common'])

  const cardHeightClass = 'h-[255px] w-[200px] sm:w-[248px]'

  return (
    <div
      className={`relative flex flex-col justify-end overflow-hidden rounded-xl p-6 shadow-lg transition duration-300 hover:shadow-xl ${cardHeightClass} ${className}`}
      style={{
        ...cardBaseStyles,
        backgroundImage: `url(${imageSrc})`
      }}
    >
      <div className='relative z-10 flex w-full grow flex-col justify-start'>
        <span className='text-sm font-semibold text-orange-500'>{t(`promotion:only_this_week`)}</span>

        <div className='mb-4 mt-1'>
          <h3 className='text-2xl font-extrabold leading-tight text-gray-900'>{t(`promotion:${titleKey}`)}</h3>
          <p className='text-sm text-black'>{t(`promotion:${subtitleKey}`)}</p>
        </div>

        {showButton && (
          <Link
            to={API_ENDPOINTS.PRODUCTS}
            className='mt-4 flex max-w-32 items-center gap-1 rounded-full border border-gray-700 bg-white px-4 py-2 text-sm font-semibold text-[#1A1821] transition hover:bg-gray-100'
          >
            {t('common:shop_now')}
            <ArrowRight size={16} className='ml-1' />
          </Link>
        )}
      </div>
    </div>
  )
}

export default VerticalPromotionCard
