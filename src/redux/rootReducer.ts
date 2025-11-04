import { combineReducers } from 'redux'
import categoryReducer from './slices/categorySlice'
import productsReducer from './slices/productsSlice'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import orderReducer from './slices/orderSlice'
import userReducer from './slices/usersSlice'

const rootReducer = combineReducers({
  category: categoryReducer,
  products: productsReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  order: orderReducer,
  users: userReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
