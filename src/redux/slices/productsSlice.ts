import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import axios from 'axios'
import type { Product } from '@/types/category'

interface ProductsState {
  newProducts: Product[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  newProducts: [],
  loading: 'idle',
  error: null
}

export const fetchNewProducts = createAsyncThunk<Product[], void>(
  'products/fetchNewProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?_limit=6`)
      return response.data
    } catch (error) {
      let errorMessage = 'Failed to fetch new products.'
      if (axios.isAxiosError(error)) {
        errorMessage = error.message
      }
      return rejectWithValue(errorMessage)
    }
  }
)

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewProducts.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.newProducts = action.payload
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || 'Could not load new products.'
        state.newProducts = []
      })
  }
})

export default productsSlice.reducer
