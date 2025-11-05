export interface Product {
  id: number
  name: string
  price: number
  description: string
  category_id: number
  stockQuantity: number
  discountPercentage: number
  rating: number
  imageUrls: string[]
  dealEndTime: string
  reviewCount: number
}

export interface CartItem {
  product: Product
  amount: number
}
