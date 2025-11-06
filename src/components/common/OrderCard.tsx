import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Order } from '@/types/order'
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter'

interface OrderCardProps {
  order: Order
  editableStatus?: boolean
  onStatusChange?: (newStatus: Order['status']) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, editableStatus = false, onStatusChange }) => {
  const { t } = useTranslation('myAccount')
  const formatCurrency = useCurrencyFormatter()

  const id = order.id ?? '-'
  const date = order.date ?? '-'
  const fullName = order.full_name ?? t('no_name')
  const phone = order.phone_number ?? t('no_phone')
  const address = order.shipping_address ?? t('no_address')
  const paymentMethod = order.payment_method ?? ''
  const total = order.total ?? 0
  const items = Array.isArray(order.items) ? order.items : []

  const formatPaymentMethod = (method?: string) => {
    if (!method) return t('no_payment_method')
    return method
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const STATUS_LABELS: Record<Order['status'], string> = {
    pending: t('status_pending'),
    shipped: t('status_shipped'),
    delivered: t('status_delivered'),
    cancelled: t('status_cancelled')
  }

  const STATUS_COLORS: Record<Order['status'], string> = {
    pending: 'text-orange-500',
    shipped: 'text-blue-500',
    delivered: 'text-green-600',
    cancelled: 'text-red-500'
  }

  const getStatusLabel = (status?: Order['status']) => STATUS_LABELS[status ?? 'pending']

  const getStatusColor = (status?: Order['status']) => STATUS_COLORS[status ?? 'pending']

  const STATUS_OPTIONS = [
    { value: 'pending', label: t('status_pending') },
    { value: 'shipped', label: t('status_shipped') },
    { value: 'delivered', label: t('status_delivered') },
    { value: 'cancelled', label: t('status_cancelled') }
  ]

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-md'>
      <div className='mb-3 flex items-center justify-between border-b pb-3'>
        <div>
          <span className='block text-xl font-bold text-gray-800'>{t('order_number', { id })}</span>
          <span className='text-sm text-gray-500'>{t('order_date', { date })}</span>
        </div>

        {editableStatus ? (
          <div className='relative'>
            <select
              value={order.status ?? 'pending'}
              disabled={order.status === 'delivered' || order.status === 'cancelled'}
              onChange={(e) => onStatusChange?.(e.target.value as Order['status'])}
              className={`appearance-none rounded-full border px-3 py-1 pr-8 text-xs font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500'
            />
          </div>
        ) : (
          <span className={`text-sm font-semibold ${getStatusColor(order.status).split(' ')[0]}`}>
            {getStatusLabel(order.status)}
          </span>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div className='space-y-1'>
          <p className='font-semibold text-gray-700'>{t('recipient_info')}</p>
          <p>{t('recipient_name', { name: fullName })}</p>
          <p>{t('recipient_phone', { phone })}</p>
          <p>{t('recipient_address', { address })}</p>
          <p>{t('payment_method', { method: formatPaymentMethod(paymentMethod) })}</p>
        </div>

        <div className='space-y-2 border-l pl-4'>
          <p className='font-semibold text-gray-700'>{t('product_list', { count: items.length })}</p>
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.product_id ?? Math.random()} className='flex justify-between text-xs'>
                <span className='w-3/4 truncate'>{item.name ?? t('no_name')}</span>
                <span className='font-medium text-gray-800'>
                  {item.quantity ?? 0} x {formatCurrency(item.price ?? 0)}
                </span>
              </div>
            ))
          ) : (
            <p className='text-xs italic text-gray-400'>{t('no_items')}</p>
          )}
        </div>
      </div>

      <div className='mt-4 border-t pt-4 text-right'>
        <span className='text-xl font-extrabold text-purple-600'>
          {t('total_amount', { amount: formatCurrency(total) })}
        </span>
      </div>
    </div>
  )
}

export default OrderCard
