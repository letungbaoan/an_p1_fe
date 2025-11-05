import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProductSearchBarProps {
  currentQuery: string
  onSearch: (query: string) => void
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ currentQuery, onSearch }) => {
  const { t } = useTranslation('product')
  const [query, setQuery] = useState(currentQuery)

  async function handleAction(formData: FormData) {
    const q = formData.get('query')?.toString().trim() || ''
    onSearch(q)
  }

  return (
    <form
      action={handleAction}
      className='flex items-center space-x-2 rounded-lg border border-gray-200 bg-white p-2 shadow-md'
    >
      <input
        type='text'
        name='query'
        defaultValue={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        className='grow p-1 text-gray-700 focus:outline-none'
      />
      <button type='submit' className='text-purple-600 transition hover:text-purple-800'>
        <Search size={20} />
      </button>
    </form>
  )
}

export default ProductSearchBar
