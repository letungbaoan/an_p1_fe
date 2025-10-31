import InputField from '@/components/common/InputField'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/redux/hooks'
import { updateUser } from '@/redux/slices/authSlice'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { type RootState } from '@/redux/store'
import { useProfileValidation } from '@/hooks/useProfileValidation'

export default function ProfileForm() {
  const user = useSelector((state: RootState) => state.auth.user)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const error = useSelector((state: RootState) => state.auth.error)
  const dispatch = useAppDispatch()
  const { t } = useTranslation('myAccount')

  const { errors, validate, setErrors } = useProfileValidation(t)

  async function handleAction(formData: FormData) {
    if (loading === 'pending') return

    const data = {
      username: formData.get('username')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      password: formData.get('password')?.toString() || ''
    }

    const newErrors = validate(data)
    if (Object.keys(newErrors).length > 0) return

    setErrors({})
    const updatedData: { username: string; email: string; password?: string } = {
      username: data.username,
      email: data.email
    }
    if (data.password && data.password !== '********') updatedData.password = data.password

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
        error={errors.username}
        disabled={loading === 'pending'}
      />

      <InputField
        label={t('profileForm.email')}
        name='email'
        type='email'
        defaultValue={user?.email || ''}
        error={errors.email}
        disabled={loading === 'pending'}
      />

      <InputField
        label={t('profileForm.password')}
        name='password'
        type='password'
        placeholder='********'
        hint={t('profileForm.passwordHint')}
        error={errors.password}
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
