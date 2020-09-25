/*
 * Runs in: Renderer-Process
 * Cares for the Challenge-Sidebar to be up-to-date with completed-status
 */
const path = require('path')
const userData = require(path.normalize(path.join(__dirname, 'user-data.js')))

// Execute after DOM loaded.
document.addEventListener('DOMContentLoaded', () => {
  const challengeUserData = userData.getChallengeData().content

  Object.keys(challengeUserData).forEach((challengeKey) => {
    if (challengeUserData[challengeKey].completed) {
      showChallengeCompleted(challengeKey, true)
    }
  })
})

/*
 * Show a challenge as completed/incomplete in sidebar
 */
function showChallengeCompleted (challengeKey, completed) {
  if (completed) {
    document.getElementById('sidebar-' + challengeKey).classList.add('completed')
  } else {
    document.getElementById('sidebar-' + challengeKey).classList.remove('completed')
  }
}

exports.showChallengeCompleted = showChallengeCompleted
