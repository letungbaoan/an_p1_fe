/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/api'
import type { LoginFormData, RegisterFormData } from '@/pages/AuthPage'
import { API_ENDPOINTS } from '@/constants/api'
import type { User, UserData } from '@/types/user'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
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
        return rejectWithValue('User not found.')
      }

      if (foundUser.password !== password) {
        return rejectWithValue('Invalid credentials.')
      }

      const { password: _, ...userToStore } = foundUser
      return userToStore as User
    } catch (error) {
      const errorMessage = 'Login failed due to a network or server issue.'
      return rejectWithValue(errorMessage)
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
        role: 'user'
      }

      const response = await api.post<UserData>(API_ENDPOINTS.USERS, newUserPayload)

      const { password: _, ...userToStore } = response.data
      return userToStore as User
    } catch (error) {
      const errorMessage = 'Registration failed due to a network or server issue.'
      return rejectWithValue(errorMessage)
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

      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })

      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded'
        state.user = action.payload
        state.isLoggedIn = true

        // ✅ Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(action.payload))
        localStorage.setItem('isLoggedIn', 'true')
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || 'Authentication failed.'
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

        // ✅ Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(action.payload))
        localStorage.setItem('isLoggedIn', 'true')
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = (action.payload as string) || 'Registration failed.'
        state.isLoggedIn = false
      })
  }
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
