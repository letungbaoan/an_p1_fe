import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { type CategoryData } from '@/types/category'
import { type RootState } from '../store'
import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api'

export interface CategoryState {
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  categories: CategoryData[]
  error: string | null
}

const initialState: CategoryState = {
  loading: 'idle',
  categories: [],
  error: null
}

const CATEGORIES_ENDPOINT = API_ENDPOINTS.CATEGORIES

export const fetchCategories = createAsyncThunk<CategoryData[], void, { state: RootState }>(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoryData[]>(CATEGORIES_ENDPOINT)
      return response.data
    } catch (error) {
      let errorMessage = 'Lỗi không xác định khi tải danh mục.'
      if (axios.isAxiosError(error) && error.message) {
        errorMessage = error.message
      }
      return rejectWithValue(errorMessage)
    }
  }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = 'pending'
      state.error = null
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = 'succeeded'
      state.categories = action.payload
    })
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = 'failed'
      state.categories = []
      state.error = (action.payload as string) || 'Tải dữ liệu thất bại.'
    })
  }
})

export default categorySlice.reducer
