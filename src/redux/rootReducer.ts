import { combineReducers } from 'redux'
import categoryReducer from './slices/categorySlice'
import productsReducer from './slices/productsSlice'

const rootReducer = combineReducers({
  category: categoryReducer,
  products: productsReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
