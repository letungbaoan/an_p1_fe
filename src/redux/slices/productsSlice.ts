import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import axios from 'axios'
import type { Product } from '@/types/product'

export interface ProductFilters {
  page: number
  limit: number
  categoryIds?: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
}

interface ProductQueryParams {
  _page: number
  _limit: number
  category_id?: number[]
  price_gte?: number
  price_lte?: number
  rating_gte?: number
}

export interface FeaturedParams {
  limit: number
  page: number
}

interface ProductsState {
  newProducts: Product[]
  featuredProducts: Product[]
  listProducts: Product[]
  totalPages: number
  loadingNew: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingFeatured: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingList: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  newProducts: [],
  featuredProducts: [],
  listProducts: [],
  totalPages: 1,
  loadingNew: 'idle',
  loadingFeatured: 'idle',
  loadingList: 'idle',
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

export const fetchProductList = createAsyncThunk<{ products: Product[]; totalPages: number }, ProductFilters>(
  'products/fetchProductList',
  async (filters, { rejectWithValue }) => {
    try {
      const { page, limit, categoryIds, minPrice, maxPrice, minRating } = filters

      const params: ProductQueryParams = {
        _page: page,
        _limit: limit,
        ...(categoryIds && categoryIds.length > 0 && { category_id: categoryIds }),
        ...(minPrice && { price_gte: minPrice }),
        ...(maxPrice && { price_lte: maxPrice }),
        ...(minRating && { rating_gte: minRating })
      }

      const response = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS, {
        params
      })

      const totalCountHeader = response.headers['x-total-count']
      const totalCount = totalCountHeader ? parseInt(totalCountHeader) : response.data.length
      const totalPages = Math.ceil(totalCount / limit)

      return { products: response.data, totalPages }
    } catch (error) {
      let errorMessage = 'Failed to load product list.'
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

      .addCase(fetchProductList.pending, (state) => {
        state.loadingList = 'pending'
        state.error = null
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loadingList = 'succeeded'
        state.listProducts = action.payload.products
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loadingList = 'failed'
        state.listProducts = []
        state.totalPages = 1
        state.error = (action.payload as string) || 'Could not load product list.'
      })
  }
})

export default productsSlice.reducer
