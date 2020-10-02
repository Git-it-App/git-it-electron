const axios = require('axios')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

const url = 'http://reporobot.jlord.us/collab?username='

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

  // check that they've added RR as a collaborator
  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      if (response.data.collab === true) {
        addToVerifyList(result.verifyList, i18n.t('verify~Reporobot has been added!'), true)
      } else {
        // If they have a non 200 error, log it so that we can  use
        // devtools to help user debug what went wrong
        if (response.data.error) {
          console.log('StatusCode:', response.status, 'Body:', response.data)
        }
        addToVerifyList(result.verifyList, i18n.t('verify~Reporobot seems not to have access to your fork.'), false)
      }
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
