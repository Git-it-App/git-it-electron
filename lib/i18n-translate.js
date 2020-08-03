
const i18n = require('electron').remote.getGlobal('i18n')

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

// Insert translated Content on Loading page.
document.addEventListener('DOMContentLoaded', function (event) {
  insertTranslations()
  setDropdownLanguage()
})

// Language change listener
const languageSelector = document.getElementById('lang-select')
languageSelector.addEventListener('change', function (event) {
  i18n.changeLanguage(languageSelector.value)
  insertTranslations()
})

// set Language on Dropdown-Element
function setDropdownLanguage() {
  const languageSelector = document.getElementById('lang-select')
  languageSelector.value = i18n.language
}

// Insert Translations into HTML
function insertTranslations () {
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
