import { Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const FooterHelp = () => {
  const { t } = useTranslation('footer')

  return (
    <div>
      <h3 className='mb-2 font-semibold'>{t('help_title')}</h3>
      <p className='mb-3 text-sm text-gray-500'>{t('help_desc')}</p>

      <div className='flex items-center gap-2'>
        <Phone size={18} />
        <div>
          <p className='text-xs text-gray-500'>{t('help_hours')}</p>
          <p className='text-lg font-semibold'>0 800 300-353</p>
        </div>
      </div>

      <div className='mt-2 flex items-center gap-2'>
        <Mail size={18} />
        <div>
          <p className='text-xs text-gray-500'>{t('help_support')}</p>
          <p className='text-sm font-semibold'>info@example.com</p>
        </div>
      </div>
    </div>
  )
}

export default FooterHelp
