import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchCategories } from '@/redux/slices/categorySlice'
import { addProduct, type AddProductPayload } from '@/redux/slices/productsSlice'
import type { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import InputField from '@/components/common/InputField'
import { fromZonedTime } from 'date-fns-tz'
import { ADMIN_ROUTES } from '@/constants/routes'
import { ArrowLeft } from 'lucide-react'
import { useProductValidation } from '@/hooks/useProductValidation'

const TIME_ZONE = 'Asia/Ho_Chi_Minh'
const INITIAL_IMAGE_URL = '/assets/item/item_1.png'

interface AddFormData {
  name: string
  price: string
  description: string
  category_id: string
  stockQuantity: string
  discountPercentage: string
  dealEndTime: string
  imageUrl: string
}

export default function ProductAddPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(['admin', 'product', 'category'])

  const { categories } = useAppSelector((state: RootState) => state.category)
  const isSubmitting = useAppSelector((state: RootState) => state.products.loadingDetail === 'pending')

  const [formData, setFormData] = useState<AddFormData>({
    name: '',
    price: '0.00',
    description: '',
    category_id: '',
    stockQuantity: '1',
    discountPercentage: '0',
    dealEndTime: '',
    imageUrl: INITIAL_IMAGE_URL
  })

  const { errors, validate, setErrors } = useProductValidation(t)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function action(formDataObj: FormData) {
    if (isSubmitting) return

    const data = Object.fromEntries(formDataObj.entries()) as unknown as AddFormData
    const isValid = validate(data)

    if (!isValid) {
      toast.error(t('admin:validation_failed'))
      return
    }
    const newId = Date.now().toString()

    const payload: AddProductPayload = {
      id: newId,
      name: data.name,
      price: Math.floor(parseFloat(data.price) * 100) / 100,
      description: data.description,
      category_id: parseInt(data.category_id),
      stockQuantity: parseInt(data.stockQuantity),
      discountPercentage: parseInt(data.discountPercentage),
      imageUrls: [data.imageUrl],
      dealEndTime: data.dealEndTime ? fromZonedTime(data.dealEndTime, TIME_ZONE).toISOString() : ''
    }

    try {
      await dispatch(addProduct(payload)).unwrap()
      toast.success(t('admin:add_success'))

      navigate(`${ADMIN_ROUTES.PRODUCTS}/${newId}`)
    } catch (err) {
      toast.error(String(err))
    }
  }

  return (
    <div className='space-y-8'>
      <button
        onClick={() => navigate(ADMIN_ROUTES.PRODUCTS)}
        className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-purple-600'
      >
        <ArrowLeft size={18} />
        {t('admin:back_to_products')}
      </button>

      <h1 className='text-3xl font-bold text-gray-800'>{t('admin:add_new_product')}</h1>

      <form action={action} className='grid grid-cols-1 gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-3'>
        <div className='space-y-5 md:col-span-2'>
          <h3 className='mb-4 border-b pb-2 text-xl font-bold'>{t('admin:basic_info')}</h3>

          <InputField
            label={t('admin:product_name')}
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            disabled={isSubmitting}
          />

          <FormSelect
            label={t('admin:category')}
            name='category_id'
            value={formData.category_id}
            onChange={handleChange}
            error={errors.category_id}
            disabled={isSubmitting}
            options={categories}
            t={t}
          />

          <div className='grid grid-cols-2 gap-4'>
            <InputField
              label={t('admin:price')}
              name='price'
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              disabled={isSubmitting}
              placeholder='0.00'
            />
            <InputField
              label={t('admin:stock_quantity')}
              name='stockQuantity'
              type='number'
              value={formData.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
              disabled={isSubmitting}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <InputField
              label={t('admin:discount')}
              name='discountPercentage'
              type='number'
              value={formData.discountPercentage}
              onChange={handleChange}
              error={errors.discountPercentage}
              disabled={isSubmitting}
            />
            <InputField
              label={t('admin:deal_end_time')}
              name='dealEndTime'
              type='datetime-local'
              value={formData.dealEndTime}
              onChange={handleChange}
              error={errors.dealEndTime}
              disabled={isSubmitting}
            />
          </div>
          <InputField
            label={t('admin:description')}
            name='description'
            type='textarea'
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            disabled={isSubmitting}
            rows={5}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-md bg-purple-600 px-6 py-2 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50'
          >
            {isSubmitting ? t('admin:saving') : t('admin:add_product_button')}
          </button>
        </div>

        <div className='space-y-4 md:col-span-1'>
          <h3 className='border-b pb-2 text-xl font-bold'>{t('admin:images')}</h3>
          <div className='flex h-56 flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-4'>
            <img src={formData.imageUrl} alt='Product Placeholder' className='max-h-full object-contain' />
            <input type='hidden' name='imageUrl' value={formData.imageUrl} />
          </div>
          <p className='text-sm text-gray-500'>{t('admin:image_upload_note')}</p>
        </div>
      </form>
    </div>
  )
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  disabled: boolean
  options: { id: number; nameKey: string }[]
  t: (key: string) => string
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, value, onChange, error, disabled, options, t }) => (
  <div>
    <label htmlFor={name} className='mb-1 block text-sm font-medium text-gray-700'>
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-md border p-3 focus:border-purple-500 focus:outline-none ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      required
    >
      <option value='' disabled>
        {t('admin:select_category')}
      </option>

      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {t(`category:${opt.nameKey}`)}
        </option>
      ))}
    </select>
    {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
  </div>
)
