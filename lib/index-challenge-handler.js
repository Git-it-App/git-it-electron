/*
 * Runs in: Renderer-Process
 *
 * This file is only required by the index page.
 * It touches the DOM by showing progress in challenge completion.
 * It also handles the clear buttons and writing to user-data.
 */
const path = require('path')
const ipc = require('electron').ipcRenderer
const userData = require(path.normalize(path.join(__dirname, '../../lib/user-data.js')))

const clearAllButtons = document.querySelectorAll('.js__clearAllChallenges')
const pickupButton = document.getElementById('pgIndex__pickupButton')
const progressCircles = document.querySelectorAll('.pgIndex__progress__dot')

const IndexSectionStart = document.getElementById('pgIndex__section--start')
const IndexSectionWip = document.getElementById('pgIndex__section--wip')
const IndexSectionFinished = document.getElementById('pgIndex__section--finished')

// Execute after DOM loaded.
document.addEventListener('DOMContentLoaded', async () => {
  // Get stored challengeUserData & store Key-Array as often used
  const challengeUserData = await userData.getChallengeData()
  const challengeUserDataKeys = Object.keys(challengeUserData)

  // Go through the challenges in challengeUserData to see which are complete
  let countComplete = 0
  challengeUserDataKeys.forEach((challengeKey, index) => {
    if (challengeUserData[challengeKey].challengeComplete) {
      countComplete++
      progressCircles[index].classList.add('complete') // Mark corresponding circle as complete
      if (index < challengeUserDataKeys.length - 1) {
        pickupButton.href = path.join(__dirname, '..', 'challenges', challengeUserDataKeys[index + 1] + '.html') // Set Link on pickupButton to next challenge
      }
    }
  })

  // If no challenges are complete, show the start-section
  if (countComplete === 0) {
    showSection('start')
  }
  // If only some challenges are complete, show the wip-section
  if (countComplete !== 0 && countComplete !== challengeUserDataKeys.length) {
    showSection('wip')
  }
  // If all challenges are complete, show the finished-section
  if (countComplete === challengeUserDataKeys.length) {
    showSection('finished')
  }

  // Add Listeners to ClearAll Buttons
  clearAllButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      ipc.send('dialog-clearAll')
    })
  })
})

/*
 * Catch confirmed Clear-All Dialog
 * Clear all challenges on userData, progressCircles and show Start-Section
 */
ipc.on('confirm-clearAll', () => {
  // Clear stored userData
  userData.clearAllChallenges()

  // Clear all ProgressCircles in TopBar
  progressCircles.forEach(progressCircle => {
    progressCircle.classList.remove('complete')
  })

  // Show Start-Index Page
  showSection('start')
})

/*
 * Show exclusively the specified section.
 * section = 'start'|'wip'|'finished'
 */
async function showSection (section) {
  // Only accept specific section-keywords
  const accept = ['start', 'wip', 'finished']

  // Log if wrong keyword
  if (accept.indexOf(section) < 0) {
    console.error('Wrong Section Keyword: ', section)
  }

  switch (section) {
    case 'finished':
      IndexSectionStart.style.display = 'none'
      IndexSectionWip.style.display = 'none'
      IndexSectionFinished.style.display = 'block'
      break
    case 'wip':
      IndexSectionStart.style.display = 'none'
      IndexSectionWip.style.display = 'block'
      IndexSectionFinished.style.display = 'none'
      break
    case 'start':
    default:
      IndexSectionStart.style.display = 'block'
      IndexSectionWip.style.display = 'none'
      IndexSectionFinished.style.display = 'none'
  }
}
