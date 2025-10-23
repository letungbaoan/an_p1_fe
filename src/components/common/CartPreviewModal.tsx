import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/constants/routes'
import type { CartItem } from '@/types/product'
import { X } from 'lucide-react'
import SafeImage from '@/components/common/SafeImage'

interface CartPreviewModalProps {
  cartItems?: CartItem[]
  onRemoveItem?: (productId: number) => void
}

const CartPreviewModal: React.FC<CartPreviewModalProps> = ({ cartItems = [], onRemoveItem }) => {
  const { t } = useTranslation('header')

  const total = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((sum, item) => {
      const price = item?.product?.price ?? 0
      const amount = item?.amount ?? 0
      return sum + price * amount
    }, 0)
  }, [cartItems])

  return (
    <div className='absolute right-0 top-full z-50 mt-2 w-[400px] rounded-xl border border-gray-100 bg-white shadow-2xl'>
      <div className='flex items-center justify-between border-b p-4'>
        <h3 className='text-lg font-bold text-gray-800'>
          {t('cart:title')} ({cartItems?.length ?? 0} {t('cart:items')})
        </h3>
      </div>

      <div className='max-h-60 space-y-3 overflow-y-auto p-4'>
        {!cartItems || cartItems.length === 0 ? (
          <p className='text-center text-gray-500'>{t('cart:empty_message')}</p>
        ) : (
          cartItems.map((item, index) => {
            const product = item?.product
            const imageSrc = product?.imageUrls?.[0] ?? ''
            const name = product?.name ?? t('cart:unknown_product')
            const price = product?.price ?? 0
            const amount = item?.amount ?? 0

            return (
              <div key={product?.id ?? index} className='flex items-center space-x-3'>
                <SafeImage src={imageSrc} alt={name} className='size-12 rounded object-contain' />
                <div className='grow'>
                  <p className='truncate text-sm font-medium text-gray-800'>{name}</p>
                  <p className='text-xs text-gray-500'>
                    {amount} x ${price.toFixed(2)}
                  </p>
                </div>
                <span className='text-sm font-bold text-purple-600'>${(price * amount).toFixed(2)}</span>

                {onRemoveItem && product?.id && (
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className='ml-2 text-gray-400 transition hover:text-red-500'
                    title={t('cart:remove_item') || 'Remove item'}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className='border-t p-4'>
        <div className='mb-3 flex justify-between font-bold'>
          <span className='text-base'>{t('cart:total')}</span>
          <span className='text-xl text-purple-600'>${total.toFixed(2)}</span>
        </div>
        <Link
          to={ROUTES.CART}
          className='block w-full rounded-lg bg-purple-600 py-2 text-center text-white transition hover:bg-purple-700'
        >
          {t('cart:view_cart')}
        </Link>
      </div>
    </div>
  )
}

export default CartPreviewModal
