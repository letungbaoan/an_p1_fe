import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './router'
import store from './redux/store'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position='top-right' toastOptions={{ duration: 2000 }} />
    </Provider>
  )
}

export default App
