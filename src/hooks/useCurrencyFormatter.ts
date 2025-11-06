import { useTranslation } from 'react-i18next'
import { useMemo, useState, useEffect } from 'react'

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY

const BASE_CURRENCY_MAP = {
  en: { code: 'USD', locale: 'en-US', fraction: 2 },
  vi: { code: 'VND', locale: 'vi-VN', fraction: 0 }
}

export const useCurrencyFormatter = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  const [rate, setRate] = useState<number>(27000)

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(`https://api.exchangerate.host/live?access_key=${ACCESS_KEY}`)
        const data = await res.json()
        if (data?.success && data?.quotes?.USDVND) {
          setRate(data.quotes.USDVND)
        }
      } catch {
        setRate(27000)
      }
    }

    fetchRate()
  }, [])

  const lang = Object.prototype.hasOwnProperty.call(BASE_CURRENCY_MAP, currentLang)
    ? (currentLang as keyof typeof BASE_CURRENCY_MAP)
    : 'en'

  const { code, locale, fraction } = BASE_CURRENCY_MAP[lang]

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: fraction
    })
  }, [locale, code, fraction])

  const format = (amountInUSD: number | undefined | null) => {
    if (amountInUSD == null) return ''
    const converted = amountInUSD * rate
    return formatter.format(converted)
  }

  return format
}
