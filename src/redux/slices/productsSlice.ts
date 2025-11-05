import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { handleApiError } from '@/utils/handleApiError'
import i18n from '@/i18n'
import type { Product } from '@/types/product'
import axios from 'axios'

export interface ProductFilters {
  page: number
  limit: number
  categoryIds?: number[]
  minPrice?: number
  maxPrice?: number
  minRating?: number
  nameQuery?: string
}

interface ProductQueryParams {
  _page: number
  _limit: number
  category_id?: number[]
  price_gte?: number
  price_lte?: number
  rating_gte?: number
  name_like?: string
}

export interface FeaturedParams {
  limit: number
  page: number
}

export interface UpdateProductPayload {
  id: number
  data: Partial<Product>
}

export interface AddProductPayload {
  id: string
  name: string
  price: number
  description: string
  category_id: number
  stockQuantity: number
  discountPercentage: number
  imageUrls: string[]
  dealEndTime: string | null
}

interface ProductsState {
  newProducts: Product[]
  featuredProducts: Product[]
  listProducts: Product[]
  currentProduct: Product | null
  totalPages: number
  loadingNew: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingFeatured: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingList: 'idle' | 'pending' | 'succeeded' | 'failed'
  loadingDetail: 'idle' | 'pending' | 'succeeded' | 'failed'
  updating: boolean
  adding: boolean
  error: string | null
}

const initialState: ProductsState = {
  newProducts: [],
  featuredProducts: [],
  listProducts: [],
  currentProduct: null,
  totalPages: 1,
  loadingNew: 'idle',
  loadingFeatured: 'idle',
  loadingList: 'idle',
  loadingDetail: 'idle',
  updating: false,
  adding: false,
  error: null
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) return error.message || fallback
  return fallback
}

export const fetchProductById = createAsyncThunk<Product, number>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${productId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch product details.'))
    }
  }
)

export const updateProduct = createAsyncThunk<Product, UpdateProductPayload>(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`, data)
      return res.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update product.'))
    }
  }
)

export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete product.'))
    }
  }
)

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
      const { page, limit, categoryIds, minPrice, maxPrice, minRating, nameQuery } = filters

      const params: ProductQueryParams = {
        _page: page,
        _limit: limit,
        ...(categoryIds?.length ? { category_id: categoryIds } : {}),
        ...(minPrice ? { price_gte: minPrice } : {}),
        ...(maxPrice ? { price_lte: maxPrice } : {}),
        ...(minRating ? { rating_gte: minRating } : {}),
        ...(nameQuery ? { name_like: nameQuery } : {})
      }

      const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCTS, { params })
      const totalCount = Number(res.headers['x-total-count']) || res.data.length
      const totalPages = Math.ceil(totalCount / limit)

      return { products: res.data, totalPages }
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('product:fetchListFailed')))
    }
  }
)

export const addProduct = createAsyncThunk<Product, AddProductPayload>(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const fullPayload = {
        ...productData,
        rating: 5,
        reviewCount: 0,
        inStock: productData.stockQuantity > 0,
        onSale: productData.discountPercentage > 0
      }

      const res = await api.post<Product>(API_ENDPOINTS.PRODUCTS, fullPayload)
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('product:addProductFailed')))
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
      .addCase(fetchNewProducts.pending, (s) => {
        s.loadingNew = 'pending'
        s.error = null
      })
      .addCase(fetchNewProducts.fulfilled, (s, a) => {
        s.loadingNew = 'succeeded'
        s.newProducts = a.payload
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loadingNew = 'failed'
        state.newProducts = []
        state.error = action.payload as string
      })

      .addCase(fetchFeaturedProducts.pending, (s) => {
        s.loadingFeatured = 'pending'
        s.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (s, a) => {
        s.loadingFeatured = 'succeeded'
        s.featuredProducts = a.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loadingFeatured = 'failed'
        state.featuredProducts = []
        state.error = action.payload as string
      })

      .addCase(fetchProductList.pending, (s) => {
        s.loadingList = 'pending'
        s.error = null
      })
      .addCase(fetchProductList.fulfilled, (s, a) => {
        s.loadingList = 'succeeded'
        s.listProducts = a.payload.products
        s.totalPages = a.payload.totalPages
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loadingList = 'failed'
        state.listProducts = []
        state.totalPages = 1
        state.error = action.payload as string
      })

      .addCase(fetchProductById.pending, (s) => {
        s.loadingDetail = 'pending'
        s.currentProduct = null
        s.error = null
      })
      .addCase(fetchProductById.fulfilled, (s, a) => {
        s.loadingDetail = 'succeeded'
        s.currentProduct = a.payload
      })
      .addCase(fetchProductById.rejected, (s, a) => {
        s.loadingDetail = 'failed'
        s.currentProduct = null
        s.error = a.payload as string
      })

      .addCase(updateProduct.pending, (s) => {
        s.updating = true
        s.error = null
      })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.updating = false
        s.currentProduct = a.payload
        s.listProducts = s.listProducts.map((p) => (p.id === a.payload.id ? a.payload : p))
      })
      .addCase(updateProduct.rejected, (s, a) => {
        s.updating = false
        s.error = a.payload as string
      })

      .addCase(deleteProduct.pending, (s) => {
        s.updating = true
        s.error = null
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.updating = false
        s.listProducts = s.listProducts.filter((p) => p.id !== a.payload)
        s.currentProduct = null
      })
      .addCase(deleteProduct.rejected, (s, a) => {
        s.updating = false
        s.error = a.payload as string
      })

      .addCase(addProduct.pending, (s) => {
        s.adding = true
        s.error = null
      })
      .addCase(addProduct.fulfilled, (s, a) => {
        s.adding = false
        s.listProducts.unshift(a.payload)
      })
      .addCase(addProduct.rejected, (s, a) => {
        s.adding = false
        s.error = a.payload as string
      })
  }
})

export const { clearProducts } = productsSlice.actions
export default productsSlice.reducer
