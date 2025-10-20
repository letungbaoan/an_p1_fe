import AutoSlidingTabPanel from '@/components/home/AutoSlidingPannel'
import SectionHeader from '@/components/home/SectionHeader'
import CategorySection from '@/components/home/CategorySection'
import SafetyBannerSection from '@/components/home/SafetyBannerSection'
import NewProductSection from '@/components/home/NewProductSection'

export default function Home() {
  return (
    <div className='space-y-10'>
      <AutoSlidingTabPanel />

      <CategorySection />

      <SafetyBannerSection />

      <NewProductSection />

      <SectionHeader
        titleKey='section_headers.new_arrivals.title'
        subtitleKey='section_headers.new_arrivals.subtitle'
      />
      <SectionHeader
        titleKey='section_headers.featured_products.title'
        subtitleKey='section_headers.featured_products.subtitle'
      />
      <SectionHeader
        titleKey='section_headers.deals_of_the_day.title'
        subtitleKey='section_headers.deals_of_the_day.subtitle'
      />
    </div>
  )
}
