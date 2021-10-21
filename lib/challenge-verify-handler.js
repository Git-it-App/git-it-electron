/*
 * Runs in: Renderer-Process
 * To handle everything connected to the verification on challenges
 */
const path = require('path')
const ipc = require('electron').ipcRenderer
const i18n = require('electron').remote.getGlobal('i18n')
const userData = require(path.normalize(path.join(__dirname, 'user-data.js')))
const sidebarHandler = require(path.normalize(path.join(__dirname, 'challenge-sidebar-handler.js')))

const currentChallenge = document.head.querySelector('meta[name="currentChallenge"]').getAttribute('content')
const verifyButton = document.getElementById('btn-verify-challenge')
const clearStatusButton = document.getElementById('btn-clear-challenge')
const verifyList = document.getElementById('verify-list')
const verifySpinner = document.getElementById('verify-spinner')
const verifyChallengeScript = require('../lib/verify/' + currentChallenge + '.js')

// Only on challenges with directory
const selectDirButton = document.getElementById('btn-select-directory')
const pathRequiredWarning = document.getElementById('path-required-warning')
const selectedDirPath = document.getElementById('path-selected-dir')
const selectedDirDiv = document.getElementById('div-selected-dir')

/*
 * Execute after DOM loaded.
 * Register Button-Handlers
 */
document.addEventListener('DOMContentLoaded', async () => {
  verifyButton.addEventListener('click', () => {
    handleVerifyClick()
  })
  clearStatusButton.addEventListener('click', () => {
    clearChallengeStatus()
  })
  // Only if Button exists
  if (selectDirButton) {
    selectDirButton.addEventListener('click', () => {
      ipc.send('dialog-selectDir')
    })
  }

  // Only if button exists.
  // Before enableVerifyButtons, due to checked selectedDirPath there.
  if (selectDirButton) {
    const savedDir = await userData.getSavedDir(currentChallenge)

    if (!savedDir) {
      showSelectedDirDiv(false)
    } else {
      selectedDirPath.innerText = savedDir
      showSelectedDirDiv(true)
    }
  }

  const challengeUserData = await userData.getChallengeData(currentChallenge)
  if (challengeUserData.challengeComplete) {
    enableVerifyButtons(false)
    enableClearStatusButton(true)
  } else {
    enableVerifyButtons(true)
    enableClearStatusButton(false)
  }

  // Print-out stored list
  if (challengeUserData.verifyList.length > 0) {
    printOutVerifyList(challengeUserData.verifyList)
  }
})

/*
 * Listen for confirmed selectDir dialog
 */
ipc.on('confirm-selectDir', (event, path) => {
  selectedDirPath.innerText = path
  showSelectedDirDiv(true)
  enableVerifyButtons(true)
  userData.updateSavedDir(currentChallenge, path)
})

/*
 * Handling Click-event on verify-button
 */
async function handleVerifyClick () {
  // If challenge with directory, but no path is selected
  // Should normally not happen, as it is prevented already.
  if (selectDirButton && !selectedDirPath?.innerText.length) {
    console.error('No path selected!')
    showSelectedDirDiv(false)
    // Buttons generally still enabled, but check verify-button against empty path again.
    enableVerifyButtons(true)
    return
  }

  showSpinner(true)
  enableVerifyButtons(false)

  // In js it is possible to call with more parameters, than defined, not all challenges need the path-parameter
  const result = await verifyChallengeScript(selectedDirPath?.innerText)

  await clearVerifyList()
  printOutVerifyList(result.verifyList)

  if (result.challengeComplete) {
    enableClearStatusButton(true)
    sidebarHandler.showChallengeComplete(currentChallenge, true)
  } else {
    enableVerifyButtons(true)
  }

  showSpinner(false)
  userData.storeChallengeResult(currentChallenge, result.challengeComplete, result.verifyList)
}

/*
 * Clear the Challenge-Status
 * Called on Button-Click
 */
async function clearChallengeStatus () {
  enableVerifyButtons(true)
  enableClearStatusButton(false)
  showSpinner(false)

  clearVerifyList()
  showVerifyList(false)
  sidebarHandler.showChallengeComplete(currentChallenge, false)
  userData.clearChallengeResult(currentChallenge, false)
}

/*
 * Write out the list to the DOM
 */
async function printOutVerifyList (list) {
  showVerifyList(true)
  list.forEach(listItem => {
    const li = document.createElement('li')

    li.appendChild(document.createTextNode(
      i18n.t(listItem.message, listItem.data)
    ))
    if (listItem.pass) {
      li.classList.add('verify__list__elem--pass')
    } else {
      li.classList.add('verify__list__elem--fail')
    }

    verifyList.appendChild(li)
  })
}

/*
 * Small helper for readable code
 */
async function clearVerifyList () {
  verifyList.innerHTML = ''
}

/*
 * clearStatusButton gets shown or not on enabled
 */
async function enableClearStatusButton (enabled) {
  if (enabled) {
    clearStatusButton.style.display = 'block'
  } else {
    clearStatusButton.style.display = 'none'
  }
}

/*
 * VerifyButtons get disabled or not.
 * This includes the verify-button, as well as the select-dir button if available.
 */
async function enableVerifyButtons (enabled) {
  verifyButton.disabled = !enabled

  if (selectDirButton) {
    // Don't enable verifyButton, if no folder selected
    if (selectedDirPath.innerText === '') {
      verifyButton.disabled = true
    }
    selectDirButton.disabled = !enabled
  }
}

/*
 * Either show selectedDirDiv or show PathRequiredWarning
 * If selectedDir is shown, the button should say 'Change Directory', else 'Select Directory'
 */
async function showSelectedDirDiv (show) {
  if (show) {
    selectedDirDiv.style.display = 'inline'
    pathRequiredWarning.style.display = 'none'
    selectDirButton.innerText = i18n.t('verify~Change Directory')
    selectDirButton.setAttribute('i18n-data', 'verify~Change Directory')
  } else {
    selectedDirDiv.style.display = 'none'
    pathRequiredWarning.style.display = 'inline'
    selectDirButton.innerText = i18n.t('verify~Select directory')
    selectDirButton.setAttribute('i18n-data', 'verify~Select directory')
  }
}

/*
 * Show the verifySpinner or not
 */
async function showSpinner (show) {
  if (show) {
    verifySpinner.style.display = 'inline-block'
  } else {
    verifySpinner.style.display = 'none'
  }
}

/*
 * Show verifyList or not
 */
async function showVerifyList (show) {
  if (show) {
    verifyList.style.display = 'block'
  } else {
    verifyList.style.display = 'none'
  }
}
