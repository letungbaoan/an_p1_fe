export interface CheckoutItem {
  product: {
    id: number
    name: string
    price: number
    imageUrls: string[]
  }
  amount: number
}

export interface CheckoutFormState {
  fullName: string
  email: string
  phone: string
  address: string
  orderNotes: string
  [key: string]: string
}
