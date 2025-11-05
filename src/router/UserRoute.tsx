import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import { ROUTES } from '@/constants/routes'

interface UserRouteProps {
  allowedRole?: 'user' | 'admin'
}

const UserRoute: React.FC<UserRouteProps> = ({ allowedRole = 'user' }) => {
  const { isLoggedIn, user } = useAppSelector((state: RootState) => state.auth)

  if (!isLoggedIn || !user || user.role !== allowedRole) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default UserRoute
