/*
 * Runs in: Renderer-Process
 * Cares for the Challenge-Sidebar to be up-to-date with challengeComplete-status
 */
const path = require('path')
const userData = require(path.normalize(path.join(__dirname, 'user-data.js')))

// Execute after DOM loaded.
document.addEventListener('DOMContentLoaded', () => {
  const challengeUserData = userData.getChallengeData()

  Object.keys(challengeUserData).forEach((challengeKey) => {
    if (challengeUserData[challengeKey].challengeComplete) {
      showChallengeComplete(challengeKey, true)
    }
  })
})

/*
 * Show a challenge as complete/incomplete in sidebar
 */
function showChallengeComplete (challengeKey, isComplete) {
  if (isComplete) {
    document.getElementById('sidebar-' + challengeKey).classList.add('completed')
  } else {
    document.getElementById('sidebar-' + challengeKey).classList.remove('completed')
  }
}

exports.showChallengeComplete = showChallengeComplete
