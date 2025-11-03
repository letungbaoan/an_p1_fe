import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'
import { useContactValidation } from '@/hooks/useContactValidation'

export default function ContactFormSection() {
  const { t } = useTranslation('contact')
  const { errors, validate, setErrors } = useContactValidation(t)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAction(formData: FormData) {
    const data = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      subject: formData.get('subject')?.toString().trim() || '',
      message: formData.get('message')?.toString().trim() || ''
    }

    const newErrors = validate(data)
    if (Object.keys(newErrors).length > 0) return

    setErrors({})
    setIsSubmitting(true)

    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return (
    <form action={handleAction} className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <InputField label={t('form_name')} name='name' error={errors[ERROR_KEYS.NAME]} />
        <InputField label={t('form_email')} name='email' type='email' error={errors[ERROR_KEYS.EMAIL]} />
      </div>

      <InputField label={t('form_subject')} name='subject' error={errors[ERROR_KEYS.SUBJECT]} />
      <InputField label={t('form_message')} name='message' error={errors[ERROR_KEYS.MESSAGE]} />

      <button
        type='submit'
        disabled={isSubmitting}
        className={`rounded-md bg-purple-700 px-6 py-3 font-medium text-white transition ${
          isSubmitting ? 'cursor-not-allowed opacity-70' : 'hover:bg-purple-800'
        }`}
      >
        {isSubmitting ? t('form_sending_button') : t('form_send_button')}
      </button>
    </form>
  )
}
