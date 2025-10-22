import { ROUTES } from '@/constants/routes'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface BannerProps {
  tagKey: string
  titleKey: string
  descriptionKey: string
  buttonTextKey: string
  originalPrice: string
  discountPrice: string
  backgroundImageSrc: string
}

const MyBannerComponent: React.FC<BannerProps> = ({
  tagKey,
  titleKey,
  descriptionKey,
  buttonTextKey,
  originalPrice,
  discountPrice,
  backgroundImageSrc
}) => {
  const { t } = useTranslation('home')

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${backgroundImageSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div
      className='relative flex min-h-[400px] w-full items-center justify-start overflow-hidden'
      style={backgroundStyle}
    >
      <div className='z-10 w-full max-w-lg p-8 md:p-16 lg:pl-24'>
        <span className='mb-2 inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white'>
          {t(tagKey)}
        </span>

        <h2 className='mb-4 text-3xl font-bold text-[#39245F] md:text-5xl'>{t(titleKey)}</h2>
        <p className='mb-6 text-gray-700 opacity-90 md:text-lg'>{t(descriptionKey)}</p>

        <div className='flex items-center gap-x-4'>
          <Link
            to={ROUTES.PRODUCTS}
            className='inline-block whitespace-nowrap rounded-md bg-purple-700 px-6 py-4 text-center font-semibold text-white hover:opacity-90'
          >
            {t(buttonTextKey)}
          </Link>

          <div className='flex flex-col'>
            <div>
              <span className='text-2xl font-bold text-red-500'>{discountPrice}</span>
              <span className='ml-4 text-lg font-bold text-black line-through opacity-80'>{originalPrice}</span>
            </div>

            <span className='whitespace-nowrap text-sm text-gray-500'>{t('common.offer_note')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyBannerComponent
