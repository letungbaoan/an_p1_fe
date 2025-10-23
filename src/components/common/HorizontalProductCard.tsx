import React, { useState, useEffect } from 'react'
import { type Product } from '@/types/product'
import { Heart, Plus } from 'lucide-react'
import ProductRating from '@/components/common/ProductRating'
import DealTimer from '@/components/common/DealTimer'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SafeImage from '@/components/common/SafeImage'
import { addToCart, toggleWishlist, isInWishlist } from '@/utils/storage'
import toast from 'react-hot-toast'

interface HorizontalProductCardProps {
  product: Product
}

const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({ product }) => {
  const { t } = useTranslation(['product', 'toast'])
  const discountPercentage = product.discountPercentage || 0
  const price = product.price || 0
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? 0
  const name = product.name || t('no_name')
  const dealEndTime = product.dealEndTime ?? null
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(isInWishlist(product.id))
  }, [product.id])

  const isDiscounted = discountPercentage > 0
  const originalPrice = isDiscounted ? price / (1 - discountPercentage / 100) : price

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
    <div className='relative my-3 w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 transition duration-300 hover:shadow-lg'>
      <div className='flex w-full items-start'>
        <div className='relative flex w-1/4 shrink-0 items-center justify-center p-2'>
          {isDiscounted && (
            <div className='absolute left-1 top-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>
              {discountPercentage}%
            </div>
          )}

          <button
            onClick={handleFavoriteClick}
            className='absolute right-0 top-0 z-10 rounded-full bg-white p-1 shadow-md transition hover:scale-110'
          >
            <Heart size={16} className='text-gray-400 hover:text-red-500' />
          </button>

          <SafeImage
            src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls[0] : undefined}
            alt={name}
            className='max-h-full max-w-full rounded object-contain'
          />
        </div>

        <div className='ml-6 flex grow flex-col justify-between'>
          <div className='flex flex-col'>
            <Link
              to={`/products/${product.id}`}
              className='mb-1 text-xl font-semibold text-gray-800 hover:text-purple-600'
            >
              {name}
            </Link>

            <ProductRating rating={rating} reviewCount={reviewCount} />
          </div>

          <div className='mt-auto flex items-end justify-between'>
            <div className='flex flex-col'>
              <div className='mb-2 flex items-end space-x-3'>
                <span className='text-3xl font-extrabold text-red-600'>${price.toFixed(2)}</span>
                {isDiscounted && (
                  <span className='text-lg text-gray-600 line-through'>${originalPrice.toFixed(2)}</span>
                )}
              </div>

              <button
                className='flex items-center space-x-1 self-center rounded-xl bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700'
                onClick={handleAddToCartClick}
              >
                <span className='text-base font-semibold'>{t('add_to_cart')}</span>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {dealEndTime && <DealTimer endTime={dealEndTime} />}
    </div>
  )
}

export default HorizontalProductCard
