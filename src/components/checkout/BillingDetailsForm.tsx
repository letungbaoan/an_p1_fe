import React from 'react'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'

interface BillingProps {
  errors: Record<string, string>
  t: (key: string) => string
  defaultValues?: {
    fullName?: string
    email?: string
    phone?: string
    address?: string
    orderNotes?: string
  }
}

const BillingDetailsForm: React.FC<BillingProps> = ({ errors, t, defaultValues }) => (
  <div className='space-y-4'>
    <h3 className='mb-4 text-xl font-semibold'>{t('contact_info')}</h3>

    <div className='grid grid-cols-2 gap-4'>
      <InputField
        label={t('full_name')}
        name='fullName'
        type='text'
        defaultValue={defaultValues?.fullName || ''}
        error={errors[ERROR_KEYS.FULL_NAME]}
      />
      <InputField
        label={t('email')}
        name='email'
        type='email'
        defaultValue={defaultValues?.email || ''}
        error={errors[ERROR_KEYS.EMAIL]}
      />
    </div>

    <InputField
      label={t('phone')}
      name='phone'
      type='tel'
      defaultValue={defaultValues?.phone || ''}
      error={errors[ERROR_KEYS.PHONE]}
    />

    <InputField
      label={t('delivery_address')}
      name='address'
      type='text'
      defaultValue={defaultValues?.address || ''}
      error={errors[ERROR_KEYS.ADDRESS]}
    />

    <InputField
      label={t('order_notes')}
      name='orderNotes'
      type='textarea'
      defaultValue={defaultValues?.orderNotes || ''}
      placeholder={t('notes_placeholder')}
      error={errors[ERROR_KEYS.ORDER_NOTES]}
    />
  </div>
)

export default BillingDetailsForm
