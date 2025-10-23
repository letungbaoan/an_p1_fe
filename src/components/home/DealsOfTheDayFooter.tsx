import React from 'react'
import { useTranslation } from 'react-i18next'

import icon1 from '@/assets/home/deals_footer_1.png'
import icon2 from '@/assets/home/deals_footer_2.png'
import icon3 from '@/assets/home/deals_footer_3.png'
import icon4 from '@/assets/home/deals_footer_4.png'

const FEATURES_DATA = [
  { id: 1, titleKey: 'feature.online_payment.title', descKey: 'feature.online_payment.desc', imgSrc: icon1 },
  { id: 2, titleKey: 'feature.new_stocks.title', descKey: 'feature.new_stocks.desc', imgSrc: icon2 },
  { id: 3, titleKey: 'feature.quality.title', descKey: 'feature.quality.desc', imgSrc: icon3 },
  { id: 4, titleKey: 'feature.delivery.title', descKey: 'feature.delivery.desc', imgSrc: icon4 }
]

interface FeatureItemProps {
  feature: (typeof FEATURES_DATA)[0]
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  const { t } = useTranslation('home')

  return (
    <div className='flex items-start space-x-4 p-4'>
      <div className='shrink-0'>
        <img src={feature.imgSrc} alt={t(feature.titleKey)} className='size-16 object-contain' />
      </div>

      <div className='flex flex-col'>
        <h3 className='mb-1 text-lg font-bold text-gray-800'>{t(feature.titleKey)}</h3>
        <p className='text-sm text-gray-500'>{t(feature.descKey)}</p>
      </div>
    </div>
  )
}

export default function DealsOfTheDayFooter() {
  return (
    <div className='mt-10 grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4'>
      {FEATURES_DATA.map((feature) => (
        <FeatureItem key={feature.id} feature={feature} />
      ))}
    </div>
  )
}
