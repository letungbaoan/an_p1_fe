import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export default function ContactFormSection() {
  const { t } = useTranslation('contact')
  const [errors, setErrors] = useState<Record<ErrorKey, string>>({} as Record<ErrorKey, string>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAction(formData: FormData) {
    const name = formData.get('name')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const subject = formData.get('subject')?.toString().trim() || ''
    const message = formData.get('message')?.toString().trim() || ''

    const newErrors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (!name) newErrors[ERROR_KEYS.NAME] = t('error_name') || 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors[ERROR_KEYS.EMAIL] = t('error_email') || 'Invalid email.'
    if (!subject) newErrors[ERROR_KEYS.SUBJECT] = t('error_subject') || 'Subject is required.'
    if (!message) newErrors[ERROR_KEYS.MESSAGE] = t('error_message') || 'Message cannot be empty.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({} as Record<ErrorKey, string>)
    setIsSubmitting(true)

    console.log('Form submitted:', { name, email, subject, message })
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
