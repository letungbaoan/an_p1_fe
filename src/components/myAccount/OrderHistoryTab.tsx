import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { XCircle } from 'lucide-react'
import type { Order } from '@/types/order'

const OrderHistoryTab: React.FC = () => {
  const { t } = useTranslation('myAccount')
  const userId = useAppSelector((state: RootState) => state.auth.user?.id)

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError(t('error_login_required'))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS, {
          params: { user_id: userId, _sort: 'id', _order: 'desc' }
        })
        setOrders(response.data ?? [])
        setError(null)
      } catch (error) {
        setError(t('error_fetch_failed', { error }))
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId, t])

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

  if (loading) {
    return <div className='p-8 text-center text-purple-600'>{t('loading_orders')}</div>
  }

  if (error) {
    return (
      <div className='flex flex-col items-center p-8 text-center text-red-500'>
        <XCircle size={32} className='mb-2' /> {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return <div className='p-8 text-center text-gray-500'>{t('no_orders')}</div>
  }

  return (
    <div className='space-y-6'>
      {orders.map((order) => (
        <div key={order.id} className='rounded-lg border border-gray-200 p-6 transition hover:shadow-md'>
          <div className='mb-3 flex items-center justify-between border-b pb-3'>
            <div>
              <span className='block text-xl font-bold text-gray-800'>
                {t('order_number', { id: order.id ?? '-' })}
              </span>
              <span className='text-sm text-gray-500'>{t('order_date', { date: order.date ?? '-' })}</span>
            </div>

            <span className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='space-y-1'>
              <p className='font-semibold text-gray-700'>{t('recipient_info')}</p>
              <p>{t('recipient_name', { name: order.full_name ?? t('no_name') })}</p>
              <p>{t('recipient_phone', { phone: order.phone_number ?? t('no_phone') })}</p>
              <p>{t('recipient_address', { address: order.shipping_address ?? t('no_address') })}</p>
              <p>{t('payment_method', { method: formatPaymentMethod(order.payment_method) })}</p>
            </div>

            <div className='space-y-2 border-l pl-4'>
              <p className='font-semibold text-gray-700'>{t('product_list', { count: order.items?.length ?? 0 })}</p>
              {order.items?.map((item) => (
                <div key={item.product_id ?? Math.random()} className='flex justify-between text-xs'>
                  <span className='w-3/4 truncate'>{item.name ?? t('no_name')}</span>
                  <span className='font-medium text-gray-800'>
                    {item.quantity ?? 0} x ${(item.price ?? 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-4 border-t pt-4 text-right'>
            <span className='text-xl font-extrabold text-purple-600'>
              {t('total_amount', { amount: (order.total ?? 0).toFixed(2) })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderHistoryTab
