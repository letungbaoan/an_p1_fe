import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api'
import { API_ENDPOINTS } from '@/constants/api'
import { handleApiError } from '@/utils/handleApiError'
import i18n from '@/i18n'

interface Review {
  id: number
  product_id: number
  userId: number
  username: string
  comment: string
  rating: number
  date: string
}

interface Order {
  id: number
  total: number
  date: string
  status: string
}

interface DashboardData {
  totalOrders: number
  totalSales: number
  totalUsers: number
  recentReviews: Review[]
  salesChartData: number[]
  chartLabels: number[]
}

interface DashboardState {
  data: DashboardData | null
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  loading: 'idle',
  error: null
}

export const fetchDashboardData = createAsyncThunk<DashboardData, void>(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [ordersResponse, usersResponse, reviewsResponse] = await Promise.all([
        api.get<Order[]>(API_ENDPOINTS.ORDERS, { params: { _sort: 'id', _order: 'desc' } }),
        api.get(API_ENDPOINTS.USERS, { params: { _limit: 0 }, headers: { 'X-Total-Count': true } }),
        api.get<Review[]>(API_ENDPOINTS.REVIEWS, { params: { _sort: 'date', _order: 'desc', _limit: 2 } })
      ])

      const orders = ordersResponse.data
      const totalOrders = orders.length
      const totalUsers = parseInt(usersResponse.headers['x-total-count'] || '0')

      const deliveredOrders = orders.filter((o) => o.status === 'delivered')
      const totalSales = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0)

      const now = new Date()
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        return { year: d.getFullYear(), month: d.getMonth() + 1 }
      })

      const salesByMonth: Record<string, number> = {}
      months.forEach(({ year, month }) => {
        salesByMonth[`${year}-${month}`] = 0
      })

      for (const order of deliveredOrders) {
        if (!order.date) continue
        const [day, month, year] = order.date.split('/').map(Number)
        const d = new Date(year, month - 1, day)

        const key = `${d.getFullYear()}-${d.getMonth() + 1}`
        if (salesByMonth[key] !== undefined) {
          salesByMonth[key] += order.total || 0
        }
      }

      const salesChartData = months.map(({ year, month }) => salesByMonth[`${year}-${month}`])
      const chartLabels = months.map(({ month }) => month)

      return {
        totalOrders,
        totalSales,
        totalUsers,
        recentReviews: reviewsResponse.data,
        salesChartData,
        chartLabels
      }
    } catch (err) {
      return rejectWithValue(handleApiError(err, i18n.t('dashboard:fetchFailed')))
    }
  }
)

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
        state.data = null
      })
  }
})

export default dashboardSlice.reducer
