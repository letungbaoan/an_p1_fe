import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { handleApiError } from '@/utils/handleApiError'
import i18n from '@/i18n'
import type { User } from '@/types/user'

interface UsersState {
  list: User[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  list: [],
  loading: 'idle',
  error: null
}

export const fetchUsers = createAsyncThunk<User[], void>('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<User[]>(`${API_ENDPOINTS.USERS}`, {
      params: { role: 'user' }
    })
    return res.data
  } catch (err) {
    return rejectWithValue(handleApiError(err, i18n.t('admin:fetchUserListFailed')))
  }
})

export const updateUserStatus = createAsyncThunk<User, { userId: number; isActive: boolean }>(
  'users/updateUserStatus',
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const res = await api.patch<User>(`${API_ENDPOINTS.USERS}/${userId}`, {
        active: isActive
      })
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('admin:updateUserStatusFailed')))
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.list = []
      state.loading = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })

      .addCase(updateUserStatus.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        const index = state.list.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { clearUsers } = usersSlice.actions
export default usersSlice.reducer
