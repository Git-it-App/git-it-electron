
const i18n = require('electron').remote.getGlobal('i18n')

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

    if (type === 'html') {
      element.innerHTML = i18n.t(data, options)
    } else {
      element.innerText = i18n.t(data, options)
    }
  })
}