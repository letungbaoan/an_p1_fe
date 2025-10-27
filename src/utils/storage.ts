import type { Product } from '@/types/product'

const CART_KEY = 'cart_items'
const WISHLIST_KEY = 'wishlist_items'

const emitEvent = (name: string) => {
  window.dispatchEvent(new Event(name))
}

// --- CART ---
export const getCart = (): { product: Product; amount: number }[] => {
  const data = localStorage.getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export const addToCart = (product: Product) => {
  const cart = getCart()
  const index = cart.findIndex((item) => item.product.id === product.id)

  if (index >= 0) {
    cart[index].amount += 1
  } else {
    cart.push({ product, amount: 1 })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  emitEvent('cartUpdated')
}

export const removeFromCart = (productId: number) => {
  const cart = getCart().filter((item) => item.product.id !== productId)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  emitEvent('cartUpdated')
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
  emitEvent('cartUpdated')
}

// --- WISHLIST ---
export const getWishlist = (): Product[] => {
  const data = localStorage.getItem(WISHLIST_KEY)
  return data ? JSON.parse(data) : []
}

export const toggleWishlist = (product: Product) => {
  const wishlist = getWishlist()
  const index = wishlist.findIndex((item) => item.id === product.id)

  if (index >= 0) {
    wishlist.splice(index, 1)
  } else {
    wishlist.push(product)
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  emitEvent('wishlistUpdated')
}

export const isInWishlist = (productId: number): boolean => {
  const wishlist = getWishlist()
  return wishlist.some((item) => item.id === productId)
}
