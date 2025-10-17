import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FooterKnowUs = () => {
  const { t } = useTranslation('footer')

  return (
    <div>
      <h3 className='mb-2 font-semibold'>{t('knowUs_title')}</h3>
      <ul className='space-y-1 text-sm text-gray-600'>
        {(t('knowUs_items', { returnObjects: true }) as string[]).map((item, i) => (
          <li key={i}>
            <Link to='#' className='hover:text-purple-700'>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterKnowUs
