import { createBrowserRouter } from 'react-router-dom'

import UserLayout from '../layouts/UserLayout'
import Home from '../pages/user/Home'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },

      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])
