import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PromotionCardProps {
  titleKey: string
  subtitleKey: string
  imageSrc: string
  buttonRoute?: string
  tagKey?: string
  isFullWidth?: boolean
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  titleKey,
  subtitleKey,
  imageSrc,
  buttonRoute,
  tagKey = 'promotions.only_this_week',
  isFullWidth = false
}) => {
  const { t } = useTranslation()

  const cardWidthClass = isFullWidth ? 'col-span-full h-48 sm:h-64' : 'h-64'

  return (
    <div
      className={`relative flex items-center rounded-xl p-6 shadow-md transition duration-300 hover:shadow-xl ${cardWidthClass}`}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFF0F0'
      }}
    >
      <div className='relative z-10 max-w-[60%] sm:max-w-[50%]'>
        <span className='text-sm font-semibold text-gray-700'>{t(tagKey)}</span>

        <h3 className='mb-2 mt-1 text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl'>{t(titleKey)}</h3>

        <p className='mb-4 text-sm text-gray-600'>{t(subtitleKey)}</p>

        {buttonRoute && (
          <Link
            to={buttonRoute}
            className='inline-flex items-center text-sm font-medium text-purple-600 transition hover:text-purple-700'
          >
            {t('common.shop_now')}
            <ArrowRight size={16} className='ml-1' />
          </Link>
        )}
      </div>
    </div>
  )
}

export default PromotionCard
