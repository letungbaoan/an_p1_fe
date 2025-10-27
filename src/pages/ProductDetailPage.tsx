import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/utils/api'
import ProductSummary from '@/components/product/ProductSummary'
import ProductReviews, { type Review } from '@/components/product/ProductReviews'
import RelatedProductsSection from '@/components/product/RelatedProductsSection'
import { useTranslation } from 'react-i18next'
import type { Product } from '@/types/product'
import { API_ENDPOINTS } from '@/constants/api'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const productId = id ? parseInt(id) : undefined

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation('product')

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev])
    api.post(API_ENDPOINTS.REVIEWS, newReview)
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const res = await api.get<Product>(`/products/${productId}`)
        setProduct(res.data)

        const relatedRes = await api.get<Product[]>(`/products?category_id=${res.data.category_id}&_limit=7`)

        const filteredRelated = relatedRes.data.filter((p) => p.id !== res.data.id).slice(0, 6)
        setRelatedProducts(filteredRelated)

        const reviewsRes = await api.get(`/reviews?product_id=${productId}`)
        setReviews(reviewsRes.data)
      } catch (error) {
        setError(t('load_product_fail', { error }))
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchProductData()
  }, [productId, t])

  if (loading) {
    return <div className='py-20 text-center'>{t('loading_product')}</div>
  }

  if (error || !product) {
    return <div className='py-20 text-center text-red-500'>{t('load_product_fail', { error })}</div>
  }

  return (
    <div className='pb-16 pt-8'>
      <ProductSummary product={product} />

      <div className='mt-16'>
        <h2 className='mb-4 text-3xl font-bold'>{t('reviews_title')}</h2>
        <ProductReviews productId={product.id} reviews={reviews} onReviewSubmitted={handleAddReview} />
      </div>

      <RelatedProductsSection products={relatedProducts} />
    </div>
  )
}

export default ProductDetailPage
