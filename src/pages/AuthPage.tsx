import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/redux/store'
import AuthNavigator from '@/components/auth/AuthNavigator'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { loginUser, registerUser } from '@/redux/slices/authSlice'
import type { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'
import type { User } from '@/types/user'
import { ADMIN_ROUTES, ROUTES } from '@/constants/routes'

export interface LoginFormData {
  usernameOrEmail: string
  password: string
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
}

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation('auth')
  const navigate = useNavigate()

  const { isLoggedIn, loading } = useSelector((state: RootState) => state.auth)

  const [isLogin, setIsLogin] = useState(true)

  const handleAuthSuccess = (user: User) => {
    toast.success(t('login_success'))
    if (user.role === 'admin') {
      navigate(ADMIN_ROUTES.HOME)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  const handleLogin = (data: LoginFormData) => {
    dispatch(loginUser(data))
      .unwrap()
      .then((user) => {
        handleAuthSuccess(user)
      })
      .catch((errorMsg) => {
        toast.error(errorMsg || t('login_failed'))
      })
  }

  const handleRegister = (data: RegisterFormData) => {
    dispatch(registerUser(data))
      .unwrap()
      .then((user) => {
        handleAuthSuccess(user)
      })
      .catch((errorMsg) => {
        toast.error(errorMsg || t('register_failed'))
      })
  }

  const isSubmitting = loading === 'pending'

  if (isLoggedIn) return null

  return (
    <div className='flex min-h-[500px] items-center justify-center'>
      <Toaster position='top-right' />
      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-xl'>
        <AuthNavigator isLogin={isLogin} setIsLogin={setIsLogin} />
        {isLogin ? (
          <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} />
        ) : (
          <RegisterForm onSubmit={handleRegister} isLoading={isSubmitting} />
        )}
      </div>
    </div>
  )
}

export default AuthPage
