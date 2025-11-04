import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/redux/hooks'
import { clearAuthError } from '@/redux/slices/authSlice'

export default function useAuthErrorToast(error: string | null) {
  const dispatch = useAppDispatch()
  const prevError = useRef<string | null>(null)

  useEffect(() => {
    if (error && error !== prevError.current) {
      toast.error(error)
      prevError.current = error
      dispatch(clearAuthError())
    }
  }, [error, dispatch])
}
