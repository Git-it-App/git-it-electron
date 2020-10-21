const axios = require('axios')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

const url = 'http://reporobot.jlord.us/pr?username='

// check that they've submitted a pull request
// to the original repository jlord/patchwork

module.exports = async function () {
  const result = getEmptyVerifyResult()
  let username = ''

  // Get stored username
  try {
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      const pr = response.data.pr
      if (pr) {
        addToVerifyList(result.verifyList, true, 'verify~Found your pull request!')
      } else {
        // TODO give user url to their repo also
        addToVerifyList(result.verifyList, false,
          'verify~No merged pull request found for username {/username/}. If you created a pull request on github, return there to see if reporobot left some comments.',
          { username }
        )
      }
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
