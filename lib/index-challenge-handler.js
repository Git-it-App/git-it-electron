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

const clearAllButtons = document.querySelectorAll('.js-clear-all-challenges')
const pickupButton = document.getElementById('pickup-button')
const progressCircles = document.querySelectorAll('.progress-circle')

const IndexSectionStart = document.getElementById('index-section-start')
const IndexSectionWip = document.getElementById('index-section-wip')
const IndexSectionFinished = document.getElementById('index-section-finished')

// Execute after DOM loaded.
document.addEventListener('DOMContentLoaded', () => {
  // Get stored challengeUserData & store Key-Array as often used
  const challengeUserData = userData.getChallengeData().content
  const challengeUserDataKeys = Object.keys(challengeUserData)

  // Go through the challenges in challengeUserData to see which are completed
  let countCompleted = 0
  challengeUserDataKeys.forEach((challengeKey, index) => {
    if (challengeUserData[challengeKey].completed) {
      countCompleted++
      progressCircles[index].classList.add('completed') // Mark corresponding circle as completed
      if (index < challengeUserDataKeys.length - 1) {
        pickupButton.href = path.join(__dirname, '..', 'challenges', challengeUserDataKeys[index + 1] + '.html') // Set Link on pickup-button to next challenge
      }
    }
  })

  // If no challenges are complete, show the start-section
  if (countCompleted === 0) {
    showSection('start')
  }
  // If only some challenges are complete, show the wip-section
  if (countCompleted !== 0 && countCompleted !== challengeUserDataKeys.length) {
    showSection('wip')
  }
  // If all challenges are complete, show the finished-section
  if (countCompleted === challengeUserDataKeys.length) {
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
    progressCircle.classList.remove('completed')
  })

  // Show Start-Index Page
  showSection('start')
})

/*
 * Show exclusively the specified section.
 * section = 'start'|'wip'|'finished'
 */
function showSection (section) {
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
