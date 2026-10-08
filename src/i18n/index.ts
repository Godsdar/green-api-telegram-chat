/** i18n setup: ru (default) + en, remembers the choice in localStorage. */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { ru } from './ru';

const LANG_KEY = 'green-api-chat.lang';

const storedLang = (() => {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
})();

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: storedLang ?? 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const setLanguage = (lang: 'en' | 'ru') => {
  void i18n.changeLanguage(lang);
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
};

export default i18n;
