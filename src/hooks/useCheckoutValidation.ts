import { useState } from 'react'
import { ERROR_KEYS } from '@/constants/errorKeys'

export const useCheckoutValidation = (t: (key: string) => string) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: Record<string, string>) => {
    const newErrors: Record<string, string> = {}

    if (!data.fullName) newErrors[ERROR_KEYS.FULL_NAME] = t('error_full_name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors[ERROR_KEYS.EMAIL] = t('error_email')
    if (!data.phone) newErrors[ERROR_KEYS.PHONE] = t('error_phone')
    if (!data.address) newErrors[ERROR_KEYS.ADDRESS] = t('error_address')

    setErrors(newErrors)
    return newErrors
  }

  return { errors, validate, setErrors }
}
