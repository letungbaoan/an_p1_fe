import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

interface PlaceOrderActionProps {
  t: (key: string) => string
  isSubmitting: boolean
}

const PlaceOrderAction = ({ t, isSubmitting }: PlaceOrderActionProps) => (
  <div className='space-y-4'>
    <p className='text-xs text-gray-600'>
      {t('data_privacy_notice')}{' '}
      <Link to={ROUTES.PRIVACY} className='text-purple-600 underline'>
        {t('privacy_policy')}
      </Link>
      .
    </p>

    <label className='flex items-center space-x-2 text-sm font-medium'>
      <input type='checkbox' required className='text-purple-600 focus:ring-purple-500' />
      <span>{t('agree_to_terms')}</span>
    </label>

    <button
      type='submit'
      disabled={isSubmitting}
      className={`w-full rounded-lg py-3 font-semibold text-white transition ${
        isSubmitting ? 'cursor-not-allowed bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
      }`}
    >
      {isSubmitting ? t('placing_order') : t('place_order')}
    </button>
  </div>
)

export default PlaceOrderAction
