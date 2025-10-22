import React from 'react'
import SectionHeader from '@/components/home/SectionHeader'
import NewProductList from '@/components/home/NewProductList'

const NewProductSection: React.FC = () => {
  return (
    <div>
      <SectionHeader
        titleKey='section_headers.new_products.title'
        subtitleKey='section_headers.new_products.subtitle'
      />
      <NewProductList />
    </div>
  )
}

export default NewProductSection
