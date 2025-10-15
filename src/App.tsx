import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">{t('welcome')}</h1>
      <button
        onClick={toggleLanguage}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {t('change_lang')}
      </button>
    </div>
  )
}

export default App
