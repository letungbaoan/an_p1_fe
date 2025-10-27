import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/types/product'
import ProductRating from '@/components/common/ProductRating'
import SafeImage from '@/components/common/SafeImage'
import { addToCart, toggleWishlist, isInWishlist } from '@/utils/storage'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface ProductCardProps {
  product: Product
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { t } = useTranslation(['product', 'toast'])
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

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

  const handleTitleClick = () => {
    navigate(`/products/${product.id}`)
  }

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

  return (
    <div
      className={`group relative min-h-[200px] w-full overflow-hidden border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md ${className}`}
    >
      <div className='relative flex h-40 items-center justify-center bg-gray-50 p-2'>
        {isDiscounted && (
          <div className='absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>
            {discount}%
          </div>
        )}

        <button
          className='absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-md transition hover:scale-110'
          onClick={handleFavoriteClick}
        >
          <Heart className={`${liked ? 'text-red-500' : 'text-gray-400'}`} size={16} />
        </button>

        <SafeImage
          src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls[0] : undefined}
          alt={name}
          className='max-h-full max-w-full rounded object-contain'
        />
      </div>

      <div className='p-2'>
        <ProductRating rating={rating} reviewCount={reviewCount} />

        <h3
          className='mb-1 line-clamp-1 cursor-pointer text-sm font-semibold text-gray-800 transition hover:text-purple-600'
          onClick={handleTitleClick}
        >
          {name}
        </h3>

        <div className='mt-2 flex items-center justify-between'>
          <div className='flex flex-row items-center space-x-2'>
            <span className='text-lg font-bold text-red-600'>${price.toFixed(2)}</span>
            {isDiscounted && <span className='text-base text-gray-600 line-through'>${originalPrice.toFixed(2)}</span>}
          </div>

          <button
            className='rounded-lg bg-purple-600 p-2 text-white transition hover:bg-purple-700'
            onClick={handleAddToCartClick}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
