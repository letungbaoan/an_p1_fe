import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type LoginFormData } from '@/pages/AuthPage'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'
import { useLoginValidation } from '@/hooks/useLoginValidation'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading: boolean
}

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const { validateLogin } = useLoginValidation()
  const [errors, setErrors] = useState<Record<ErrorKey, string>>({} as Record<ErrorKey, string>)

  async function handleAction(formData: FormData) {
    const usernameOrEmail = formData.get('usernameOrEmail')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    const newErrors = validateLogin({ usernameOrEmail, password })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    onSubmit({ usernameOrEmail, password })
  }

  return (
    <form action={handleAction} className='space-y-4'>
      <p className='text-center text-sm text-gray-500'>{t('login_description')}</p>

      <InputField
        label={t('username_or_email_label')}
        name='usernameOrEmail'
        type='text'
        error={errors[ERROR_KEYS.USERNAME_OR_EMAIL]}
        disabled={isLoading}
      />

      <InputField
        label={t('password_label')}
        name='password'
        type='password'
        error={errors[ERROR_KEYS.PASSWORD]}
        disabled={isLoading}
      />

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
