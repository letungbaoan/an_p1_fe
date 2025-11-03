import { useTranslation } from 'react-i18next'
import { ERROR_KEYS } from '@/constants/errorKeys'
import type { LoginFormData } from '@/pages/AuthPage'

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export function useLoginValidation() {
  const { t } = useTranslation('auth')

  function validateLogin(data: LoginFormData) {
    const errors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (!data.usernameOrEmail) errors[ERROR_KEYS.USERNAME_OR_EMAIL] = t('error_username_or_email')
    if (!data.password || data.password.length < 6) errors[ERROR_KEYS.PASSWORD] = t('error_password')

    return errors
  }

  return { validateLogin }
}
