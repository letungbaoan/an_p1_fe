import AutoSlidingTabPanel from '@/components/home/AutoSlidingPannel'
import CategorySection from '@/components/home/CategorySection'
import SafetyBannerSection from '@/components/home/SafetyBannerSection'
import NewProductSection from '@/components/home/NewProductSection'
import NewArrivalSection from '@/components/home/NewArrivalSection'
import FeturedProductsSection from '@/components/home/FeaturedProductsSection'
import DealsOfTheDaySection from '@/components/home/DealsOfTheDaySection'

export default function Home() {
  return (
    <div className='space-y-6'>
      <AutoSlidingTabPanel />

      <CategorySection />

      <SafetyBannerSection />

      <NewProductSection />

      <NewArrivalSection />

      <FeturedProductsSection />

      <DealsOfTheDaySection />
    </div>
  )
}
