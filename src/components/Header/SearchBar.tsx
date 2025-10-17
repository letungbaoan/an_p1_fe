import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SearchBar = () => {
  const { t } = useTranslation('header')

  return (
    <div className='mx-8 hidden max-w-2xl grow lg:block'>
      <div className='relative'>
        <input
          type='text'
          placeholder={t('placeholder')}
          className='w-full rounded-lg bg-gray-100 py-3 pl-5 pr-12 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
        />
        <button className='absolute right-0 top-0 mr-4 mt-3 text-black hover:text-purple-600'>
          <Search size={22} />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
