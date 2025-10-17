import { User, Heart, ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const UserActions = () => {
  const { t } = useTranslation('header')

  return (
    <div className='flex items-center space-x-6 text-gray-700'>
      <a href='#' className='flex cursor-pointer flex-col items-center hover:text-purple-600'>
        <User size={24} />
        <span className='text-sm font-medium'>{t('sign_in')}</span>
        <span className='text-sm font-bold leading-none'>{t('account')}</span>
      </a>

      <a href='#' className='relative cursor-pointer hover:text-purple-600'>
        <Heart size={24} />
        <span className='absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
          0
        </span>
      </a>

      <a href='#' className='relative flex cursor-pointer items-center hover:text-purple-600'>
        <ShoppingCart size={24} />
        <span className='absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
          0
        </span>
      </a>
    </div>
  )
}

export default UserActions
