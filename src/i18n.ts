import { initReactI18next } from 'react-i18next';

import i18n, { TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ru from './locales/ru.json';

const options = {
  order: ['localStorage', 'queryString', 'navigator'],
  lookupQuerystring: 'lng',
  lookupLocalStorage: 'i18nextLng',
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: options,
    resources: { ...en, ...ru },
    lng: window.localStorage.getItem('i18nextLng') || 'en',
    interpolation: {
      escapeValue: false,
      prefix: '__',
      suffix: '__',
    },
    supportedLngs: ['en', 'ru'],
  });

export const t: TFunction = i18n.t.bind(i18n);

export default i18n;
