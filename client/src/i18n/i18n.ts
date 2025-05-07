import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Load translations via HTTP
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // Default language
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to load translations
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;