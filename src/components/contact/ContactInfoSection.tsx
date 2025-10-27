import React from 'react'
import { Facebook, Instagram, Linkedin, MapPin, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface OfficeDetailProps {
  title: string
  address: string
  phone: string
  email: string
}

const OfficeDetail: React.FC<OfficeDetailProps> = ({ title, address, phone, email }) => (
  <div className='space-y-3'>
    <div className='flex items-center space-x-3'>
      <MapPin size={24} className='text-purple-600' />
      <h3 className='text-lg font-bold text-gray-800'>{title}</h3>
    </div>
    <p className='text-sm text-gray-600'>{address}</p>
    <p className='text-xl font-bold text-gray-800'>{phone}</p>
    <a href={`mailto:${email}`} className='text-sm text-purple-600 hover:underline'>
      {email}
    </a>
  </div>
)

const ContactInfoSection: React.FC = () => {
  const { t } = useTranslation('contact')

  return (
    <div className='space-y-12'>
      <div>
        <h2 className='mb-4 text-2xl font-bold text-gray-900'>{t('offices_title')}</h2>
        <p className='mb-8 text-sm text-gray-600'>{t('offices_desc')}</p>
      </div>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
        <OfficeDetail
          title={t('office_us_title')}
          address='205 Middle Road, 2nd Floor, New York'
          phone='+02 1234 567 88'
          email='info@example.com'
        />
        <OfficeDetail
          title={t('office_munich_title')}
          address='205 Middle Road, 2nd Floor, New York'
          phone='+5 456 123 22'
          email='contact@example.com'
        />
      </div>

      <div className='pt-4'>
        <h4 className='mb-3 text-sm font-medium text-gray-700'>{t('follow_us')}</h4>
        <div className='mt-3 flex gap-3 text-gray-600'>
          <Facebook size={18} className='cursor-pointer hover:text-purple-700' />
          <X size={18} className='cursor-pointer hover:text-purple-700' />
          <Instagram size={18} className='cursor-pointer hover:text-purple-700' />
          <Linkedin size={18} className='cursor-pointer hover:text-purple-700' />
        </div>
      </div>
    </div>
  )
}

export default ContactInfoSection
