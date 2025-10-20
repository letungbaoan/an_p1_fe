import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/types/category'
import ProductRating from '@/components/common/ProductRating'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate()

  const discount = product.discountPercentage || 0
  const isDiscounted = discount > 0

  let originalPrice = product.price

  if (isDiscounted) {
    originalPrice = product.price / (1 - discount / 100)
  }

  const handleTitleClick = () => {
    navigate(`/products/${product.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className='group relative min-h-[200px] w-full overflow-hidden border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-md'>
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
          <Heart className='text-gray-400 hover:text-red-500' size={16} />
        </button>

        <img src={product.imageUrls[0]} alt={product.name} className='max-h-full max-w-full object-contain' />
      </div>

      <div className='p-2'>
        <ProductRating rating={product.rating} reviewCount={product.reviewCount} />

        <h3
          className='mb-1 line-clamp-1 cursor-pointer text-sm font-semibold text-gray-800 transition hover:text-purple-600'
          onClick={handleTitleClick}
        >
          {product.name}
        </h3>

        <div className='mt-2 flex items-center justify-between'>
          <div className='flex flex-row items-center space-x-2'>
            <span className='text-lg font-bold text-red-600'>${product.price.toFixed(2)}</span>{' '}
            {isDiscounted && <span className='text-base text-black line-through'>${originalPrice.toFixed(2)}</span>}
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
