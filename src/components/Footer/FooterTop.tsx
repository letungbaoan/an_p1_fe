import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const FooterTop = () => {
  const { t } = useTranslation('footer')

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 md:px-8'>
      <div className='flex flex-row items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-bold'>{t('title')}</h2>
          <p className='max-w-md text-sm text-gray-500'>{t('subtitle')}</p>
        </div>

        <div className='flex w-auto flex-col'>
          <div className='flex'>
            <div className='relative grow md:w-96'>
              <Mail size={18} className='absolute left-3 top-3 text-gray-400' />
              <input
                type='email'
                placeholder={t('placeholder')}
                className='w-full rounded-l-lg border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
            </div>
            <button className='rounded-r-lg bg-purple-700 px-6 py-2 text-white hover:bg-purple-800'>{t('send')}</button>
          </div>

          <p className='mt-2 text-xs text-gray-500'>
            {t('agreement')}{' '}
            <Link to={ROUTES.TERMS} className='text-purple-600 underline'>
              {t('terms')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FooterTop
