import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
const logoImage = '/src/assets/logo.png'

const Logo = () => {
  return (
    <Link to={ROUTES.HOME} className='flex items-center space-x-1'>
      <img src={logoImage} alt='ShopStore Logo' className='rounded-full object-contain' />
    </Link>
  )
}

export default Logo
