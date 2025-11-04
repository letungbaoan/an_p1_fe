import i18n from '@/i18n'
import axios from 'axios'

export const handleApiError = (err: unknown, fallbackKey: string) => {
  let message = i18n.t(fallbackKey)

  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.message || err.response?.data?.error || err.message
    if (detail) message = detail
  }

  return message
}
