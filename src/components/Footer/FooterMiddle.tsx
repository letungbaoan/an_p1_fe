import FooterHelp from './FooterHelp'
import FooterMoney from './FooterMoney'
import FooterHelpYou from './FooterHelpYou'
import FooterKnowUs from './FooterKnowUs'
import FooterDownload from './FooterDownload'

const FooterMiddle = () => {
  return (
    <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-8 md:grid-cols-5 md:px-8'>
      <FooterHelp />
      <FooterMoney />
      <FooterHelpYou />
      <FooterKnowUs />
      <FooterDownload />
    </div>
  )
}

export default FooterMiddle
