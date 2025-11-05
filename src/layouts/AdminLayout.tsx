import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Package, ShoppingBag, Users, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/slices/authSlice'
import { ADMIN_ROUTES, ROUTES } from '@/constants/routes'
import Logo from '@/components/Header/Logo'

const ADMIN_NAV_ITEMS = [
  { nameKey: 'admin.dashboard', icon: LayoutDashboard, path: ADMIN_ROUTES.HOME },
  { nameKey: 'admin.products', icon: Package, path: ADMIN_ROUTES.PRODUCTS },
  { nameKey: 'admin.orders', icon: ShoppingBag, path: ADMIN_ROUTES.ORDERS },
  { nameKey: 'admin.users', icon: Users, path: ADMIN_ROUTES.USERS }
]

const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation('admin')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <aside className={`sticky top-0 flex h-screen w-44 flex-col bg-purple-100 text-gray-800 shadow-xl`}>
        <div className='flex items-center justify-center border-b border-purple-200 py-5'>
          <Logo />
        </div>

        <nav className='grow space-y-1 overflow-y-auto p-3'>
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.nameKey}
              to={item.path}
              end={item.path === ADMIN_ROUTES.HOME}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg p-3 transition duration-150 ${
                  isActive ? 'bg-purple-600 font-semibold text-white' : 'text-gray-700 hover:bg-purple-200'
                }`
              }
            >
              <item.icon size={20} />
              <span>{t(item.nameKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className='space-y-2 border-t border-purple-200 p-4'>
          <button
            onClick={toggleLanguage}
            className='flex w-full items-center justify-center space-x-2 rounded-lg p-2 text-gray-700 transition hover:bg-purple-200'
          >
            <Globe size={18} />
            <span>{i18n.language === 'en' ? 'EN' : 'VI'}</span>
          </button>

          <button
            onClick={handleLogout}
            className='flex w-full items-center justify-center space-x-3 rounded-lg p-3 text-red-500 transition hover:bg-purple-200'
          >
            <LogOut size={20} />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      <main className='grow p-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
