import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import InputField from '@/components/common/InputField'
import { ERROR_KEYS } from '@/constants/errorKeys'

export interface Review {
  id: number
  product_id: number
  userId: number
  rating: number
  comment: string
  date: string
  username: string
}

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  onReviewSubmitted: (newReview: Review) => void
}

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews, onReviewSubmitted }) => {
  const { t } = useTranslation('product')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<ErrorKey, string>>({} as Record<ErrorKey, string>)

  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth)

  const validate = () => {
    const newErrors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (rating === 0) newErrors[ERROR_KEYS.RATING] = t('review_no_rating')
    if (comment.trim().length < 10) newErrors[ERROR_KEYS.COMMENT] = t('review_too_short')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAction() {
    if (!isLoggedIn || !user) {
      setErrors({
        [ERROR_KEYS.RATING]: t('login_required'),
        [ERROR_KEYS.COMMENT]: t('login_required')
      } as Record<ErrorKey, string>)
      return
    }

    if (!validate()) return

    const newReview: Review = {
      id: Date.now(),
      product_id: productId,
      userId: user.id,
      username: user.username,
      date: new Date().toISOString(),
      rating,
      comment: comment.trim()
    }

    onReviewSubmitted(newReview)
    toast.success(t('review_success'))
    setRating(0)
    setComment('')
    setErrors({} as Record<ErrorKey, string>)
  }

  return (
    <div className='mt-6 grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div className='rounded-xl bg-gray-50 p-6 shadow md:col-span-1'>
        <h3 className='mb-4 text-xl font-semibold'>{t('add_your_review')}</h3>

        <div className='mb-4'>
          <div className='flex space-x-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={`cursor-pointer transition ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          {errors[ERROR_KEYS.RATING] && <p className='mt-1 text-sm text-red-500'>{errors[ERROR_KEYS.RATING]}</p>}
        </div>

        <form action={handleAction} className='space-y-4'>
          <InputField
            label={t('write_comment_placeholder')}
            name='comment'
            type='textarea'
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setComment(e.target.value)}
            error={errors[ERROR_KEYS.COMMENT]}
            rows={4}
          />

          <button
            type='submit'
            className='flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
          >
            <Send size={18} />
            <span>{t('submit_review')}</span>
          </button>
        </form>
      </div>

      <div className='space-y-6 md:col-span-2'>
        {reviews.length === 0 ? (
          <p className='text-gray-500'>{t('no_reviews')}</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className='border-b pb-4'>
              <div className='flex items-center justify-between'>
                <p className='font-semibold'>{review.username}</p>
                <p className='text-sm text-gray-500'>{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className='my-1 flex space-x-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className='text-gray-700'>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductReviews
