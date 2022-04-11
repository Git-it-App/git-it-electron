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

  Object.entries(appLanguages).forEach(([languageKey, languageObject]) => {
    localeMenu = localeMenu.concat('<option value="' + languageKey + '">' + languageObject.name + '</option>')
  })
  return localeMenu
}

function getCspHashes(files) {
  const fs = require('fs')
  const { createHash } = require('crypto')
  const hashes = []

  files.forEach(file => {
    const createSha256 = createHash('sha256')
    console.debug(fs.readFileSync(file).toString())
    const hash = createSha256.update(fs.readFileSync(file).toString())
    hashes.push(hash.digest('base64'))
  });
  console.debug(hashes)
  return hashes.reduce((str, currentHash) => {
    return str.concat(" 'sha256-", currentHash, "'")
  }, '')
}

exports.getCspHashes = getCspHashes
exports.getLocaleMenu = getLocaleMenu
