import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchAllOrders, updateOrderStatus } from '@/redux/slices/orderSlice'
import { XCircle, Eye, ChevronDown } from 'lucide-react'
import type { RootState } from '@/redux/store'
import type { Order } from '@/types/order'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ADMIN_ROUTES } from '@/constants/routes'
import { format, parse } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter'

const OrderList: React.FC = () => {
  const { t, i18n } = useTranslation('admin')
  const formatCurrency = useCurrencyFormatter()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { list: orders, fetchListLoading, updateLoading, error } = useAppSelector((s: RootState) => s.order)
  const user = useAppSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    if (user?.role === 'admin') dispatch(fetchAllOrders())
  }, [dispatch, user])

  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    if (user?.role !== 'admin') return
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
  }

  const handleViewOrder = (orderId: number) => {
    navigate(`${ADMIN_ROUTES.ORDERS}/${orderId}`)
  }

  const locale = useMemo(() => {
    switch (i18n.language) {
      case 'vi':
        return vi
      default:
        return enUS
    }
  }, [i18n.language])

  const formatDate = useMemo(() => {
    return (dateStr: string) => {
      try {
        const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date())
        if (isNaN(parsedDate.getTime())) return dateStr
        return format(parsedDate, 'PPPP', { locale })
      } catch {
        return dateStr
      }
    }
  }, [locale])

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: 'pending', label: t('orderList.statusOptions.pending'), color: 'text-orange-500', bg: 'bg-orange-100' },
      { value: 'shipped', label: t('orderList.statusOptions.shipped'), color: 'text-blue-500', bg: 'bg-blue-100' },
      {
        value: 'delivered',
        label: t('orderList.statusOptions.delivered'),
        color: 'text-green-600',
        bg: 'bg-green-100'
      },
      { value: 'cancelled', label: t('orderList.statusOptions.cancelled'), color: 'text-red-500', bg: 'bg-red-100' }
    ],
    [t]
  )

  const getStatusStyle = useMemo(() => {
    return (status: Order['status']) => STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0]
  }, [STATUS_OPTIONS])

  if (fetchListLoading === 'pending') {
    return <div className='p-8 text-center text-purple-600'>{t('orderList.loading')}</div>
  }

  if (error) {
    return (
      <div className='flex flex-col items-center p-8 text-center text-red-500'>
        <XCircle size={32} className='mb-2' />
        {t('orderList.errorPrefix') + error}
      </div>
    )
  }

  if (!orders.length) {
    return <div className='p-8 text-center text-gray-500'>{t('orderList.noOrders')}</div>
  }

  return (
    <div className='space-y-6'>
      <h2 className='border-b pb-3 text-2xl font-bold text-gray-800'>{t('orderList.title')}</h2>

      <div className='hidden grid-cols-6 gap-4 border-b pb-2 text-sm font-semibold text-gray-600 md:grid'>
        <div className='col-span-1'>{t('orderList.id')}</div>
        <div className='col-span-1'>{t('orderList.orderDate')}</div>
        <div className='col-span-2'>{t('orderList.total')}</div>
        <div className='col-span-1'>{t('orderList.status')}</div>
        <div className='col-span-1 text-right'>{t('orderList.actions')}</div>
      </div>

      {orders.map((order) => {
        const currentStatus = getStatusStyle(order.status)

        return (
          <div
            key={order.id}
            className='grid grid-cols-6 items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md'
          >
            <div className='col-span-1 font-semibold text-gray-900'>#{order.id}</div>
            <div className='col-span-1 text-sm text-gray-600'>{formatDate(order.date)}</div>
            <div className='col-span-2 text-base font-bold text-purple-600'>
              {formatCurrency(order.total)} ({t('orderList.productsCount', { count: order.items.length })})
            </div>

            <div className='relative col-span-1'>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                disabled={
                  user?.role !== 'admin' ||
                  order.status === 'delivered' ||
                  order.status === 'cancelled' ||
                  updateLoading === 'pending'
                }
                className={`w-full appearance-none rounded-full border px-3 py-1 pr-8 text-xs font-semibold ${currentStatus.bg} ${currentStatus.color} ${
                  user?.role !== 'admin' ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${currentStatus.color}`}
              />
            </div>

            <div className='col-span-1 flex justify-end'>
              <button
                className='text-gray-500 hover:text-purple-600'
                title={t('orderList.view')}
                onClick={() => handleViewOrder(order.id)}
              >
                <Eye size={20} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderList
