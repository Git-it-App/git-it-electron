/*
 * Runs in: Main-Process
 * Init i18next and store instance on global i18n variable
 */

const i18next = require('i18next')
const i18nextBackend = require('i18next-fs-backend')
const { i18nextConfig } = require('../config/i18next.config.js')

// Store and Init i18next
function i18nInit (buildMenuFunction, mainWindow) {
  global.i18n = i18next
  global.i18n
    .use(i18nextBackend)
    .init(i18nextConfig)

  global.i18n.on('languageChanged', () => {
    buildMenuFunction()
    mainWindow.reload()
  })
}

exports.i18nInit = i18nInit
