import React from 'react'
import ProductsPage from '@/pages/ProductsPage'
import { ADMIN_ROUTES } from '@/constants/routes'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('admin')

  const handleAddProduct = () => {
    navigate(ADMIN_ROUTES.ADD_PRODUCT)
  }

  const renderHeader = () => (
    <div className='mb-6 flex items-center justify-between'>
      <h1 className='text-3xl font-bold text-gray-800'>{t('products_management_title')}</h1>
      <button
        onClick={handleAddProduct}
        className='flex items-center space-x-2 rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700'
      >
        <Plus size={20} />
        <span>{t('add_product')}</span>
      </button>
    </div>
  )

  return (
    <div className='py-8'>
      {renderHeader()}

      <ProductsPage detailRoutePrefix={ADMIN_ROUTES.PRODUCTS_BASE} disableCart disableWishlist />
    </div>
  )
}

export default AdminProductsPage
