import axios, { type AxiosInstance } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL
})

export default api
