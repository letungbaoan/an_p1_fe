import { useCountdown } from '@/hooks/useCountdown'
import { useTranslation } from 'react-i18next'
import React from 'react'

interface DealTimerProps {
  endTime?: string | Date | null
}

const DealTimer: React.FC<DealTimerProps> = ({ endTime }) => {
  const { t } = useTranslation('product')

  const isValidDate = (value?: string | Date | null): boolean => {
    if (!value) return false
    const date = typeof value === 'string' ? new Date(value) : value
    return !isNaN(date.getTime())
  }

  const endIso = isValidDate(endTime)
    ? typeof endTime === 'string'
      ? new Date(endTime).toISOString()
      : endTime!.toISOString()
    : ''

  const countdown = useCountdown(endIso)
  const timerHasEnded = Object.values(countdown).every((value) => value === 0) || !isValidDate(endTime)

  const renderTimeComponent = (key: string, value: number) => (
    <div
      key={key}
      className='flex size-8 flex-col items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-800'
    >
      {String(value).padStart(2, '0')}
    </div>
  )

  if (!isValidDate(endTime)) {
    return <div className='mt-3 text-sm text-red-500'>{t('invalid_end_time') || 'Invalid end time'}</div>
  }

  const timerComponents = Object.keys(countdown)
    .map((unit) => {
      const value = countdown[unit as keyof typeof countdown]
      if (unit === 'days' && value === 0 && !timerHasEnded) return null
      if (timerHasEnded && value === 0) return null
      return renderTimeComponent(unit, value)
    })
    .filter(Boolean)

  return (
    <div className='mt-3 flex items-center space-x-2 text-sm text-gray-600'>
      {timerHasEnded ? (
        <span className='text-orange-700'>{t('offer_ended')}</span>
      ) : (
        <>
          {timerComponents}
          <span className='ml-2 text-xs'>{t('remain_until')}</span>
        </>
      )}
    </div>
  )
}

export default DealTimer
