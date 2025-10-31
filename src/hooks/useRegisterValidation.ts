import { useTranslation } from 'react-i18next'
import { ERROR_KEYS } from '@/constants/errorKeys'
import type { RegisterFormData } from '@/pages/AuthPage'

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export function useRegisterValidation() {
  const { t } = useTranslation('auth')

  function validateRegister(data: RegisterFormData) {
    const errors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (!data.username || data.username.length < 6) errors[ERROR_KEYS.USERNAME] = t('error_username')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors[ERROR_KEYS.EMAIL] = t('error_email')

    if (!data.password || data.password.length < 6) errors[ERROR_KEYS.PASSWORD] = t('error_password')

    return errors
  }

  return { validateRegister }
}
