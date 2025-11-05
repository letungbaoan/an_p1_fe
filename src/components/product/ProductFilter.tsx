import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { type ProductFilters as FilterType } from '@/redux/slices/productsSlice'
import { fetchCategories } from '@/redux/slices/categorySlice'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useSearchParams } from 'react-router-dom'

interface ProductFiltersProps {
  onApplyFilters: (filters: Omit<FilterType, 'limit' | 'page'>) => void
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onApplyFilters }) => {
  const { t } = useTranslation(['product', 'common', 'category'])
  const dispatch = useAppDispatch()
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.category)
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryIdParam = searchParams.get('category_id')
  const initialSelected = categoryIdParam ? [Number(categoryIdParam)] : []

  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialSelected)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [minRating, setMinRating] = useState<number>(0)

  useEffect(() => {
    if (categories.length === 0 && categoriesLoading === 'idle') {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length, categoriesLoading])

  useEffect(() => {
    const param = searchParams.get('category_id')
    setSelectedCategories(param ? [Number(param)] : [])
  }, [searchParams])

  const handleCategoryChange = (id: number, checked: boolean) => {
    const updated = checked ? [...selectedCategories, id] : selectedCategories.filter((c) => c !== id)
    setSelectedCategories(updated)

    const newParams = new URLSearchParams(searchParams)
    if (updated.length > 0) {
      newParams.set('category_id', updated[0].toString())
    } else {
      newParams.delete('category_id')
    }
    setSearchParams(newParams)
  }

  async function handleAction(formData: FormData) {
    const categoryIds = selectedCategories
    const minPrice = Number(formData.get('minPrice') ?? 0)
    const maxPrice = Number(formData.get('maxPrice') ?? 100)
    const minRatingValue = parseFloat(formData.get('minRating')?.toString() ?? '0')

    onApplyFilters({
      categoryIds,
      minPrice,
      maxPrice,
      minRating: minRatingValue
    })
  }

  return (
    <form action={handleAction} className='space-y-6 rounded-xl bg-white p-4 shadow'>
      <h2 className='border-b pb-2 text-xl font-bold text-gray-800'>{t('product:filters_title')}</h2>

      <div className='space-y-3'>
        <h3 className='font-semibold text-purple-600'>{t('product:category')}</h3>
        {categoriesLoading === 'pending' ? (
          <p className='text-sm text-gray-500'>{t('status:loading_categories')}</p>
        ) : (
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {categories.map((cat) => (
              <div key={cat.id} className='flex items-center'>
                <input
                  type='checkbox'
                  id={`cat-${cat.id}`}
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                  className='size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                />
                <label htmlFor={`cat-${cat.id}`} className='ml-2 text-sm text-gray-700'>
                  {t(`category:${cat.nameKey}`)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold text-purple-600'>{t('product:price_range')}</h3>
        <div className='px-1 pt-2'>
          <Slider
            range
            min={0}
            max={100}
            step={1}
            value={priceRange}
            onChange={(value) => setPriceRange(Array.isArray(value) ? (value as [number, number]) : [value, value])}
            trackStyle={[{ backgroundColor: '#8B5CF6' }]}
            handleStyle={[{ borderColor: '#8B5CF6' }]}
          />
        </div>

        <p className='text-sm text-gray-600'>
          {t('product:price_current', { min: priceRange[0], max: priceRange[1] })}
        </p>

        <input type='hidden' name='minPrice' value={priceRange[0]} />
        <input type='hidden' name='maxPrice' value={priceRange[1]} />
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold text-purple-600'>{t('product:min_rating')}</h3>
        <input
          type='number'
          name='minRating'
          min={0}
          max={5}
          step={0.5}
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className='w-full rounded-md border border-gray-300 p-2 text-sm focus:border-purple-500'
        />
      </div>

      <div className='flex space-x-2'>
        <button
          type='submit'
          className='flex-1 rounded-md bg-purple-600 py-2 font-medium text-white transition hover:bg-purple-700'
        >
          {t('product:apply_filters')}
        </button>

        <button
          type='button'
          onClick={() => {
            setSelectedCategories([])
            setPriceRange([0, 100])
            setMinRating(0)

            const newParams = new URLSearchParams(searchParams)
            newParams.delete('category_id')
            setSearchParams(newParams)

            onApplyFilters({ categoryIds: [], minPrice: 0, maxPrice: 100, minRating: 0 })
          }}
          className='flex-1 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 hover:bg-gray-50'
        >
          {t('product:clear_filters')}
        </button>
      </div>
    </form>
  )
}

export default ProductFilters
