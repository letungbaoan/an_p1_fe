import { useState, useEffect } from 'react'

const calculateTimeLeft = (endTime: string) => {
  const difference = +new Date(endTime) - +new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }
  return timeLeft as { days: number; hours: number; minutes: number; seconds: number }
}

export const useCountdown = (endTime: string) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endTime))
    }, 1000)

    return () => clearTimeout(timer)
  })

  return timeLeft
}
