/*
 * Runs in: Node - Build Application
 * Some helper functions to be used in builds
 */

/**
 * Build locale menu
 * @return {string}
 */
function getLocaleMenu () {
  const { appLanguages } = require('../../config/i18next.config')
  let localeMenu = ''

  Object.entries(appLanguages).forEach(([languageKey, language]) => {
    localeMenu = localeMenu.concat('<option value="' + languageKey + '">' + language + '</option>')
  })
  return localeMenu
}

exports.getLocaleMenu = getLocaleMenu
