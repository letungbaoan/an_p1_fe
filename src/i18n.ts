import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to my app!',
        change_lang: 'Change language to Vietnamese'
      }
    },
    vi: {
      translation: {
        welcome: 'Chào mừng đến với ứng dụng của tôi!',
        change_lang: 'Đổi ngôn ngữ sang tiếng Anh'
      }
    }
  },
  lng: 'en', // ngôn ngữ mặc định
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
