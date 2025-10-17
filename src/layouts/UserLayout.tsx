import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const UserLayout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='container mx-auto grow p-4'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
