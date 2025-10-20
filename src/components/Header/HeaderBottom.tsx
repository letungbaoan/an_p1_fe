import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../../constants/routes'

const HeaderBottom = () => {
  const { t } = useTranslation('header')

  return (
    <div className='border-t border-gray-200 bg-white text-sm font-medium text-gray-700'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8'>
        <nav className='flex space-x-6'>
          <Link to={ROUTES.HOME}>{t('home')}</Link>

          <div className='flex cursor-pointer items-center space-x-1'>
            <span>{t('shop')}</span>
            <ChevronDown size={14} />
          </div>

          <Link to={ROUTES.FRUITS}>{t('fruits')}</Link>
          <Link to={ROUTES.BEVERAGES}>{t('beverages')}</Link>
          <Link to={ROUTES.BLOG}>{t('blog')}</Link>
          <Link to={ROUTES.CONTACT}>{t('contact')}</Link>
        </nav>

        <div className='flex items-center space-x-6'>
          <div className='flex cursor-pointer items-center space-x-1'>
            <span className='font-semibold'>{t('trending_products')}</span>
            <ChevronDown size={14} />
          </div>

          <div className='flex items-center space-x-1'>
            <span className='font-semibold text-red-600'>{t('almost_finished')}</span>
            <span className='rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>{t('sale')}</span>
            <ChevronDown size={14} className='text-gray-500' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderBottom
