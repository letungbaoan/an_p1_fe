import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthNavigator from '@/components/auth/AuthNavigator'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { loginUser, registerUser, clearAuthError } from '@/redux/slices/authSlice'
import type { RootState } from '@/redux/store'
import { useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'

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
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { isLoggedIn, loading, error } = useSelector((state: RootState) => state.auth)

  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    if (isLoggedIn) {
      toast.success(t('auth:login_success'))
      navigate('/')
    }

    if (error) {
      toast.error(error)
      dispatch(clearAuthError())
    }
  }, [isLoggedIn, error, navigate, dispatch, t])

  const handleLogin = (data: LoginFormData) => {
    dispatch(loginUser(data))
  }

  const handleRegister = (data: RegisterFormData) => {
    dispatch(registerUser(data))
  }

  const isSubmitting = loading === 'pending'

  return (
    <div className='flex min-h-[500px] items-center justify-center'>
      <Toaster position='top-right' />
      <div className='w-full max-w-md bg-white p-8'>
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
