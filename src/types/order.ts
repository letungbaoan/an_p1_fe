export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  user_id: number
  date: string
  full_name: string
  email: string
  phone_number: string
  shipping_address: string
  order_notes: string
  items: OrderItem[]
  total: number
  payment_method: string
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
}
