import React from 'react'
import { Star } from 'lucide-react'

interface ProductRatingProps {
  rating?: number
  reviewCount?: number
}

const ProductRating: React.FC<ProductRatingProps> = ({ rating = 0, reviewCount = 0 }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating)))
  const fullStars = Math.floor(safeRating)
  const decimalPart = safeRating - fullStars
  const totalStars = 5

  const emptyStars = totalStars - fullStars - (decimalPart > 0 ? 1 : 0)

  return (
    <div className='mb-1 flex items-center space-x-1'>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className='fill-yellow-400 text-yellow-400' size={12} />
      ))}

      {decimalPart > 0 && (
        <div key='partial' className='relative' style={{ width: 12, height: 12 }}>
          <Star className='absolute left-0 top-0 text-gray-300' size={12} />
          <div className='absolute left-0 top-0 overflow-hidden' style={{ width: `${decimalPart * 100}%` }}>
            <Star className='fill-yellow-400 text-yellow-400' size={12} />
          </div>
        </div>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className='text-gray-300' size={12} />
      ))}

      <span className='text-xs font-medium text-gray-500'>{reviewCount}</span>
    </div>
  )
}

export default ProductRating
