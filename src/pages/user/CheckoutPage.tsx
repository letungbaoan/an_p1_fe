import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getCheckoutItems } from '@/utils/storage'
import type { CheckoutItem, CheckoutFormState } from '@/types/checkout'
import BillingDetailsForm from '@/components/checkout/BillingDetailsForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentMethods from '@/components/checkout/PaymentMethods'
import PlaceOrderAction from '@/components/checkout/PlaceOrderAction'
import { API_ENDPOINTS } from '@/constants/api'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import { ROUTES } from '@/constants/routes'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/rootReducer'
import { useCheckoutValidation } from '@/hooks/useCheckoutValidation'
import { formatInTimeZone } from 'date-fns-tz'

export default function CheckoutPage() {
  const { t } = useTranslation(['checkout', 'common'])
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('direct_bank_transfer')
  const navigate = useNavigate()
  const { errors, validate } = useCheckoutValidation(t)

  const user = useAppSelector((state: RootState) => state.auth.user)
  const vietnamDate = formatInTimeZone(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy')

  useEffect(() => {
    const items = getCheckoutItems()
    if (!items || items.length === 0) {
      toast.error(t('no_items_in_cart'))
      navigate(ROUTES.CART)
    } else {
      setCheckoutItems(items)
    }
  }, [navigate, t])

  const { total } = useMemo(() => {
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.product.price * item.amount, 0)
    return { subtotal, total: subtotal }
  }, [checkoutItems])

  async function handleAction(formData: FormData) {
    const data: CheckoutFormState = {
      fullName: formData.get('fullName')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
      address: formData.get('address')?.toString().trim() || '',
      orderNotes: formData.get('orderNotes')?.toString().trim() || ''
    }

    const newErrors = validate(data)
    if (Object.keys(newErrors).length > 0) return

    if (checkoutItems.length === 0) {
      toast.error(t('no_items_in_cart'))
      navigate(ROUTES.CART)
      return
    }

    if (!user) {
      navigate(ROUTES.LOGIN)
      return
    }

    setIsSubmitting(true)

    const orderPayload = {
      id: Date.now(),
      user_id: user.id,
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phone,
      shipping_address: data.address,
      order_notes: data.orderNotes,
      items: checkoutItems.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        quantity: item.amount,
        price: item.product.price
      })),
      total,
      payment_method: paymentMethod,
      date: vietnamDate,
      status: 'pending'
    }

    try {
      await api.post(API_ENDPOINTS.ORDERS, orderPayload)
      toast.success(t('order_placed_successfully'))
      localStorage.removeItem('checkout_items')
      localStorage.removeItem('cart_items')
      window.dispatchEvent(new Event('cartUpdated'))
      setCheckoutItems([])
      navigate(ROUTES.HOME)
    } catch (error) {
      toast.error(t('checkout_failed', { error }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='bg-gray-50 py-10'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <form action={handleAction} className='grid grid-cols-1 gap-10 md:grid-cols-5'>
          <div className='rounded-xl bg-white p-6 shadow md:col-span-3'>
            <h2 className='mb-6 text-2xl font-bold'>{t('billing_details')}</h2>
            <BillingDetailsForm errors={errors} t={t} />
          </div>

          <div className='space-y-6 md:col-span-2'>
            <OrderSummary items={checkoutItems} total={total} t={t} />
            <PaymentMethods t={t} selectedMethod={paymentMethod} onChange={setPaymentMethod} />
            <PlaceOrderAction t={t} isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  )
}
