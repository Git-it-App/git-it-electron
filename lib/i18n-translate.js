/*
 * Runs in: Renderer-Process
 *
 * Script to include in HTML-Pages
 * - Insert translated Content
 * - Set Language Dropdown
 * - Listen for Language Dropdown Change
 */

const i18n = require('electron').remote.getGlobal('i18n')
const { appLanguages } = require('../config/i18next.config')

// defaultOptions for interpolation
const defaultOptions = {
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

/*
 * Insert translated Content after loading page.
 */
document.addEventListener('DOMContentLoaded', () => {
  setDropdownLanguage()
  insertDataTranslations()
  insertTranslationStyles()
})

/*
 * Set Language change listener
 * When changeLanguage is done, the main process will reload the window therefore executing translation-insert from scratch.
 */
const languageSelector = document.getElementById('header__lang__select')
languageSelector.addEventListener('change', () => {
  i18n.changeLanguage(languageSelector.value)
})

/*
 * Select current Language in Dropdown-Element
 */
function setDropdownLanguage () {
  const languageSelector = document.getElementById('header__lang__select')
  languageSelector.value = i18n.language
}

/*
 * Insert Translations into HTML
 */
function insertDataTranslations () {
  const i18nElements = document.querySelectorAll('[i18n-data]')

  i18nElements.forEach(element => {
    const data = element.getAttribute('i18n-data')
    const type = element.getAttribute('i18n-type')
    const options = JSON.parse(element.getAttribute('i18n-options'))

    // If html only contains standard-elements, first interpret the options
    if (type === 'standard_html' && options !== null) {
      Object.entries(options).forEach(([key, value]) => {
        // Extend links
        if (key.startsWith('lnk_')) {
          options[key] = '<a href="' + value + '">'
        }
      })
    }

    if (type === 'html' || type === 'standard_html') {
      element.innerHTML = i18n.t(data, { ...defaultOptions, ...options })
    } else {
      element.innerText = i18n.t(data, { ...defaultOptions, ...options })
    }
  })
}

/*
 * Adding/Removing rtl-class if necessary.
 * Box Titles are done with CSS ::before, so the styles need to be inserted dynamically.
 *   Here always removing old styles and adding new ones into the specific Stylesheet (see challenges.hbs).
 */
function insertTranslationStyles () {
  const sheetTitle = 'jsTranslationStylesheet'
  const sheetIndex = [...document.styleSheets].findIndex(sheet => sheet.title === sheetTitle)

  // Insert Style for right-to-left languages
  if (appLanguages[i18n.language].direction === 'rtl') {
    document.getElementById('wrapper__content').classList.add('rtl')
  } else {
    document.getElementById('wrapper__content').classList.remove('rtl')
  }

  // Abort if stylesheet not found
  if (sheetIndex < 0) {
    return
  }
  // Delete old rules
  while (document.styleSheets[sheetIndex].rules.length > 0) {
    document.styleSheets[sheetIndex].deleteRule(0)
  }
  // Append rules for box-titles
  if (document.styleSheets[sheetIndex].ownerNode.id === 'challenge-translation-style') {
    document.styleSheets[sheetIndex].insertRule(".box--goal::before {content: '" + i18n.t('Goal') + "';}")
    document.styleSheets[sheetIndex].insertRule(".box--fail::before {content: '" + i18n.t("Didn't Pass?") + "';}")
    document.styleSheets[sheetIndex].insertRule(".box--tip::before {content: '" + i18n.t('Tip') + "';}")
    document.styleSheets[sheetIndex].insertRule(".box--step::before {content: '" + i18n.t('Step') + "';}")
  }
}
