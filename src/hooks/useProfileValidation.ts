import { useState } from 'react'
import { ERROR_KEYS } from '@/constants/errorKeys'

export const useProfileValidation = (t: (key: string) => string) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: Record<string, string>) => {
    const newErrors: Record<string, string> = {}

    if (!data.username || data.username.length < 6) newErrors[ERROR_KEYS.USERNAME] = t('profileForm.error_username')

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors[ERROR_KEYS.EMAIL] = t('profileForm.error_email')

    if (data.password && data.password !== '********' && data.password.length < 6)
      newErrors[ERROR_KEYS.PASSWORD] = t('profileForm.error_password')

    setErrors(newErrors)
    return newErrors
  }

  return { errors, validate, setErrors }
}
