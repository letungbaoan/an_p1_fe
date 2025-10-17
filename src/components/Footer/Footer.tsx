import FooterBottom from './FooterBottom'
import FooterMiddle from './FooterMiddle'
import FooterTop from './FooterTop'

const Footer = () => {
  return (
    <footer className='bg-gray-50 text-gray-700'>
      <FooterTop />
      <hr className='my-4 border-gray-200' />
      <FooterMiddle />
      <hr className='my-4 border-gray-200' />
      <FooterBottom />
    </footer>
  )
}

export default Footer
