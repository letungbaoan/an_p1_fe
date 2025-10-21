import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enHeader from './locales/en/header.json'
import enFooter from './locales/en/footer.json'
import viHeader from './locales/vi/header.json'
import viFooter from './locales/vi/footer.json'
import viNotfound from './locales/vi/notfound.json'
import enNotfound from './locales/en/notfound.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: enHeader,
      footer: enFooter,
      notfound: enNotfound
    },
    vi: {
      header: viHeader,
      footer: viFooter,
      notfound: viNotfound
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['header', 'footer', 'notfound'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
