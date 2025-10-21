import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotFoundImg from '@/assets/404.png'

const NotFound = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center text-center'>
      <img src={NotFoundImg} alt={t('not_found.alt_text')} className='w-1/2 max-w-[600px]' />
      <h1 className='mt-4 text-xl font-bold'>{t('notfound:title')}</h1>
      <p className='mb-6 text-sm text-gray-500'>{t('notfound:description')}</p>
      <div className='flex gap-2'>
        <button
          onClick={() => navigate('/')}
          className='rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
        >
          {t('notfound:home_button')}
        </button>
        <button
          onClick={() => navigate(-1)}
          className='rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100'
        >
          {t('notfound:back_button')}
        </button>
      </div>
    </div>
  )
}

export default NotFound
