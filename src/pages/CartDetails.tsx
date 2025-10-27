import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { getCart, removeFromCart } from '@/utils/storage'
import type { CartItem } from '@/types/product'
import { Trash2, Plus, Minus } from 'lucide-react'
import SafeImage from '@/components/common/SafeImage'

const CartDetails: React.FC = () => {
  const { t } = useTranslation('cart')
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const cart = getCart()
    setCartItems(Array.isArray(cart) ? cart : [])
  }, [])

  const total = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((sum, item) => {
      const price = item?.product?.price ?? 0
      const amount = item?.amount ?? 0
      return sum + price * amount
    }, 0)
  }, [cartItems])

  const updateCartStorage = (updated: CartItem[]) => {
    localStorage.setItem('cart_items', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const increaseQuantity = (productId?: number) => {
    if (!productId) return
    const updated = cartItems.map((item) => {
      if (item?.product?.id === productId) {
        const amount = (item.amount ?? 0) + 1
        return { ...item, amount }
      }
      return item
    })
    setCartItems(updated)
    updateCartStorage(updated)
  }

  const decreaseQuantity = (productId?: number) => {
    if (!productId) return
    const updated = cartItems
      .map((item) => {
        if (item?.product?.id === productId) {
          const newAmount = Math.max(1, (item.amount ?? 1) - 1)
          return { ...item, amount: newAmount }
        }
        return item
      })
      .filter((item) => (item?.amount ?? 0) > 0)

    setCartItems(updated)
    updateCartStorage(updated)
  }

  const handleRemove = (productId?: number) => {
    if (!productId) return
    removeFromCart(productId)
    setCartItems((prev) => prev.filter((item) => item?.product?.id !== productId))
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-12 text-center'>
        <h2 className='mb-4 text-2xl font-bold text-gray-800'>{t('empty_message')}</h2>
        <Link to={ROUTES.HOME} className='rounded-lg bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-700'>
          {t('continue_shopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-12'>
      <h1 className='mb-8 text-3xl font-bold text-gray-800'>{t('title') || 'Shopping Cart'}</h1>

      <div className='space-y-6'>
        {cartItems.map((item, index) => {
          const product = item?.product
          const productId = product?.id ?? index
          const name = product?.name ?? t('unknown_product')
          const price = product?.price ?? 0
          const amount = item?.amount ?? 1
          const imageSrc = product?.imageUrls?.[0] ?? ''

          return (
            <div key={productId} className='flex items-center justify-between rounded-lg border p-4 shadow-sm'>
              <div className='flex items-center space-x-4'>
                <SafeImage src={imageSrc} alt={name} className='size-16 rounded object-contain' />
                <div>
                  <h2 className='text-lg font-semibold text-gray-800'>{name}</h2>
                  <p className='text-sm text-gray-500'>${price.toFixed(2)}</p>
                </div>
              </div>

              <div className='flex items-center space-x-4'>
                <div className='flex items-center rounded-lg border'>
                  <button
                    onClick={() => decreaseQuantity(product?.id)}
                    className='px-2 py-1 text-gray-600 hover:text-purple-600'
                    disabled={!product?.id}
                  >
                    <Minus size={16} />
                  </button>
                  <span className='px-3 font-medium'>{amount}</span>
                  <button
                    onClick={() => increaseQuantity(product?.id)}
                    className='px-2 py-1 text-gray-600 hover:text-purple-600'
                    disabled={!product?.id}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className='w-20 text-right font-bold text-purple-600'>${(price * amount).toFixed(2)}</span>

                <button
                  onClick={() => handleRemove(product?.id)}
                  className='text-gray-400 transition hover:text-red-500'
                  disabled={!product?.id}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className='mt-8 flex items-center justify-between border-t pt-6'>
        <h2 className='text-xl font-bold text-gray-800'>{t('total')}:</h2>
        <span className='text-2xl font-bold text-purple-600'>${total.toFixed(2)}</span>
      </div>

      <div className='mt-6 text-right'>
        <button className='rounded-lg bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-700'>
          {t('checkout')}
        </button>
      </div>
    </div>
  )
}

export default CartDetails
