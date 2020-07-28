#!/usr/bin/env node

const path = require('path')
const axios = require('axios')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'requesting_you_pull_please'
const url = 'http://reporobot.jlord.us/pr?username='

// check that they've submitted a pull request
// to the original repository jlord/patchwork

module.exports = async function verifyPRChallenge () {
  let username = ''

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      const pr = response.data.pr
      if (pr) {
        addToList(i18n.t('verify~Found your pull request!'), true)
        markChallengeCompleted(currentChallenge)
        userData.updateData(currentChallenge)
      } else {
        // TODO give user url to their repo also
        addToList(i18n.t('verify~No merged pull request found for username {{username}}. If you created a pull request on github, return there to see if reporobot left some comments.',
          { username }), false)
        helper.challengeIncomplete()
      }
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }
}
