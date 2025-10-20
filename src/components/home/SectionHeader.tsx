import { ROUTES } from '@/constants/routes'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface SectionHeaderProps {
  titleKey: string
  subtitleKey: string

  showViewAll?: boolean
  viewAllTextKey?: string
}

export default function SectionHeader({
  titleKey,
  subtitleKey,
  showViewAll = true,
  viewAllTextKey = 'common.view_all'
}: SectionHeaderProps) {
  const { t } = useTranslation('home')

  return (
    <div className='flex items-end justify-between border-b border-gray-200 pb-2 pt-8'>
      <div className='flex flex-row items-center gap-2'>
        <h2 className='text-2xl font-extrabold text-[#1A1821]'>{t(titleKey)}</h2>

        <span className='text-base font-normal text-gray-500'>{t(subtitleKey)}</span>
      </div>

      {showViewAll && (
        <Link
          to={ROUTES.PRODUCTS}
          className='flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-[#1A1821] transition hover:bg-gray-100'
        >
          {t(viewAllTextKey)}
          <span className='ml-1 text-base'>&rarr;</span>
        </Link>
      )}
    </div>
  )
}
