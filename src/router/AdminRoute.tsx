import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import { ROUTES } from '@/constants/routes'

interface AdminRouteProps {
  allowedRole?: 'user' | 'admin'
}

const AdminRoute: React.FC<AdminRouteProps> = ({ allowedRole = 'admin' }) => {
  const { isLoggedIn, user } = useAppSelector((state: RootState) => state.auth)

  if (!isLoggedIn || !user || user.role !== allowedRole) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default AdminRoute
