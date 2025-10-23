import React, { useEffect, useState } from 'react'
import ProductRating from '@/components/common/ProductRating'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { useTranslation } from 'react-i18next'

interface Profile {
  name: string
  status: string
  rating: number
  reviewCount: number
  imageUrl: string
  description: string
}

const UserFeatureCard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation('common')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.USER_FEATURE)
        setProfile(res.data)
      } catch (err) {
        setError(t('error_loading_data', { error: err }))
      }
    }

    fetchProfile()
  }, [t])

  if (error)
    return <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600'>{error}</div>

  if (!profile)
    return (
      <div className='rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-gray-500'>{t('loading')}</div>
    )

  return (
    <div className='flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm'>
      <div className='mb-3 flex items-center'>
        <img src={profile.imageUrl} alt={profile.name} className='size-10 rounded-full' />
        <div className='ml-3'>
          <span className='block text-lg font-semibold text-gray-800'>{profile.name}</span>
          <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
            {profile.status}
            <ProductRating rating={profile.rating} reviewCount={profile.reviewCount} />
          </div>
        </div>
      </div>
      <p className='text-sm text-gray-600'>{profile.description}</p>
    </div>
  )
}

export default UserFeatureCard
