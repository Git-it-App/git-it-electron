const path = require('path')
const axios = require('axios')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

const url = 'http://reporobot.jlord.us/pr?username='

// check that they've submitted a pull request
// to the original repository jlord/patchwork

module.exports = async function () {
  const result = getEmptyVerifyResult()
  let username = ''

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      const pr = response.data.pr
      if (pr) {
        addToVerifyList(result.verifyList, i18n.t('verify~Found your pull request!'), true)
      } else {
        // TODO give user url to their repo also
        addToVerifyList(result.verifyList, i18n.t('verify~No merged pull request found for username {/username/}. If you created a pull request on github, return there to see if reporobot left some comments.',
          { username }), false)
      }
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
