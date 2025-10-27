import React from 'react'
import { type Product } from '@/types/product'
import VerticalProductCard from '@/components/common/VerticalProductCard'
import { useTranslation } from 'react-i18next'

interface RelatedProductsSectionProps {
  products: Product[]
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ products }) => {
  const { t } = useTranslation('product')

  if (products.length === 0) return null

  return (
    <div className='mt-20'>
      <h2 className='mb-6 text-3xl font-bold'>{t('related_products_title')}</h2>

      <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6'>
        {products.map((product) => (
          <VerticalProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProductsSection
