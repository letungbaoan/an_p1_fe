import React from 'react'
import { type CheckoutItem } from '@/types/checkout'

interface SummaryProps {
  items: CheckoutItem[]
  total: number
  t: (key: string) => string
}

const OrderSummary: React.FC<SummaryProps> = ({ items, total, t }) => (
  <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-lg'>
    <h3 className='mb-4 border-b pb-2 text-2xl font-bold'>{t('your_order')}</h3>

    <div className='mb-2 flex justify-between text-sm font-medium text-gray-700'>
      <span>{t('product')}</span>
      <span>{t('subtotal')}</span>
    </div>

    <div className='space-y-3 border-b pb-4'>
      {items.slice(0, 3).map((item, index) => (
        <div key={index} className='flex justify-between text-sm'>
          <p className='text-gray-800'>
            {item.product.name} x {item.amount}
          </p>
          <p className='font-medium'>${(item.product.price * item.amount).toFixed(2)}</p>
        </div>
      ))}
      {items.length > 3 && (
        <p className='text-sm text-gray-500'>
          + {items.length - 3} {t('more_items')}
        </p>
      )}
    </div>

    <div className='flex justify-between pt-4 text-xl font-extrabold'>
      <span>{t('total')}</span>
      <span className='text-purple-600'>${total.toFixed(2)}</span>
    </div>
  </div>
)

export default OrderSummary
