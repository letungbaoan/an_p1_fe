import type { CheckoutItem } from '@/types/checkout'
import type { CartItem, Product } from '@/types/product'

const CART_KEY = 'cart_items'
const WISHLIST_KEY = 'wishlist_items'
const CHECKOUT_KEY = 'checkout_items'

const emitEvent = (name: string) => {
  window.dispatchEvent(new Event(name))
}

export const getCart = (): CartItem[] => {
  const data = localStorage.getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export const addToCart = (product: Product, quantity: number = 1) => {
  const cart = getCart()
  const index = cart.findIndex((item) => item.product.id === product.id)

  if (index >= 0) {
    cart[index].amount += quantity
  } else {
    cart.push({ product, amount: quantity })
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  emitEvent('cartUpdated')
}

export const removeFromCart = (productId: number) => {
  const updatedCart = getCart().filter((item) => item.product.id !== productId)
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart))
  emitEvent('cartUpdated')
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
  emitEvent('cartUpdated')
}

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

export const getCheckoutItems = (): CheckoutItem[] => {
  const data = localStorage.getItem(CHECKOUT_KEY)
  return data ? JSON.parse(data) : []
}

export const addCheckoutItems = (source: 'buy-now' | 'cart', data: Product | CheckoutItem[], quantity?: number) => {
  if (source === 'buy-now') {
    const product = data as Product
    const item: CartItem = {
      product,
      amount: quantity && quantity > 0 ? quantity : 1
    }
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify([item]))
  } else if (source === 'cart') {
    const cartItems = data as CheckoutItem[]
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(cartItems))
  }

  emitEvent('checkoutUpdated')
}

export const clearCheckout = () => {
  localStorage.removeItem(CHECKOUT_KEY)
  emitEvent('checkoutUpdated')
}
