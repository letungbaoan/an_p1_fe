import { useTranslation } from 'react-i18next'
import Logo from './Logo'
import SearchBar from './SearchBar'
import UserActions from './UserActions'
import { MapPin } from 'lucide-react'

const HeaderMain = () => {
  const { t } = useTranslation('header')

  return (
    <div className='bg-white p-4 shadow-sm md:px-8'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Logo />

          <div className='ml-4 flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'>
            <MapPin size={24} className='mr-1 text-black' />
            <div className='flex flex-col leading-none'>
              <span className='text-xs font-medium text-light-gray'>{t('deliver_to')}</span>
              <span className='font-bold'>{t('all')}</span>
            </div>
          </div>
        </div>

        <SearchBar />
        <UserActions />
      </div>
    </div>
  )
}

export default HeaderMain
