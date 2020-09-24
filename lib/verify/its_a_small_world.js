const axios = require('axios')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const url = 'http://reporobot.jlord.us/collab?username='

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'its_a_small_world'

module.exports = async function verifySmallWorldChallenge () {
  let username = ''

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // check that they've added RR as a collaborator
  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      if (response.data.collab === true) {
        addToList(i18n.t('verify~Reporobot has been added!'), true)
        markChallengeCompleted(currentChallenge)
        userData.setChallengeCompleted(currentChallenge)
      } else {
        // If they have a non 200 error, log it so that we can  use
        // devtools to help user debug what went wrong
        if (response.data.error) {
          console.log('StatusCode:', response.status, 'Body:', response.data)
        }
        addToList(i18n.t('verify~Reporobot seems not to have access to your fork.'), false)
        helper.challengeIncomplete()
      }
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }
}
