import { useTranslation } from 'react-i18next'

interface AuthNavigatorProps {
  isLogin: boolean
  setIsLogin: (value: boolean) => void
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ isLogin, setIsLogin }) => {
  const { t } = useTranslation('auth')

  return (
    <div className='mb-6 flex justify-center space-x-8 border-b pb-2'>
      <button
        onClick={() => setIsLogin(true)}
        className={`text-lg font-semibold ${isLogin ? 'text-black' : 'text-gray-400'}`}
      >
        {t('login')}
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`text-lg font-semibold ${!isLogin ? 'text-black' : 'text-gray-400'}`}
      >
        {t('register')}
      </button>
    </div>
  )
}

export default AuthNavigator
