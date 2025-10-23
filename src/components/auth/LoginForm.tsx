import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type LoginFormData } from '@/pages/AuthPage'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading: boolean
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleAction(formData: FormData) {
    const usernameOrEmail = formData.get('usernameOrEmail')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    const newErrors: Record<string, string> = {}

    if (!usernameOrEmail) newErrors.usernameOrEmail = t('error_username_or_email')
    if (!password || password.length < 6) newErrors.password = t('error_password')

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    onSubmit({ usernameOrEmail, password })
  }

  return (
    <form action={handleAction} className='space-y-4'>
      <p className='text-center text-sm text-gray-500'>{t('login_description')}</p>

      <div>
        <label className='block text-sm font-medium text-gray-700'>{t('username_or_email_label')}</label>
        <input
          name='usernameOrEmail'
          type='text'
          className={`mt-1 w-full rounded-md border p-2 focus:outline-none ${
            errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'
          }`}
        />
        {errors.usernameOrEmail && <p className='mt-1 text-sm text-red-500'>{errors.usernameOrEmail}</p>}
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
        {errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password}</p>}
      </div>

      <div className='flex items-center justify-between text-sm'>
        <label className='flex items-center'>
          <input type='checkbox' name='remember' className='mr-2' /> {t('remember_me')}
        </label>
        <a href='#' className='text-purple-600 hover:underline'>
          {t('lost_password')}
        </a>
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className={`w-full rounded-md bg-purple-600 py-2 font-medium text-white transition ${
          isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-purple-700'
        }`}
      >
        {isLoading ? t('logining') : t('login_button')}
      </button>
    </form>
  )
}
