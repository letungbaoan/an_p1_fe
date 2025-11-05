export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  WISHLIST: '/wishlist',
  LOGIN: '/auth',
  MY_ACCOUNT: '/my-account',
  ORDER_TRACKING: '/order-tracking',
  SHOP: '/shop',
  FRUITS: '/products?category_id=1',
  BEVERAGES: '/products?category_id=3',
  BLOG: '/blog',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PRODUCTS: '/products',
  PROFILE: '/profile',
  CART: '/cart',
  PRODUCT_DETAIL: '/products/:id',
  FORGOT_PASSWORD: '/forgot-password',
  CHECKOUT: '/checkout',
  PRODUCTS_BASE: '/products'
} as const

export const ADMIN_ROUTES = {
  HOME: '/admin/',
  ORDERS: '/admin/orders',
  ORDER_DETAIL: '/admin/orders/:id',
  PRODUCTS: '/admin/products',
  USERS: '/admin/users',
  PRODUCT_DETAIL: '/admin/products/:id',
  PRODUCTS_BASE: '/admin/products',
  ADD_PRODUCT: '/admin/products/new'
} as const
