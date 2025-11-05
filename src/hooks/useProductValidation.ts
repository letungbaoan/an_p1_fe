import { useState } from 'react'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { addMilliseconds } from 'date-fns'
import { ERROR_KEYS } from '@/constants/errorKeys'

const TIME_ZONE = 'Asia/Ho_Chi_Minh'
const MAX_DEAL_TIME_MS = 30 * 24 * 60 * 60 * 1000

export interface ProductFormData {
  name: string
  price: string
  description: string
  category_id?: string
  stockQuantity: string
  discountPercentage: string
  dealEndTime: string
}

export const useProductValidation = (t: (key: string) => string) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: ProductFormData): boolean => {
    const newErrors: Record<string, string> = {}

    const now = new Date()
    const zonedNow = toZonedTime(now, TIME_ZONE)
    const maxDealTime = addMilliseconds(zonedNow, MAX_DEAL_TIME_MS)

    if (!data.name || data.name.length > 60) newErrors[ERROR_KEYS.NAME] = t('admin:error_name_length')

    const priceValue = parseFloat(data.price)
    if (isNaN(priceValue) || priceValue <= 0 || !/^\d+(\.\d{1,2})?$/.test(data.price))
      newErrors[ERROR_KEYS.PRICE] = t('admin:error_price_format_add')

    if (!data.description || data.description.length < 20 || data.description.length > 300)
      newErrors[ERROR_KEYS.DESCRIPTION] = t('admin:error_description_length_range')

    if ('category_id' in data && !data.category_id)
      newErrors[ERROR_KEYS.CATEGORY_ID] = t('admin:error_category_required')

    const stock = parseInt(data.stockQuantity)
    if (isNaN(stock) || stock <= 0) newErrors[ERROR_KEYS.STOCK_QUANTITY] = t('admin:error_stock_required')

    const discount = parseInt(data.discountPercentage)
    if (isNaN(discount) || discount < 0 || discount > 100)
      newErrors[ERROR_KEYS.DISCOUNT_PERCENTAGE] = t('admin:error_discount_range')

    if (!data.dealEndTime) {
      newErrors[ERROR_KEYS.DEAL_END_TIME] = t('admin:error_deal_time_required')
    } else {
      const endTime = fromZonedTime(data.dealEndTime, TIME_ZONE)
      if (endTime < zonedNow || endTime > maxDealTime)
        newErrors[ERROR_KEYS.DEAL_END_TIME] = t('admin:error_deal_time_range')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { errors, validate, setErrors }
}
