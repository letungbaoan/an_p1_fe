import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { XCircle, ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchOrderById, updateOrderStatus } from '@/redux/slices/orderSlice'
import type { RootState } from '@/redux/store'
import OrderCard from '@/components/common/OrderCard'

const OrderDetail: React.FC = () => {
  const { t } = useTranslation('myAccount')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { selectedOrder: order, fetchDetailLoading, updateLoading, error } = useAppSelector((s: RootState) => s.order)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(Number(id)))
    }
  }, [id, dispatch])

  const handleStatusUpdate = async (newStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled') => {
    if (!order) return

    try {
      await dispatch(updateOrderStatus({ orderId: order.id, status: newStatus })).unwrap()
      toast.success(t('status_update_success'))
    } catch (error) {
      toast.error(t('status_update_failed', { error }))
    }
  }

  if (fetchDetailLoading === 'pending') {
    return <div className='p-8 text-center text-purple-600'>{t('loading_order_detail')}</div>
  }

  if (error) {
    return (
      <div className='flex flex-col items-center p-8 text-center text-red-500'>
        <XCircle size={32} className='mb-2' /> {error}
      </div>
    )
  }

  if (!order) {
    return <div className='p-8 text-center text-gray-500'>{t('order_not_found')}</div>
  }

  return (
    <div className='mx-auto max-w-3xl p-6'>
      <button
        onClick={() => navigate(-1)}
        className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-purple-600'
      >
        <ArrowLeft size={18} />
        {t('back_to_orders', 'Back to Orders')}
      </button>

      <h1 className='mb-6 text-2xl font-bold text-gray-800'>{t('order_detail_title', { id: order.id })}</h1>

      <OrderCard order={order} editableStatus onStatusChange={handleStatusUpdate} />

      {updateLoading === 'pending' && (
        <div className='mt-4 text-center text-sm text-gray-500'>{t('updating_status', 'Updating status...')}</div>
      )}
    </div>
  )
}

export default OrderDetail
