export interface CategoryData {
  id: number
  image: string
  nameKey: string
  slug: string
  route: string
}

export interface Product {
  id: number
  name: string
  price: number
  description: string
  category_id: number
  stockQuantity: number
  discountPercentage: number
  rating: number
  imageUrls: string
  dealEndTime: string
  inStock: boolean
  onSale: boolean
  reviewCount: number
}
