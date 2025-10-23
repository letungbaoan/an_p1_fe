import { createBrowserRouter } from 'react-router-dom'

import UserLayout from '../layouts/UserLayout'
import Home from '../pages/Home'
import NotFound from '@/pages/NotFound'
import AuthPage from '@/pages/AuthPage'
import { ROUTES } from '@/constants/routes'
import PublicRoute from '@/router/PublicRoute'
import ContactPage from '@/pages/ContactPage'
import CartDetails from '@/pages/CartDetails'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
      { path: ROUTES.CART, element: <CartDetails /> },
      {
        element: <PublicRoute />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <AuthPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])
