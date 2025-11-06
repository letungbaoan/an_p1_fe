import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter'
import type { CheckoutItem } from '@/types/checkout'

interface SummaryProps {
  items: CheckoutItem[]
  total: number
}

const OrderSummary: React.FC<SummaryProps> = ({ items, total }) => {
  const { t } = useTranslation('checkout')
  const formatCurrency = useCurrencyFormatter()

  const subtotalItems = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item?.product?.price) || 0
      const amount = Number(item?.amount) || 0
      return sum + price * amount
    }, 0)
  }, [items])

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-lg'>
      <h3 className='mb-4 border-b pb-2 text-2xl font-bold'>{t('your_order')}</h3>

      <div className='mb-2 flex justify-between text-sm font-medium text-gray-700'>
        <span>{t('product')}</span>
        <span>{t('subtotal')}</span>
      </div>

      <div className='space-y-3 border-b pb-4'>
        {items.slice(0, 3).map((item, index) => {
          const itemPrice = item.product.price ?? 0
          const itemAmount = item.amount ?? 0

          return (
            <div key={index} className='flex justify-between text-sm'>
              <p className='text-gray-800'>
                {item.product.name} x {item.amount}
              </p>
              <p className='font-medium'>{formatCurrency(itemPrice * itemAmount)}</p>
            </div>
          )
        })}
        {items.length > 3 && (
          <p className='text-sm text-gray-500'>
            + {items.length - 3} {t('more_items')}
          </p>
        )}
      </div>

      <div className='flex justify-between pb-2 pt-4'>
        <span className='text-base font-medium'>{t('subtotal')}</span>
        <span className='text-base'>{formatCurrency(subtotalItems)}</span>
      </div>

      <div className='flex justify-between border-t pt-4 text-xl font-extrabold'>
        <span>{t('total')}</span>
        <span className='text-purple-600'>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

export default OrderSummary
