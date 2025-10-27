import InputField from '@/components/common/InputField'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/redux/hooks'
import { updateUser } from '@/redux/slices/authSlice'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { type RootState } from '@/redux/store'
import { ERROR_KEYS } from '@/constants/errorKeys'

type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export default function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const error = useSelector((state: RootState) => state.auth.error)
  const dispatch = useAppDispatch()
  const { t } = useTranslation('myAccount')

  const [errors, setErrors] = useState<Record<ErrorKey, string>>({} as Record<ErrorKey, string>)

  async function handleAction(formData: FormData) {
    if (loading === 'pending') return

    const username = formData.get('username')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString() || ''

    const newErrors: Record<ErrorKey, string> = {} as Record<ErrorKey, string>

    if (!username || username.length < 6) newErrors[ERROR_KEYS.USERNAME] = t('profileForm.error_username')
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors[ERROR_KEYS.EMAIL] = t('profileForm.error_email')
    if (password && password !== '********' && password.length < 6)
      newErrors[ERROR_KEYS.PASSWORD] = t('profileForm.error_password')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({} as Record<ErrorKey, string>)
    const updatedData: { username: string; email: string; password?: string } = { username, email }
    if (password && password !== '********') updatedData.password = password

    await dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => toast.success(t('profileForm.success')))
      .catch((error) => toast.error(t('profileForm.error', { error })))
  }

  return (
    <form action={handleAction} className='max-w-xl space-y-5'>
      <h2 className='mb-4 text-2xl font-bold'>{t('profileForm.title')}</h2>

      {error && <div className='rounded-md bg-red-100 p-3 font-medium text-red-700'>{error}</div>}
      {loading === 'pending' && <div className='text-blue-500'>{t('profileForm.updating')}</div>}

      <InputField
        label={t('profileForm.username')}
        name='username'
        defaultValue={user?.username || ''}
        error={errors[ERROR_KEYS.USERNAME]}
        disabled={loading === 'pending'}
      />

      <InputField
        label={t('profileForm.email')}
        name='email'
        type='email'
        defaultValue={user?.email || ''}
        error={errors[ERROR_KEYS.EMAIL]}
        disabled={loading === 'pending'}
      />

      <InputField
        label={t('profileForm.password')}
        name='password'
        type='password'
        placeholder='********'
        hint={t('profileForm.passwordHint')}
        error={errors[ERROR_KEYS.PASSWORD]}
        disabled={loading === 'pending'}
      />

      <div className='mt-4 flex'>
        <button
          type='submit'
          className='rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={loading === 'pending'}
        >
          {loading === 'pending' ? t('profileForm.saving') : t('profileForm.saveButton')}
        </button>
      </div>
    </form>
  )
}
