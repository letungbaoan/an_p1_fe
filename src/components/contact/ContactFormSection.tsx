import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ContactFormSection() {
  const { t } = useTranslation('contact')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAction(formData: FormData) {
    const name = formData.get('name')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const subject = formData.get('subject')?.toString().trim() || ''
    const message = formData.get('message')?.toString().trim() || ''

    const newErrors: Record<string, string> = {}

    if (!name) newErrors.name = t('error_name') || 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t('error_email') || 'Invalid email.'
    if (!subject) newErrors.subject = t('error_subject') || 'Subject is required.'
    if (!message) newErrors.message = t('error_message') || 'Message cannot be empty.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    // Tạm thời console.log để kiểm tra hoạt động của nút, khi triển khai thực tế sẽ xóa console log và thay bằng logic gọi api
    console.log('Form submitted:', { name, email, subject, message })

    setTimeout(() => setIsSubmitting(false), 1000)
  }

  return (
    <form action={handleAction} className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
            {t('form_name')}
          </label>
          <input
            id='name'
            name='name'
            type='text'
            className={`mt-1 w-full rounded-md border p-3 focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-gray-300 focus:border-purple-600'
            }`}
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            {t('form_email')}
          </label>
          <input
            id='email'
            name='email'
            type='email'
            className={`mt-1 w-full rounded-md border p-3 focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300 focus:border-purple-600'
            }`}
          />
          {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor='subject' className='block text-sm font-medium text-gray-700'>
          {t('form_subject')}
        </label>
        <input
          id='subject'
          name='subject'
          type='text'
          className={`mt-1 w-full rounded-md border p-3 focus:outline-none ${
            errors.subject ? 'border-red-500' : 'border-gray-300 focus:border-purple-600'
          }`}
        />
        {errors.subject && <p className='text-sm text-red-500'>{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
          {t('form_message')}
        </label>
        <textarea
          id='message'
          name='message'
          rows={6}
          className={`mt-1 w-full resize-none rounded-md border p-3 focus:outline-none ${
            errors.message ? 'border-red-500' : 'border-gray-300 focus:border-purple-600'
          }`}
        />
        {errors.message && <p className='text-sm text-red-500'>{errors.message}</p>}
      </div>

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
