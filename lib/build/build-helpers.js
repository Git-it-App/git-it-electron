/*
 * Runs in: Node - Build Application
 * Some helper functions to be used in builds
 */

// Just a small definition for a green checkmark
const checkmark = '\x1b[32m✔\x1b[0m'

/**
 * Build locale menu
 * @return {string}
 */
function getLocaleMenu () {
  const { appLanguages } = require('../../config/i18next.config')
  let localeMenu = ''

  Object.entries(appLanguages).forEach(([languageKey, languageObject]) => {
    localeMenu = localeMenu.concat('<option value="' + languageKey + '">' + languageObject.name + '</option>')
  })
  return localeMenu
}

exports.checkmark = checkmark
exports.getLocaleMenu = getLocaleMenu
