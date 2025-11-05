import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchProductById, updateProduct, deleteProduct } from '@/redux/slices/productsSlice'
import type { RootState } from '@/redux/store'
import type { Product } from '@/types/product'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import InputField from '@/components/common/InputField'
import { format, toZonedTime, fromZonedTime } from 'date-fns-tz'
import { ADMIN_ROUTES } from '@/constants/routes'
import { useProductValidation } from '@/hooks/useProductValidation'

interface EditFormData {
  name: string
  price: string
  description: string
  stockQuantity: string
  discountPercentage: string
  dealEndTime: string
}

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

export default function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = id ? parseInt(id) : undefined
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(['admin', 'product', 'status'])

  const {
    currentProduct: product,
    loadingDetail,
    error,
    updating
  } = useAppSelector((state: RootState) => state.products)

  const [formData, setFormData] = useState<EditFormData | null>(null)

  const { errors: validationErrors, validate, setErrors: setValidationErrors } = useProductValidation(t)

  useEffect(() => {
    if (productId) dispatch(fetchProductById(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toFixed(2),
        description: product.description || '',
        stockQuantity: String(product.stockQuantity || 0),
        discountPercentage: String(product.discountPercentage || 0),
        dealEndTime: product.dealEndTime
          ? format(toZonedTime(product.dealEndTime, TIME_ZONE), "yyyy-MM-dd'T'HH:mm")
          : ''
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev))
    setValidationErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function action(formDataObj: FormData) {
    if (!product || updating) return

    const data = Object.fromEntries(formDataObj.entries()) as unknown as EditFormData
    const validation = validate(data)

    if (Object.keys(validation).length > 0) {
      toast.error(t('admin:validation_failed'))
      return
    }

    const payload: Partial<Product> = {
      name: data.name,
      price: Math.floor(parseFloat(data.price) * 100) / 100,
      description: data.description,
      stockQuantity: parseInt(data.stockQuantity),
      discountPercentage: parseInt(data.discountPercentage),
      dealEndTime: data.dealEndTime ? fromZonedTime(data.dealEndTime, TIME_ZONE).toISOString() : undefined
    }

    try {
      await dispatch(updateProduct({ id: product.id, data: payload })).unwrap()
      toast.success(t('admin:update_success'))
      navigate(ADMIN_ROUTES.PRODUCTS)
    } catch (err) {
      toast.error(String(err))
    }
  }

  async function handleDelete() {
    if (!productId) return
    const confirmed = window.confirm(t('admin:confirm_delete_product'))
    if (!confirmed) return

    try {
      await dispatch(deleteProduct(productId)).unwrap()
      toast.success(t('admin:delete_success'))
      navigate(ADMIN_ROUTES.PRODUCTS)
    } catch (err) {
      toast.error(String(err))
    }
  }

  if (!product && (loadingDetail === 'pending' || loadingDetail === 'idle'))
    return <div className='py-20 text-center'>{t('status:loading_products')}</div>

  if (error || !product || !formData)
    return <div className='py-20 text-center text-red-500'>{t('product:load_product_fail', { error })}</div>

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>{t('admin:edit_product', { name: product.name })}</h1>
        <div className='flex gap-3'>
          <button
            onClick={() => navigate(ADMIN_ROUTES.PRODUCTS)}
            className='rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100'
          >
            {t('admin:back_to_products')}
          </button>
          <button
            onClick={handleDelete}
            className='rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'
          >
            {t('admin:delete_product')}
          </button>
        </div>
      </div>

      <form action={action} className='grid grid-cols-1 gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-3'>
        <div className='space-y-5 md:col-span-2'>
          <InputField
            label={t('admin:product_name')}
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
            disabled={updating}
          />

          <div className='grid grid-cols-2 gap-4'>
            <InputField
              label={t('admin:price')}
              name='price'
              value={formData.price}
              onChange={handleChange}
              error={validationErrors.price}
              disabled={updating}
              placeholder='0.00'
            />
            <InputField
              label={t('admin:stock_quantity')}
              name='stockQuantity'
              type='number'
              value={formData.stockQuantity}
              onChange={handleChange}
              error={validationErrors.stockQuantity}
              disabled={updating}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <InputField
              label={t('admin:discount')}
              name='discountPercentage'
              type='number'
              value={formData.discountPercentage}
              onChange={handleChange}
              error={validationErrors.discountPercentage}
              disabled={updating}
            />
            <InputField
              label={t('admin:deal_end_time')}
              name='dealEndTime'
              type='datetime-local'
              value={formData.dealEndTime}
              onChange={handleChange}
              error={validationErrors.dealEndTime}
              disabled={updating}
            />
          </div>

          <InputField
            label={t('admin:description')}
            name='description'
            type='textarea'
            value={formData.description}
            onChange={handleChange}
            error={validationErrors.description}
            disabled={updating}
            rows={5}
          />

          <button
            type='submit'
            disabled={updating}
            className='rounded-md bg-purple-600 px-6 py-2 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50'
          >
            {updating ? t('admin:saving') : t('admin:save_changes')}
          </button>
        </div>

        <div className='space-y-4 md:col-span-1'>
          <h3 className='mb-4 border-b pb-2 text-xl font-bold'>{t('admin:images')}</h3>
          <div className='flex h-56 flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-4'>
            {product.imageUrls?.[0] ? (
              <img src={product.imageUrls[0]} alt={product.name} className='max-h-full object-contain' />
            ) : (
              <p className='text-gray-400'>{t('admin:no_image')}</p>
            )}
          </div>

          <h3 className='border-b pb-2 text-xl font-bold'>{t('admin:readonly_info')}</h3>
          <p className='text-sm text-gray-600'>
            {t('admin:product_id')}: {product.id}
          </p>
          <p className='text-sm text-gray-600'>
            {t('admin:product_rating')}: {product.rating}
          </p>
          <p className='text-sm text-gray-600'>
            {t('admin:review_count')}: {product.reviewCount}
          </p>
          <p className='text-sm text-gray-600'>
            {t('admin:category_id')}: {product.category_id}
          </p>
        </div>
      </form>
    </div>
  )
}
