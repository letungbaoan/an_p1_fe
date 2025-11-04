import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import { ADMIN_ROUTES } from '@/constants/routes'

const NonAdminRoute: React.FC = () => {
  const { isLoggedIn, user } = useAppSelector((state: RootState) => state.auth)

  if (isLoggedIn && user?.role === 'admin') {
    return <Navigate to={ADMIN_ROUTES.HOME} replace />
  }

  return <Outlet />
}

export default NonAdminRoute
