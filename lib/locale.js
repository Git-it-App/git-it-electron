var path = require('path')
const { appLanguages } = require('../config/i18next.config')

/**
 * available
 * All locale support in this app.
 * All available locale MUST have a folder with translated files in resources/contents.
 * @type {string[]}
 */
var available = {
  'en-US': 'English'
}

/**
 * aliases
 * Locale in aliases MUST point to a locale existed in available.
 * @type {string[]}
 */
var aliases = {
  en: 'en-US'
}

/**
 * fallback
 * Default locale.
 * @type {string}
 */
var fallback = 'en-US'

/**
 * Check the locale is supported or not.
 * @param lang
 * @returns {boolean}
 */
function isAvaliable (lang) {
  return !!(lang in available)
}

/**
 * Check the locale is aliased to another locale or not.
 * @param lang
 * @returns {boolean}
 */
function isAlias (lang) {
  return !!(lang in aliases)
}

/**
 * Get locale data from url
 * @return {string}
 */
function getCurrentLocale (passWindow) {
  if (!passWindow) passWindow = null
  var regex = /built\/([a-z]{2}-[A-Z]{2})\//
  var location = ''
  var lang = ''
  if (passWindow) {
    location = passWindow.webContents
    lang = location.getURL().match(regex)[1]
  } else {
    location = window.location
    lang = location.href.match(regex)[1]
  }
  return getLocale(lang)
}

/**
 * Get the locale which aliased to.
 * @param lang
 * @return {string}
 */
function getAliasLocale (lang) {
  return aliases[lang]
}

/**
 * Get locate which supported.(If not supported, return fallback)
 * @param lang
 * @return {string}
 */
function getLocale (lang) {
  if (isAvaliable(lang)) {
    return lang
  } else if (isAlias(lang)) {
    return getAliasLocale(lang)
  } else {
    return fallback
  }
}

/**
 * Get the path where the locale contents built.
 * @param lang
 * @return {string}
 */
function getLocaleBuiltPath (lang) {
  var basepath = path.normalize(path.join(__dirname, '..'))
  return path.join(basepath, 'built', getLocale(lang))
}

/**
 * Get the path where the locale resources.
 * @param lang
 * @return {string}
 */
function getLocaleResourcesPath (lang) {
  var basepath = path.normalize(path.join(__dirname, '..'))
  return path.join(basepath, 'resources', 'contents', getLocale(lang))
}

/**
 * Get fallback.
 * @type {string}
 */
function getFallbackLocale () {
  return fallback
}

/**
 * Get locale menu
 * @return {string}
 */
function getLocaleMenu (current) {
  let menu = ''
  Object.entries(appLanguages).forEach(([languageKey, language]) => {
    menu = menu.concat('<option value="' + languageKey + '">' + language + '</option>')
  })

  return menu
}

module.exports.getLocale = getLocale
module.exports.getLocaleBuiltPath = getLocaleBuiltPath
module.exports.getLocaleResourcesPath = getLocaleResourcesPath
module.exports.getCurrentLocale = getCurrentLocale
module.exports.getFallbackLocale = getFallbackLocale
module.exports.getLocaleMenu = getLocaleMenu
