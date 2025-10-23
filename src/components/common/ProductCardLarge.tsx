import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/product'
import ProductRating from '@/components/common/ProductRating'
import { addToCart, toggleWishlist, isInWishlist } from '@/utils/storage'
import toast from 'react-hot-toast'
import SafeImage from '@/components/common/SafeImage'
import { useTranslation } from 'react-i18next'

interface ProductCardLargeProps {
  product: Product
}

const ProductCardLarge: React.FC<ProductCardLargeProps> = ({ product }) => {
  const { t } = useTranslation(['product', 'toast'])
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(isInWishlist(product.id))
  }, [product.id])

  const discountPercentage = product.discountPercentage ?? 0
  const price = product.price ?? 0
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? 0
  const name = product.name ?? t('no_name')
  const description = product.description ?? t('no_description')
  const stockQuantity = product.stockQuantity ?? 0
  const imageUrls = Array.isArray(product.imageUrls) ? product.imageUrls : []

  const isDiscounted = discountPercentage > 0
  const originalPrice = isDiscounted ? price / (1 - discountPercentage / 100) : price
  const stockAvailable = stockQuantity

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(t('add_to_cart_success', { ns: 'toast' }))
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product)
    setLiked(!liked)
    toast.success(!liked ? t('wishlist_add_success', { ns: 'toast' }) : t('wishlist_remove_success', { ns: 'toast' }))
  }

  return (
    <div className='relative grid size-full grid-cols-2 gap-6 rounded-3xl border border-red-500 bg-white p-6 shadow-xl'>
      <div className='relative flex h-full items-center justify-center rounded-2xl bg-gray-50/50 p-4'>
        {isDiscounted && (
          <div className='absolute left-1 top-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>
            {discountPercentage}%
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className='absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md transition hover:scale-110'
        >
          <Heart size={20} className={liked ? 'text-red-500' : 'text-gray-400'} />
        </button>

        <SafeImage
          src={imageUrls.length > 0 ? imageUrls[0] : undefined}
          alt={name}
          className='max-h-full max-w-full rounded object-contain drop-shadow-lg'
        />
      </div>

      <div className='flex flex-col justify-between pt-2'>
        <div>
          <div className='mb-2 flex items-center space-x-2'>
            <ProductRating rating={rating} reviewCount={reviewCount} />
          </div>

          <Link
            to={`/products/${product.id}`}
            className='mb-2 text-xl font-bold text-gray-900 transition hover:text-purple-600'
          >
            {name}
          </Link>

          <div className='mb-4 flex items-end space-x-2'>
            <span className='text-3xl font-extrabold text-red-600'>${price.toFixed(2)}</span>
            {isDiscounted && <span className='text-xl text-gray-500 line-through'>${originalPrice.toFixed(2)}</span>}
          </div>

          <p className='mb-4 text-sm leading-relaxed text-gray-600'>{description}</p>
        </div>

        <div className='mt-auto'>
          <div className='mb-2'>
            <p className='text-sm text-gray-600'>{t('run_out_soon')}</p>
            <div className='relative mt-1 h-2 w-full rounded-full bg-yellow-100'>
              <div className='h-full rounded-full bg-gradient-to-r from-gradient-start to-gradient-end transition-all duration-500' />
            </div>
            <p className='mt-1 text-sm font-semibold text-gray-700'>{t('available_only', { count: stockAvailable })}</p>
          </div>

          <button
            onClick={handleAddToCartClick}
            className='flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 text-lg font-bold text-white transition hover:bg-green-700'
          >
            <ShoppingCart size={20} />
            <span>{t('add_to_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCardLarge
