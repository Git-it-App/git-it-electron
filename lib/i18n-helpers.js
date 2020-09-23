/*
 * Some helper functions to be used where necessary
 */

/**
 * Build locale menu
 * @return {string}
 */
const getLocaleMenu = function () {
  const { appLanguages } = require('../config/i18next.config')
  let localeMenu = ''

  Object.entries(appLanguages).forEach(([languageKey, language]) => {
    localeMenu = localeMenu.concat('<option value="' + languageKey + '">' + language + '</option>')
  })
  return localeMenu
}

exports.getLocaleMenu = getLocaleMenu
