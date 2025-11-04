import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchUsers, updateUserStatus } from '@/redux/slices/usersSlice'
import type { User } from '@/types/user'
import { Check, X } from 'lucide-react'
import { type RootState } from '@/redux/store'

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation('admin')
  const dispatch = useAppDispatch()
  const { list: users, loading, error } = useAppSelector((state: RootState) => state.users)

  useEffect(() => {
    if (loading === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, loading])

  const handleStatusToggle = (user: User) => {
    const newStatus = !user.active
    dispatch(updateUserStatus({ userId: user.id, isActive: newStatus }))
  }

  if (loading === 'pending' || loading === 'idle') {
    return <div className='py-10 text-center'>{t('loading_users')}</div>
  }

  if (error) {
    return (
      <div className='py-10 text-center text-red-500'>
        {t('error_load_users')}: {error}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-gray-800'>{t('users')}</h1>

      <div className='overflow-x-auto rounded-xl bg-white shadow-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>ID</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                {t('username')}
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                {t('email')}
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                {t('status')}
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'>
                {t('active_inactive_toggle')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>{user.id}</td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700'>{user.username}</td>
                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700'>{user.email}</td>
                <td className='whitespace-nowrap px-6 py-4 text-sm'>
                  {user.active ? (
                    <span className='flex items-center font-semibold text-green-600'>
                      <Check size={16} className='mr-1' /> {t('active')}
                    </span>
                  ) : (
                    <span className='flex items-center font-semibold text-red-500'>
                      <X size={16} className='mr-1' /> {t('inactive')}
                    </span>
                  )}
                </td>
                <td className='whitespace-nowrap px-6 py-4 text-center text-sm'>
                  <ToggleSwitch isActive={user.active} onToggle={() => handleStatusToggle(user)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsersPage

interface ToggleSwitchProps {
  isActive: boolean
  onToggle: () => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => (
  <div
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
      isActive ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block size-4 rounded-full bg-white transition-transform duration-200 ${
        isActive ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </div>
)
