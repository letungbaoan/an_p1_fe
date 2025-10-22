import React from 'react'
import SectionHeader from '@/components/home/SectionHeader'
import CategoryList from '@/components/home/CategoryList'

const CategorySection: React.FC = () => {
  return (
    <div>
      <SectionHeader
        titleKey='section_headers.top_categories.title'
        subtitleKey='section_headers.top_categories.subtitle'
      />
      <CategoryList />
    </div>
  )
}

export default CategorySection
