import React from 'react'
import { useTranslation } from 'react-i18next'
import ContactInfoSection from '@/components/contact/ContactInfoSection'
import ContactFormSection from '@/components/contact/ContactFormSection'

const ContactPage: React.FC = () => {
  const { t } = useTranslation('contact')

  return (
    <div className='bg-white pb-20 pt-10'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <header className='mb-16 text-center'>
          <p className='text-sm uppercase tracking-widest text-gray-600'>{t('contact_us')}</p>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='mx-auto max-w-2xl text-base text-gray-600'>{t('subtitle')}</p>
        </header>

        <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
          <ContactInfoSection />

          <ContactFormSection />
        </div>
      </div>
    </div>
  )
}

export default ContactPage
