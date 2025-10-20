import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enHeader from './locales/en/header.json'

import viHeader from './locales/vi/header.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: enHeader
    },
    vi: {
      header: viHeader
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['header'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
