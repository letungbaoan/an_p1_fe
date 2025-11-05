import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { type CategoryData } from '@/types/category'
import { type RootState } from '../store'
import { API_ENDPOINTS } from '@/constants/api'
import i18n from '@/i18n'
import { handleApiError } from '@/utils/handleApiError'

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
      const errorMessage = handleApiError(error, 'admin:loadCategoriesFailed')
      return rejectWithValue(errorMessage)
    }
  }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = 'failed'
        state.categories = []
        state.error = (action.payload as string) || i18n.t('errors.loadFailed', 'Tải dữ liệu thất bại.')
      })
  }
})

export default categorySlice.reducer
