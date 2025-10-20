import { ChevronDown } from 'lucide-react'
import { useTranslation, Trans } from 'react-i18next'
import { ROUTES } from '../../constants/routes'

const HeaderTop = () => {
  const { t, i18n } = useTranslation('header')

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className='bg-white px-4 py-2 text-light-gray'>
      <div className='mx-auto flex max-w-7xl items-center justify-between text-sm'>
        <div className='flex space-x-4'>
          <a href={ROUTES.ABOUT} className='hover:text-gray-200'>
            {t('about_us')}
          </a>
          <a href={ROUTES.MY_ACCOUNT} className='hover:text-gray-200'>
            {t('my_account')}
          </a>
          <a href={ROUTES.WISHLIST} className='hover:text-gray-200'>
            {t('wishlist')}
          </a>
          <p>
            <Trans
              i18nKey='header:delivery_time'
              values={{ start: '7:00', end: '23:00' }}
              components={[<span key='time' className='font-bold text-[#EA580C]' />]}
            />
          </p>
        </div>

        <div className='flex items-center space-x-4'>
          <div onClick={toggleLanguage} className='flex cursor-pointer items-center space-x-1 hover:text-gray-200'>
            <span>{t('language')}</span>
            <ChevronDown size={14} />
          </div>
          <div className='flex cursor-pointer items-center space-x-1 hover:text-gray-200'>
            <span>{t('currency')}</span>
            <ChevronDown size={14} />
          </div>
          <a href={ROUTES.ORDER_TRACKING} className='hover:text-gray-200'>
            {t('order_tracking')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default HeaderTop
