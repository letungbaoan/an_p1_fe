import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { type RegisterFormData } from '@/pages/AuthPage'
import { ROUTES } from '@/constants/routes'
import { Link } from 'react-router-dom'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading: boolean
}

export default function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const { t } = useTranslation('auth')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleAction(formData: FormData) {
    const username = formData.get('username')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    const newErrors: Record<string, string> = {}

    if (!username || username.length < 6) newErrors.username = t('error_username')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t('error_email')
    if (!password || password.length < 6) newErrors.password = t('error_password')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit({ username, email, password })
  }

  return (
    <form action={handleAction} className='space-y-4'>
      <p className='text-center text-sm text-gray-500'>{t('register_description')}</p>

      <div>
        <label className='block text-sm font-medium text-gray-700'>{t('username_label')}</label>
        <input
          name='username'
          type='text'
          className={`mt-1 w-full rounded-md border p-2 focus:outline-none ${
            errors.username ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
          }`}
        />
        {errors.username && <p className='text-sm text-red-500'>{errors.username}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>{t('email_label')}</label>
        <input
          name='email'
          type='email'
          className={`mt-1 w-full rounded-md border p-2 focus:outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
          }`}
        />
        {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>{t('password_label')}</label>
        <input
          name='password'
          type='password'
          className={`mt-1 w-full rounded-md border p-2 focus:outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
          }`}
        />
        {errors.password && <p className='text-sm text-red-500'>{errors.password}</p>}
      </div>

      <p className='text-xs text-gray-500'>
        {t('privacy_notice')}{' '}
        <Link to={ROUTES.PRIVACY} className='text-purple-600 underline'>
          {t('privacy_policy')}
        </Link>
        .
      </p>

      <button
        type='submit'
        disabled={isLoading}
        className={`w-full rounded-md bg-purple-600 py-2 font-medium text-white transition ${
          isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-purple-700'
        }`}
      >
        {isLoading ? t('registering') : t('register_button')}
      </button>
    </form>
  )
}
