import React, { useState, useEffect } from 'react'
import MyBannerComponent from './Banner'
import { API_ENDPOINTS } from '@/constants/api'
import api from '@/utils/api'
import { useTranslation } from 'react-i18next'

interface BannerSlideData {
  id: number
  backgroundImageSrc: string
  tagKey: string
  titleKey: string
  descriptionKey: string
  buttonTextKey: string
  originalPrice: string
  discountPrice: string
}

const AutoSlidingTabPanel: React.FC = () => {
  const [bannerSlides, setBannerSlides] = useState<BannerSlideData[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const { t } = useTranslation('status')

  const intervalTime = 4000
  const transitionDuration = 'duration-300'

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setError('')
        const res = await api.get(API_ENDPOINTS.BANNERS)
        setBannerSlides(res.data || [])
      } catch (error) {
        setError(t('error_fetch_banners', { error: error }))
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [t])

  useEffect(() => {
    if (bannerSlides.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerSlides.length)
    }, intervalTime)

    return () => clearInterval(timer)
  }, [bannerSlides])

  const transformRatio = 100 / (bannerSlides.length || 1)
  const translateXValue = `-${currentIndex * transformRatio}%`

  return (
    <div className='relative mx-auto my-8 h-[500px] w-full max-w-7xl overflow-hidden rounded-lg shadow-xl'>
      {loading && <div className='flex h-full items-center justify-center text-gray-500'>{t('loading_banners')}</div>}

      {!loading && error && (
        <div className='flex h-full flex-col items-center justify-center text-red-500'>
          <p>{error}</p>
          <button
            className='mt-4 rounded bg-purple-700 px-4 py-2 text-white hover:bg-purple-800'
            onClick={() => window.location.reload()}
          >
            {t('common:retry')}
          </button>
        </div>
      )}

      {!loading && !error && bannerSlides.length > 0 && (
        <>
          <div
            className={`flex h-full transition-transform ease-in-out ${transitionDuration}`}
            style={{ width: `${bannerSlides.length * 100}%`, transform: `translateX(${translateXValue})` }}
          >
            {bannerSlides.map((slide) => (
              <div key={slide.id} className='h-full shrink-0' style={{ flexBasis: `${100 / bannerSlides.length}%` }}>
                <MyBannerComponent
                  tagKey={slide.tagKey}
                  titleKey={slide.titleKey}
                  descriptionKey={slide.descriptionKey}
                  buttonTextKey={slide.buttonTextKey}
                  originalPrice={slide.originalPrice}
                  discountPrice={slide.discountPrice}
                  backgroundImageSrc={slide.backgroundImageSrc}
                />
              </div>
            ))}
          </div>

          <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center justify-center space-x-2 rounded-full bg-white p-2 shadow-md'>
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                className={`size-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-purple-700' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && bannerSlides.length === 0 && (
        <div className='flex h-full items-center justify-center text-gray-500'>{t('no_banners')}</div>
      )}
    </div>
  )
}

export default AutoSlidingTabPanel
