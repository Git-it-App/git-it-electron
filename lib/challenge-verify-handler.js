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
document.addEventListener('DOMContentLoaded', () => {
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

  const challengeUserData = userData.getChallengeData(currentChallenge)
  if (challengeUserData.completed) {
    enableVerifyButtons(false)
    enableClearStatusButton(true)
  } else {
    enableVerifyButtons(true)
    enableClearStatusButton(false)
  }

  // Only if button exists
  if (selectDirButton) {
    let savedDir = userData.getSavedDir().savedDir
    // On 'forks_and_clones', clear savedDir as it should change.
    if (currentChallenge === 'forks_and_clones') {
      savedDir = null
    }
    if (!savedDir) {
      showSelectedDirDiv(false)
    } else {
      selectedDirPath.innerText = savedDir
      showSelectedDirDiv(true)
    }
  }
})

/*
 * Listen for confirmed selectDir dialog
 */
ipc.on('confirm-selectDir', (event, path) => {
  selectedDirPath.innerText = path
  showSelectedDirDiv(true)
  userData.updateSavedDir(path)
})

/*
 * Handling Click-event on verify-button
 */
async function handleVerifyClick () {
  // If challenge with directory, but no path is selected
  if (selectDirButton && !selectedDirPath?.innerText.length) {
    console.log('No path selected!')
    showSelectedDirDiv(false)
    return
  }

  showSpinner(true)
  enableVerifyButtons(false)

  // In js it is possible to call with more parameters, than defined
  const result = await verifyChallengeScript(selectedDirPath?.innerText)

  clearVerifyList()
  printOutVerifyList(result)

  if (result.challengeComplete) {
    enableClearStatusButton(true)
    userData.setChallengeCompleted(currentChallenge, true)
    sidebarHandler.showChallengeCompleted(currentChallenge, true)
  } else {
    enableVerifyButtons(true)
  }

  showSpinner(false)
  // TODO write verifyList to userData to be able to reload it (also when reloading translations)?
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
  sidebarHandler.showChallengeCompleted(currentChallenge, false)
  userData.setChallengeCompleted(currentChallenge, false)
}

/*
 * Write out the result.verifyList to the DOM
 */
function printOutVerifyList (result) {
  showVerifyList(true)
  result.verifyList.forEach(listItem => {
    const li = document.createElement('li')

    li.appendChild(document.createTextNode(listItem.message))
    if (listItem.pass) {
      li.classList.add('verify-pass')
    } else {
      li.classList.add('verify-fail')
    }

    verifyList.appendChild(li)
  })
}

/*
 * Small helper for readable code
 */
function clearVerifyList () {
  verifyList.innerHTML = ''
}

/*
 * clearStatusButton gets shown or not on enabled
 */
function enableClearStatusButton (enabled) {
  if (enabled) {
    clearStatusButton.style.display = 'block'
  } else {
    clearStatusButton.style.display = 'none'
  }
}

/*
 * VerifyButton gets disabled or not.
 */
function enableVerifyButtons (enabled) {
  verifyButton.disabled = !enabled
  if (selectDirButton) {
    selectDirButton.disabled = !enabled
  }
}

/*
 * Either show selectedDirDiv or show PathRequiredWarning
 * If selectedDir is shown, the button should say 'Change Directory', else 'Select Directory'
 */
function showSelectedDirDiv (show) {
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
function showSpinner (show) {
  if (show) {
    verifySpinner.style.display = 'inline-block'
  } else {
    verifySpinner.style.display = 'none'
  }
}

/*
 * Show verifyList or not
 */
function showVerifyList (show) {
  if (show) {
    verifyList.style.display = 'block'
  } else {
    verifyList.style.display = 'none'
  }
}
