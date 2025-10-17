import { Facebook, Instagram, Linkedin, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import googlePlay from '@/assets/google-play.png'
import appStore from '@/assets/app-store.png'

const FooterDownload = () => {
  const { t } = useTranslation('footer')

  return (
    <div>
      <h3 className='mb-2 font-semibold'>{t('download_title')}</h3>
      <div className='space-y-2'>
        <img src={googlePlay} alt='Google Play' />
        <img src={appStore} alt='App Store' />
      </div>
      <p className='mt-3 text-xs text-gray-500'>{t('download_discount')}</p>

      <div className='mt-3 flex gap-3 text-gray-600'>
        <Facebook size={18} className='cursor-pointer hover:text-purple-700' />
        <X size={18} className='cursor-pointer hover:text-purple-700' />
        <Instagram size={18} className='cursor-pointer hover:text-purple-700' />
        <Linkedin size={18} className='cursor-pointer hover:text-purple-700' />
      </div>
    </div>
  )
}

export default FooterDownload
