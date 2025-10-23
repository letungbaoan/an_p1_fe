import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enHeader from './locales/en/header.json'
import enFooter from './locales/en/footer.json'
import viHeader from './locales/vi/header.json'
import viFooter from './locales/vi/footer.json'
import viHome from './locales/vi/home.json'
import enHome from './locales/en/home.json'
import viCategory from './locales/vi/category.json'
import enCategory from './locales/en/category.json'
import viCommon from './locales/vi/common.json'
import enCommon from './locales/en/common.json'
import viNotfound from './locales/vi/notfound.json'
import enNotfound from './locales/en/notfound.json'
import viStatus from './locales/vi/status.json'
import enStatus from './locales/en/status.json'
import viPromotion from './locales/vi/promotion.json'
import enPromotion from './locales/en/promotion.json'
import viProduct from './locales/vi/product.json'
import enProduct from './locales/en/product.json'
import viToast from './locales/vi/toast.json'
import enToast from './locales/en/toast.json'
import viAuth from './locales/vi/auth.json'
import enAuth from './locales/en/auth.json'
import viContact from './locales/vi/contact.json'
import enContact from './locales/en/contact.json'
import viCart from './locales/vi/cart.json'
import enCart from './locales/en/cart.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: enHeader,
      footer: enFooter,
      home: enHome,
      category: enCategory,
      common: enCommon,
      notfound: enNotfound,
      status: enStatus,
      promotion: enPromotion,
      product: enProduct,
      toast: enToast,
      auth: enAuth,
      contact: enContact,
      cart: enCart
    },
    vi: {
      header: viHeader,
      footer: viFooter,
      home: viHome,
      category: viCategory,
      common: viCommon,
      notfound: viNotfound,
      status: viStatus,
      promotion: viPromotion,
      product: viProduct,
      toast: viToast,
      auth: viAuth,
      contact: viContact,
      cart: viCart
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: [
    'header',
    'footer',
    'home',
    'category',
    'common',
    'notfound',
    'status',
    'promotion',
    'product',
    'toast',
    'auth',
    'contact',
    'cart'
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
