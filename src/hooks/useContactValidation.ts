import { useState } from 'react'
import { ERROR_KEYS } from '@/constants/errorKeys'

export const useContactValidation = (t: (key: string) => string) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: Record<string, string>) => {
    const newErrors: Record<string, string> = {}

    if (!data.name) newErrors[ERROR_KEYS.NAME] = t('error_name') || 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors[ERROR_KEYS.EMAIL] = t('error_email') || 'Invalid email.'
    if (!data.subject) newErrors[ERROR_KEYS.SUBJECT] = t('error_subject') || 'Subject is required.'
    if (!data.message) newErrors[ERROR_KEYS.MESSAGE] = t('error_message') || 'Message cannot be empty.'

    setErrors(newErrors)
    return newErrors
  }

  return { errors, validate, setErrors }
}
