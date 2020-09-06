/** Configuration Settings for i18next */

// Available appLanguages
const appLanguages = {
  'en-US': 'English',
  'de-DE': 'Deutsch',
  'ja-JP': '日本語',
  'zh-TW': '中文(臺灣)',
  'ko-KR': '한국어',
  'pt-BR': 'Português Brasileiro',
  'uk-UA': 'Українська',
  'es-CO': 'Español (Colombia)',
  'es-ES': 'Español (España)',
  'fr-FR': 'Français'
}
const appLanguageKeys = Object.keys(appLanguages)

const usedNamespaces = [
  'about', 'common', 'dictionary', 'index', 'menu', 'resources', 'verify',
  'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10', 'ch11'
]

const i18nextConfig = {
  debug: true,

  lng: 'en-US', // Startup Language
  fallbackLng: 'en-US',
  supportedLngs: appLanguageKeys,
  load: 'currentOnly', // not loading Languages 'en', 'de' etc. as they do not exist here.

  nsSeparator: '~',
  ns: usedNamespaces,
  defaultNS: 'common',

  initImmediate: false,
  backend: {
    // path where resources get loaded from
    loadPath: './i18n/{/lng/}/{/ns/}.json',
    // jsonIndent to use when storing json files
    jsonIndent: 2
  },
  interpolation: {
    prefix: '{/',
    suffix: '/}',
    escapeValue: false
  },
  saveMissing: false,
  keySeparator: false,
}

exports.i18nextConfig = i18nextConfig
exports.appLanguages = appLanguages
