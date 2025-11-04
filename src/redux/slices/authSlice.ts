/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/api'
import type { LoginFormData, RegisterFormData } from '@/pages/AuthPage'
import { API_ENDPOINTS } from '@/constants/api'
import type { User, UserData } from '@/types/user'
import i18n from '@/i18n'
import { handleApiError } from '@/utils/handleApiError'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

export interface UpdatePayload extends Partial<User> {
  password?: string
  username?: string
  email?: string
}

const savedUser = localStorage.getItem('user')
const savedLogin = localStorage.getItem('isLoggedIn')

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isLoggedIn: savedLogin === 'true',
  loading: 'idle',
  error: null
}

export const loginUser = createAsyncThunk<User, LoginFormData>(
  'auth/loginUser',
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const usernameResponse = await api.get<UserData[]>(`${API_ENDPOINTS.USERS}?username=${usernameOrEmail}`)
      let foundUser = usernameResponse.data[0]

      if (!foundUser) {
        const emailResponse = await api.get<UserData[]>(`${API_ENDPOINTS.USERS}?email=${usernameOrEmail}`)
        foundUser = emailResponse.data[0]
      }

      if (!foundUser) {
        return rejectWithValue(i18n.t('auth:userNotFound', 'Người dùng không tồn tại.'))
      }

      if (foundUser.active === false) {
        return rejectWithValue(i18n.t('auth:accountDeactivated', 'Tài khoản đã bị vô hiệu hóa.'))
      }

      if (foundUser.password !== password) {
        return rejectWithValue(i18n.t('auth:invalidCredentials', 'Thông tin đăng nhập không chính xác.'))
      }

      const { password: _, ...userToStore } = foundUser
      return userToStore as User
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'auth:loginFailed'))
    }
  }
)

export const registerUser = createAsyncThunk<User, RegisterFormData>(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const newUserPayload: UserData = {
        ...data,
        id: Date.now(),
        role: 'user',
        active: true
      }

      const response = await api.post<UserData>(API_ENDPOINTS.USERS, newUserPayload)
      const { password: _, ...userToStore } = response.data
      return userToStore as User
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'auth:registerFailed'))
    }
  }
)

export const updateUser = createAsyncThunk<User, UpdatePayload>(
  'auth/updateUser',
  async (updatedData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const currentUser = state.auth.user
      if (!currentUser) return rejectWithValue(i18n.t('auth:noUser', 'Không có người dùng đang đăng nhập.'))

      const payload: Partial<UserData> = {
        username: updatedData.username,
        email: updatedData.email,
        ...(updatedData.password && updatedData.password !== '********' && { password: updatedData.password })
      }

      const response = await api.patch<UserData>(`${API_ENDPOINTS.USERS}/${currentUser.id}`, payload)
      const { password: _, ...userToStore } = response.data
      return userToStore as User
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'auth:updateFailed'))
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isLoggedIn = false
      state.error = null
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    },
    clearAuthError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded'
        state.user = action.payload
        state.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(action.payload))
        localStorage.setItem('isLoggedIn', 'true')
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || i18n.t('auth:authFailed', 'Xác thực thất bại.')
        state.isLoggedIn = false
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded'
        state.user = action.payload
        state.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(action.payload))
        localStorage.setItem('isLoggedIn', 'true')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || i18n.t('auth:registerFailed', 'Đăng ký thất bại.')
        state.isLoggedIn = false
      })

      // update
      .addCase(updateUser.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded'
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || i18n.t('auth:updateFailed', 'Cập nhật thất bại.')
      })
  }
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
