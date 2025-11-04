import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { XCircle } from 'lucide-react'
import type { Order } from '@/types/order'
import OrderCard from '@/components/common/OrderCard'

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
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export default OrderHistoryTab
