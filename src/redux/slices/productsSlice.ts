import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import axios from 'axios'
import type { Product } from '@/types/product'

export interface FeaturedParams {
  limit: number
  page: number
}

interface ProductsState {
  newProducts: Product[]
  featuredProducts: Product[]
  loadingNew: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingFeatured: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  newProducts: [],
  featuredProducts: [],
  loadingNew: 'idle',
  loadingFeatured: 'idle',
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

export const fetchFeaturedProducts = createAsyncThunk<Product[], FeaturedParams>(
  'products/fetchFeaturedProducts',
  async ({ limit, page }, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}`, {
        params: {
          _limit: limit,
          _page: page
        }
      })
      return response.data
    } catch (error) {
      let errorMessage = 'Failed to fetch featured products.'
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
        state.loadingNew = 'pending'
        state.error = null
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loadingNew = 'succeeded'
        state.newProducts = action.payload
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loadingNew = 'failed'
        state.error = (action.payload as string) || 'Could not load new products.'
        state.newProducts = []
      })

      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loadingFeatured = 'pending'
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loadingFeatured = 'succeeded'
        state.featuredProducts = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loadingFeatured = 'failed'
        state.error = (action.payload as string) || 'Could not load featured products.'
        state.featuredProducts = []
      })
  }
})

export default productsSlice.reducer
