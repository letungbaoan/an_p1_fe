import HeaderTop from './HeaderTop'
import HeaderMain from './HeaderMain'
import HeaderBottom from './HeaderBottom'

const Header = () => {
  return (
    <header className='w-full'>
      <HeaderTop />
      <hr className='hidden border-t border-gray-100 md:block' />
      <HeaderMain />
      <hr className='hidden border-t border-gray-100 md:block' />
      <HeaderBottom />
    </header>
  )
}

export default Header
