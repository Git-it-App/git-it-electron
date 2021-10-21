/*
 * Runs in: Renderer-Process
 * Cares for the Challenge-Sidebar to be up-to-date with challengeComplete-status
 */
const path = require('path')
const userData = require(path.normalize(path.join(__dirname, 'user-data.js')))

// Execute after DOM loaded.
document.addEventListener('DOMContentLoaded', async () => {
  const challengeUserData = await userData.getChallengeData()

  Object.keys(challengeUserData).forEach((challengeKey) => {
    if (challengeUserData[challengeKey].challengeComplete) {
      showChallengeComplete(challengeKey, true)
    }
  })
})

/*
 * Show a challenge as complete/incomplete in sidebar
 */
async function showChallengeComplete (challengeKey, isComplete) {
  if (isComplete) {
    document.getElementById('sidebar__list__item--' + challengeKey).classList.add('complete')
  } else {
    document.getElementById('sidebar__list__item--' + challengeKey).classList.remove('complete')
  }
}

exports.showChallengeComplete = showChallengeComplete
