import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { handleApiError } from '@/utils/handleApiError'
import i18n from '@/i18n'
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
      const res = await api.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}?_limit=6`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('product:fetchNewFailed')))
    }
  }
)

export const fetchFeaturedProducts = createAsyncThunk<Product[], FeaturedParams>(
  'products/fetchFeaturedProducts',
  async ({ limit, page }, { rejectWithValue }) => {
    try {
      const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS, {
        params: { _limit: limit, _page: page }
      })
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('product:fetchFeaturedFailed')))
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
        ...(categoryIds?.length ? { category_id: categoryIds } : {}),
        ...(minPrice ? { price_gte: minPrice } : {}),
        ...(maxPrice ? { price_lte: maxPrice } : {}),
        ...(minRating ? { rating_gte: minRating } : {})
      }

      const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS, { params })
      const totalCountHeader = res.headers['x-total-count']
      const totalCount = totalCountHeader ? parseInt(totalCountHeader) : res.data.length
      const totalPages = Math.ceil(totalCount / limit)

      return { products: res.data, totalPages }
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('product:fetchListFailed')))
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.newProducts = []
      state.featuredProducts = []
      state.listProducts = []
      state.totalPages = 1
      state.loadingNew = 'idle'
      state.loadingFeatured = 'idle'
      state.loadingList = 'idle'
      state.error = null
    }
  },
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
        state.newProducts = []
        state.error = action.payload as string
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
        state.featuredProducts = []
        state.error = action.payload as string
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
        state.error = action.payload as string
      })
  }
})

export const { clearProducts } = productsSlice.actions
export default productsSlice.reducer
