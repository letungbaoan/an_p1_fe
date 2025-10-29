import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { type RegisterFormData } from '@/pages/AuthPage'
import { ROUTES } from '@/constants/routes'
import { Link } from 'react-router-dom'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading: boolean
}

// 🔹 Kiểu dữ liệu cho key lỗi (liên kết trực tiếp với ERROR_KEYS)
type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export default function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const { t } = useTranslation('auth')
  const [errors, setErrors] = useState<Record<ErrorKey, string>>({} as Record<ErrorKey, string>)

  async function handleAction(formData: FormData) {
    const username = formData.get('username')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    const newErrors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (!username || username.length < 6) newErrors[ERROR_KEYS.USERNAME] = t('error_username')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors[ERROR_KEYS.EMAIL] = t('error_email')
    if (!password || password.length < 6) newErrors[ERROR_KEYS.PASSWORD] = t('error_password')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({} as Record<ErrorKey, string>)
    onSubmit({ username, email, password })
  }

  return (
    <form action={handleAction} className='space-y-4'>
      <p className='text-center text-sm text-gray-500'>{t('register_description')}</p>

      <InputField
        label={t('username_label')}
        name='username'
        type='text'
        error={errors[ERROR_KEYS.USERNAME]}
        disabled={isLoading}
      />

      <InputField
        label={t('email_label')}
        name='email'
        type='email'
        error={errors[ERROR_KEYS.EMAIL]}
        disabled={isLoading}
      />

      <InputField
        label={t('password_label')}
        name='password'
        type='password'
        error={errors[ERROR_KEYS.PASSWORD]}
        disabled={isLoading}
      />

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
