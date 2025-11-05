import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { handleApiError } from '@/utils/handleApiError'
import type { Order } from '@/types/order'

interface OrdersState {
  list: Order[]
  selectedOrder: Order | null
  fetchListLoading: 'idle' | 'pending' | 'succeeded' | 'failed'
  fetchDetailLoading: 'idle' | 'pending' | 'succeeded' | 'failed'
  updateLoading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: OrdersState = {
  list: [],
  selectedOrder: null,
  fetchListLoading: 'idle',
  fetchDetailLoading: 'idle',
  updateLoading: 'idle',
  error: null
}

export const fetchOrdersByUserId = createAsyncThunk<Order[], number>(
  'orders/fetchOrdersByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get<Order[]>(`${API_ENDPOINTS.ORDERS}?userId=${userId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, 'admin:fetchFailed'))
    }
  }
)

export const fetchAllOrders = createAsyncThunk<Order[]>('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<Order[]>(`${API_ENDPOINTS.ORDERS}?_sort=id&_order=desc`)
    return res.data
  } catch (err) {
    return rejectWithValue(handleApiError(err, 'admin:fetchAllFailed'))
  }
})

export const fetchOrderById = createAsyncThunk<Order, number>(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`)
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, 'admin:fetchDetailFailed'))
    }
  }
)

export const updateOrderStatus = createAsyncThunk<Order, { orderId: number; status: Order['status'] }>(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch<Order>(`${API_ENDPOINTS.ORDERS}/${orderId}`, { status })
      return res.data
    } catch (err) {
      return rejectWithValue(handleApiError(err, 'admin:updateFailed'))
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.list = []
      state.selectedOrder = null
      state.fetchListLoading = 'idle'
      state.fetchDetailLoading = 'idle'
      state.updateLoading = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.fetchListLoading = 'pending'
        state.error = null
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.fetchListLoading = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.fetchListLoading = 'failed'
        state.error = action.payload as string
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.fetchListLoading = 'pending'
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.fetchListLoading = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.fetchListLoading = 'failed'
        state.error = action.payload as string
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.fetchDetailLoading = 'pending'
        state.selectedOrder = null
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.fetchDetailLoading = 'succeeded'
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.fetchDetailLoading = 'failed'
        state.selectedOrder = null
        state.error = action.payload as string
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updateLoading = 'pending'
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = 'succeeded'
        const index = state.list.findIndex((o) => o.id === action.payload.id)
        if (index !== -1) state.list[index] = action.payload
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateLoading = 'failed'
        state.error = action.payload as string
      })
  }
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
