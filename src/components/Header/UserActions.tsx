import { useEffect, useState } from 'react'
import { User, Heart, ShoppingCart, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getCart, getWishlist, removeFromCart } from '@/utils/storage'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import type { RootState } from '@/redux/store'
import CartPreviewModal from '@/components/common/CartPreviewModal'
import type { CartItem } from '@/types/product'

const UserActions = () => {
  const { t } = useTranslation('header')
  const dispatch = useAppDispatch()
  const { isLoggedIn, user } = useAppSelector((state: RootState) => state.auth)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)

  const updateCounts = () => {
    const items = getCart()
    setCartItems(items)
    setWishlistCount(getWishlist().length)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  useEffect(() => {
    updateCounts()
    window.addEventListener('storage', updateCounts)
    window.addEventListener('cartUpdated', updateCounts)
    window.addEventListener('wishlistUpdated', updateCounts)

    return () => {
      window.removeEventListener('storage', updateCounts)
      window.removeEventListener('cartUpdated', updateCounts)
      window.removeEventListener('wishlistUpdated', updateCounts)
    }
  }, [])

  const renderUserLink = () => {
    if (isLoggedIn && user) {
      return (
        <div className='flex items-center space-x-2'>
          <Link to={ROUTES.PROFILE} className='flex cursor-pointer flex-col items-center hover:text-purple-600'>
            <User size={24} />
            <span className='text-sm font-medium'>{user.username}</span>
            <span className='text-xs font-bold leading-none text-purple-600'>{t('account')}</span>
          </Link>
          <button onClick={handleLogout} className='p-2 hover:text-red-500'>
            <LogOut size={18} />
          </button>
        </div>
      )
    }

    return (
      <Link to={ROUTES.LOGIN} className='flex cursor-pointer flex-col items-center hover:text-purple-600'>
        <User size={24} />
        <span className='text-sm font-medium'>{t('sign_in')}</span>
        <span className='text-sm font-bold leading-none'>{t('account')}</span>
      </Link>
    )
  }

  const cartCount = cartItems.length

  return (
    <div className='flex items-center space-x-6 text-gray-700'>
      {renderUserLink()}

      <a href='#' className='relative cursor-pointer hover:text-purple-600'>
        <Heart size={24} />
        {wishlistCount > 0 && (
          <span className='absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
            {wishlistCount}
          </span>
        )}
      </a>

      <div className='relative' onMouseEnter={() => setIsCartOpen(true)} onMouseLeave={() => setIsCartOpen(false)}>
        <Link to={ROUTES.CART} className='relative flex cursor-pointer items-center hover:text-purple-600'>
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className='absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
              {cartCount}
            </span>
          )}
        </Link>

        {isCartOpen && <div className='absolute inset-x-0 top-full h-3 bg-transparent'></div>}

        {isCartOpen && cartItems.length > 0 && (
          <CartPreviewModal
            cartItems={cartItems}
            onRemoveItem={(id) => {
              removeFromCart(id)
              setCartItems((prev) => prev.filter((item) => item.product.id !== id))
            }}
          />
        )}
        {isCartOpen && cartItems.length === 0 && (
          <div className='absolute right-0 top-full z-50 mt-2 w-64 rounded-xl bg-white p-4 text-center text-gray-500 shadow-2xl'>
            {t('cart:empty_message')}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserActions
