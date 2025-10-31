import { createBrowserRouter } from 'react-router-dom'

import UserLayout from '../layouts/UserLayout'
import Home from '../pages/Home'
import NotFound from '@/pages/NotFound'
import AuthPage from '@/pages/AuthPage'
import { ROUTES } from '@/constants/routes'
import PublicRoute from '@/router/PublicRoute'
import ContactPage from '@/pages/ContactPage'
import CartDetails from '@/pages/CartDetails'
import ProductsPage from '@/pages/ProductsPage'
import PrivateRoute from '@/router/PrivateRoute'
import MyAccountPage from '@/pages/user/MyAccountPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CheckoutPage from '@/pages/user/CheckoutPage'

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
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
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
        element: <PrivateRoute />,
        children: [
          {
            path: ROUTES.PROFILE,
            element: <MyAccountPage />
          },
          {
            path: ROUTES.CHECKOUT,
            element: <CheckoutPage />
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
