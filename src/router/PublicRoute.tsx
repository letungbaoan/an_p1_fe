import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'

const PublicRoute: React.FC = () => {
  const isLoggedIn = useAppSelector((state: RootState) => state.auth.isLoggedIn)

  if (isLoggedIn) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default PublicRoute
