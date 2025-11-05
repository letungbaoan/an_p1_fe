import { createBrowserRouter } from 'react-router-dom'
import UserLayout from '../layouts/UserLayout'
import Home from '../pages/Home'
import NotFound from '@/pages/NotFound'
import AuthPage from '@/pages/AuthPage'
import { ADMIN_ROUTES, ROUTES } from '@/constants/routes'
import PublicRoute from '@/router/PublicRoute'
import ContactPage from '@/pages/ContactPage'
import CartDetails from '@/pages/CartDetails'
import ProductsPage from '@/pages/ProductsPage'
import UserRoute from '@/router/UserRoute'
import MyAccountPage from '@/pages/user/MyAccountPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CheckoutPage from '@/pages/user/CheckoutPage'
import AdminRoute from '@/router/AdminRoute'
import DashboardPage from '@/pages/admin/Dashboard'
import AdminLayout from '@/layouts/AdminLayout'
import NonAdminRoute from '@/router/NonAdminRoute'
import OrderList from '@/pages/admin/OrderList'
import OrderDetail from '@/pages/admin/OrderDetail'
import AdminUsersPage from '@/pages/admin/AdminUserPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminProductDetailPage from '@/pages/admin/AdminProductDetailPage'
import ProductAddPage from '@/pages/admin/ProductAddPage'

export const router = createBrowserRouter([
  {
    element: <NonAdminRoute />,
    children: [
      {
        path: '/',
        element: <UserLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: ROUTES.CONTACT, element: <ContactPage /> },
          { path: ROUTES.CART, element: <CartDetails /> },
          { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
          { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
          {
            element: <PublicRoute />,
            children: [{ path: ROUTES.LOGIN, element: <AuthPage /> }]
          },
          {
            element: <UserRoute />,
            children: [
              { path: ROUTES.PROFILE, element: <MyAccountPage /> },
              { path: ROUTES.CHECKOUT, element: <CheckoutPage /> }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: ADMIN_ROUTES.ORDERS, element: <OrderList /> },
          { path: ADMIN_ROUTES.ORDER_DETAIL, element: <OrderDetail /> },
          { path: ADMIN_ROUTES.USERS, element: <AdminUsersPage /> },
          { path: ADMIN_ROUTES.PRODUCTS, element: <AdminProductsPage /> },
          { path: ADMIN_ROUTES.PRODUCT_DETAIL, element: <AdminProductDetailPage /> },
          { path: ADMIN_ROUTES.ADD_PRODUCT, element: <ProductAddPage /> }
        ]
      }
    ]
  },
  { path: '*', element: <NotFound /> }
])
