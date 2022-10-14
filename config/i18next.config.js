/** Configuration Settings for i18next */

/* Available appLanguages
 * Each language is defined as an object per languageKey:
 * The Object MUST contain a name-property, which will be shown in the dropdown-menu
 * Optional Property "direction: 'rtl'" is used to mark right-to-left lanugages.
 */
const appLanguages = {
  'en-US': { name: 'English' },
  'de-DE': { name: 'Deutsch' },
  'ko-KR': { name: '한국어' },
  'ku':    { name: 'کوردی', direction: 'rtl' },
  'pl-PL': { name: 'Polski' },
}
const appLanguageKeys = Object.keys(appLanguages)

const usedNamespaces = [
  'about', 'common', 'dictionary', 'index', 'menu', 'resources', 'verify',
  'ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'ch08', 'ch09', 'ch10', 'ch11'
]

// defaultOptions for interpolation
const i18nDefaultOptions = {
  cde: '<code>',
  cde_e: '</code>',
  em: '<em>',
  em_e: '</em>',
  lnk_e: '</a>',
  str: '<strong>',
  str_e: '</strong>',

  // Simple Text, no HTML-Content
  dqm: '"', // double quotation mark
  gt: '>',
  lt: '<',
  smc: ';' // semicolon
}

const i18nextConfig = {
  // debug: true,

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
    loadPath: './resources/i18n/{/lng/}/{/ns/}.json',
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
exports.i18nDefaultOptions = i18nDefaultOptions
