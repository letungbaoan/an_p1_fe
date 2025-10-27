import { useState } from 'react'
import ProfileForm from '@/components/myAccount/ProfileForm'
import { useTranslation } from 'react-i18next'

const TABS = ['profile', 'orderHistory']

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { t } = useTranslation('myAccount')

  return (
    <div className='mx-auto flex min-h-[80vh] max-w-7xl py-8'>
      <nav className='w-64 shrink-0 rounded-xl bg-white p-4 shadow-lg'>
        <ul className='space-y-1'>
          {TABS.map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer rounded-lg p-3 text-base font-medium transition duration-150 ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`tabs.${tab}`)}
            </li>
          ))}
        </ul>
      </nav>

      <div className='ml-6 flex-1 rounded-xl bg-white p-8 shadow-lg'>
        {activeTab === 'profile' && <ProfileForm />}

        {activeTab === 'orderHistory' && (
          <div className='p-10 text-center text-gray-500'>{t('orderHistoryComingSoon')}</div>
        )}
      </div>
    </div>
  )
}
