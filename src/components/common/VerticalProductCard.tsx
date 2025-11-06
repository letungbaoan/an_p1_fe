import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Plus, Edit, Trash2 } from 'lucide-react'
import type { Product } from '@/types/product'
import ProductRating from '@/components/common/ProductRating'
import SafeImage from '@/components/common/SafeImage'
import { addToCart, toggleWishlist, isInWishlist } from '@/utils/storage'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ROUTES, ADMIN_ROUTES } from '@/constants/routes'
import { useAppDispatch } from '@/redux/hooks'
import { deleteProduct } from '@/redux/slices/productsSlice'
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter'

interface ProductCardProps {
  product: Product
  className?: string
  detailRoutePrefix?: string
  disableCart?: boolean
  disableWishlist?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  detailRoutePrefix = ROUTES.PRODUCTS_BASE,
  disableCart = false,
  disableWishlist = false
}) => {
  const { t } = useTranslation(['product', 'toast', 'admin'])
  const formatCurrency = useCurrencyFormatter()
  const [liked, setLiked] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setLiked(isInWishlist(product.id))
  }, [product.id])

  const discount = product.discountPercentage ?? 0
  const isDiscounted = discount > 0
  const price = product.price ?? 0
  const originalPrice = isDiscounted ? price / (1 - discount / 100) : price
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? 0
  const name = product.name ?? t('no_name')
  const productDetailLink = `${detailRoutePrefix}/${product.id}`

  const isEditingMode = detailRoutePrefix === ADMIN_ROUTES.PRODUCTS_BASE

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product)
    setLiked(!liked)
    toast.success(!liked ? t('wishlist_add_success', { ns: 'toast' }) : t('wishlist_remove_success', { ns: 'toast' }))
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(t('add_to_cart_success', { ns: 'toast' }))
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(`/admin/products/${product.id}`)
  }

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm(t('admin:confirm_delete_product', { name: product.name }))
    if (!confirmed) return

    try {
      await dispatch(deleteProduct(product.id)).unwrap()
      toast.success(t('admin:delete_success'))
    } catch (err) {
      toast.error(String(err) || t('admin:delete_fail', { ns: 'toast' }))
    }
  }

  return (
    <div
      className={`group relative min-h-[200px] w-full overflow-hidden border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md ${className}`}
    >
      {/* 1. KHU VỰC ẢNH VÀ NÚT ADD TO CART (Đã thay đổi) */}
      <div className='relative flex h-40 items-center justify-center bg-gray-50 p-2'>
        {isDiscounted && (
          <div className='absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>
            {discount}%
          </div>
        )}
        {!disableWishlist && (
          <button
            className='absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-md transition hover:scale-110'
            onClick={handleFavoriteClick}
          >
            <Heart className={`${liked ? 'text-red-500' : 'text-gray-400'}`} size={16} />
          </button>
        )}
        <SafeImage
          src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls[0] : undefined}
          alt={name}
          className='max-h-full max-w-full rounded object-contain'
        />

        {/* ⬅️ NÚT ADD TO CART ĐƯỢC CHUYỂN XUỐNG DƯỚI GÓC PHẢI CỦA ẢNH */}
        {!disableCart && (
          <button
            className='absolute bottom-2 right-2 z-10 rounded-full bg-purple-600 p-2 text-white shadow-lg transition hover:bg-purple-700'
            onClick={handleAddToCartClick}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* 2. Vùng Thông tin chính */}
      <div className='p-2'>
        <ProductRating rating={rating} reviewCount={reviewCount} />

        <Link
          to={productDetailLink}
          onClick={isEditingMode ? handleEditClick : undefined}
          className='mb-1 line-clamp-1 cursor-pointer text-sm font-semibold text-gray-800 transition hover:text-purple-600'
        >
          {name}
        </Link>

        {/* ⬅️ SỬA: CHỈNH SỬA KÍCH THƯỚC VÀ PHÂN CẤP GIÁ */}
        <div className='mt-2 flex items-end justify-between'>
          <div className='flex flex-row items-baseline space-x-2'>
            {/* Giá hiện tại (giữ nguyên size lớn) */}
            <span className='text-lg font-bold text-red-600'>{formatCurrency(price)}</span>

            {/* Giá gốc (giảm size thành text-sm) */}
            {isDiscounted && (
              <span className='text-sm text-gray-600 line-through'>{formatCurrency(originalPrice)}</span>
            )}
          </div>

          {/* ❌ XÓA NÚT ADD TO CART TRUYỀN THỐNG Ở ĐÂY */}
        </div>
      </div>

      {/* ADMIN ACTIONS */}
      {isEditingMode && (
        <div className='mt-auto flex items-center justify-around border-t p-2'>
          <button
            onClick={handleEditClick}
            className='flex items-center text-sm font-medium text-blue-500 hover:text-blue-700'
          >
            <Edit size={16} className='mr-1' /> {t('admin:edit')}
          </button>
          <button
            onClick={handleDeleteClick}
            className='flex items-center text-sm font-medium text-red-500 hover:text-red-700'
          >
            <Trash2 size={16} className='mr-1' /> {t('admin:delete')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCard
