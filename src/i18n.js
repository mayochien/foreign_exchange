import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';

i18n
  // .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh-TW',
    resources: {
      'en': { translation: en },
      'zh-TW': { translation: zhTW },
      'zh-CN': { translation: zhCN }
    },
    // debug: true,
    interpolation: { escapeValue: false },
  }).then(t => {
    document.getElementsByTagName('html')[0].setAttribute('lang', i18n.language)
  })

  export default i18n;
