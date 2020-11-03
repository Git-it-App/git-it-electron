const axios = require('axios')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

const url = 'http://reporobot.jlord.us/collab?username='

module.exports = async function () {
  const result = getEmptyVerifyResult()
  let username = ''

  // Get stored username
  try {
    username = await execGit('config user.username')
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  // check that they've added RR as a collaborator
  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      if (response.data.collab === true) {
        addToVerifyList('verify~Reporobot has been added!', true, result.verifyList)
      } else {
        // If they have a non 200 error, log it so that we can  use
        // devtools to help user debug what went wrong
        if (response.data.error) {
          console.log('StatusCode:', response.status, 'Body:', response.data)
        }
        addToVerifyList('verify~Reporobot seems not to have access to your fork.', false, result.verifyList)
      }
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
