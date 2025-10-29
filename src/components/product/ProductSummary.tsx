import React, { useState, useEffect } from 'react'
import { ShoppingCart, Share2, RefreshCw, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type Product } from '@/types/product'
import ProductRating from '@/components/common/ProductRating'
import DealTimer from '@/components/common/DealTimer'
import { addToCart, toggleWishlist, isInWishlist } from '@/utils/storage'
import toast from 'react-hot-toast'

interface ProductSummaryProps {
  product: Product
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  const { t } = useTranslation(['product', 'toast'])
  const [liked, setLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string>('')

  const { name, price, description, discountPercentage, rating, reviewCount, imageUrls, dealEndTime, stockQuantity } =
    product

  const isDiscounted = discountPercentage > 0
  const originalPrice = isDiscounted ? price / (1 - discountPercentage / 100) : price

  useEffect(() => {
    setLiked(isInWishlist(product.id))
    setSelectedImage(imageUrls[0])
  }, [product.id, imageUrls])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(t('add_to_cart_success', { ns: 'toast' }))
  }

  const handleWishlistToggle = () => {
    toggleWishlist(product)
    setLiked((prev) => !prev)
    toast.success(!liked ? t('wishlist_add_success', { ns: 'toast' }) : t('wishlist_remove_success', { ns: 'toast' }))
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    toast.success(t('add_to_cart_success', { ns: 'toast' }))
  }

  return (
    <div className='grid grid-cols-1 gap-8 rounded-xl bg-white p-6 shadow-lg lg:grid-cols-2'>
      <div className='relative'>
        <div className='flex h-96 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6'>
          {isDiscounted && (
            <span className='absolute left-4 top-4 rounded-md bg-red-600 px-3 py-1 text-sm font-bold text-white'>
              {discountPercentage}%
            </span>
          )}

          <img src={selectedImage} alt={name} className='max-h-full max-w-full object-contain transition-all' />
        </div>

        <div className='mt-4 flex space-x-3'>
          {imageUrls.slice(0, 3).map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(imgUrl)}
              className={`size-20 cursor-pointer rounded-lg border-2 p-1 transition ${
                selectedImage === imgUrl ? 'border-purple-600' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={imgUrl} alt={`${name} thumbnail ${index + 1}`} className='size-full rounded object-cover' />
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <h1 className='text-4xl font-extrabold text-gray-900'>{name}</h1>

        <div className='flex items-center space-x-4 border-b pb-4'>
          <ProductRating rating={rating} reviewCount={reviewCount} />
        </div>

        <div className='flex items-end space-x-3'>
          <span className='text-5xl font-extrabold text-red-600'>${price.toFixed(2)}</span>
          {isDiscounted && <span className='text-2xl text-gray-500 line-through'>${originalPrice.toFixed(2)}</span>}
        </div>

        <p className='text-base text-gray-700'>{description.substring(0, 150)}</p>

        <div className='border-y py-4'>
          <h3 className='mb-2 text-sm font-semibold'>{t('special_offer')}</h3>
          <DealTimer endTime={dealEndTime} />
        </div>

        <div className='flex items-center space-x-4'>
          <input
            type='number'
            value={quantity}
            min={1}
            max={stockQuantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className='w-16 rounded-md border border-gray-300 p-2 text-center'
          />

          <button
            onClick={handleAddToCart}
            className='flex items-center space-x-2 rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700'
          >
            <ShoppingCart size={18} />
            <span>{t('add_to_cart')}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className='rounded-md border border-purple-600 px-4 py-2 font-medium text-purple-600 transition hover:bg-purple-50'
          >
            {t('buy_now')}
          </button>
        </div>

        <div className='flex items-center space-x-6 pt-4 text-sm text-gray-500'>
          <div
            className='flex cursor-pointer items-center space-x-1 hover:text-purple-600'
            onClick={handleWishlistToggle}
          >
            <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
            <span>{t('add_to_wishlist')}</span>
          </div>

          <div className='flex cursor-pointer items-center space-x-1 hover:text-purple-600'>
            <Share2 size={16} /> <span>{t('share_product')}</span>
          </div>

          <div className='flex cursor-pointer items-center space-x-1 hover:text-purple-600'>
            <RefreshCw size={16} /> <span>{t('compare')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSummary
