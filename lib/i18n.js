const i18next = require('i18next')
const i18nextBackend = require('i18next-fs-backend')

// Available appLanguages
const appLanguages = ['en_US', 'de_DE']

const i18nextSettings = {
  lng: 'de_DE',
  debug: true,
  backend:{
    // path where resources get loaded from
    loadPath: './i18n/{{lng}}.json',
    // path to post missing resources
    addPath: './i18n/{{lng}}.json',
    // jsonIndent to use when storing json files
    jsonIndent: 2,
  },
  saveMissing: true,
  whitelist: appLanguages,
  fallbackLng: 'en_US',
}

// Init i18next with aboves Settings
function i18nInit() {
  global.i18n = i18next
  i18n
    .use(i18nextBackend)
    .init(i18nextSettings)
}


exports.i18nInit= i18nInit;
