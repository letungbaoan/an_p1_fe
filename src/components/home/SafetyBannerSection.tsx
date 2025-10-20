import React from 'react'
import safetyBannerImage from '../../assets/home/heath_banner.png'

const SafetyBannerSection: React.FC = () => {
  return (
    <div className='flex justify-center'>
      <img src={safetyBannerImage} alt='Health and Safety Banner' className='mt-2 w-full max-w-7xl rounded-xl' />
    </div>
  )
}

export default SafetyBannerSection
