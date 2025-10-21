import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import visa from '@/assets/visa.png'
import mastercard from '@/assets/mastercard.png'
import paypal from '@/assets/paypal.png'
import skrill from '@/assets/skrill.png'
import klarna from '@/assets/klarna.png'
import { ROUTES } from '@/constants/routes'

const FooterBottom = () => {
  const { t } = useTranslation('footer')

  const paymentMethods = [
    { src: visa, alt: 'Visa' },
    { src: mastercard, alt: 'Mastercard' },
    { src: paypal, alt: 'PayPal' },
    { src: skrill, alt: 'Skrill' },
    { src: klarna, alt: 'Klarna' }
  ]

  return (
    <div className='mx-auto flex max-w-7xl flex-col justify-between p-4 text-sm text-gray-500'>
      <div className='flex max-w-7xl flex-row items-center justify-between gap-3'>
        <p>{t('bottom_copyright')}</p>
        <div className='mt-2 flex gap-3 md:mt-0'>
          <Link to={ROUTES.TERMS} className='underline hover:text-purple-700'>
            {t('bottom_terms')}
          </Link>
          <Link to={ROUTES.PRIVACY} className='underline hover:text-purple-700'>
            {t('bottom_privacy')}
          </Link>
          <Link to={ROUTES.ORDER_TRACKING} className='underline hover:text-purple-700'>
            {t('bottom_tracking')}
          </Link>
        </div>
      </div>
      <div className='mt-4 flex gap-3'>
        {paymentMethods.map((method) => (
          <img key={method.alt} src={method.src} alt={method.alt + ' logo'} className='h-5' />
        ))}
      </div>
    </div>
  )
}

export default FooterBottom
