import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import hu from "../public/locales/hu/common.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
    //   en: { common: en },
      hu: { common: hu },
    },
    lng: 'hu', // default language
    fallbackLng: 'hu',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    defaultNS: 'common',
  });

export default i18n;