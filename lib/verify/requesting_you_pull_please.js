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
    username = await execGit('config user.username')
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
    return result
  }

  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      const pr = response.data.pr
      if (pr) {
        addToVerifyList('verify~Found your pull request!', true, result.verifyList)
      } else {
        // TODO give user url to their repo also
        addToVerifyList('verify~No merged pull request found for username {/username/}. If you created a pull request on github, return there to see if reporobot left some comments.',
          false, result.verifyList, { username }
        )
      }
    }
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
