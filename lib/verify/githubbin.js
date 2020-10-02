const axios = require('axios')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

// Specifically request current REST-API v3 from Github
const axiosOptions = {
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
}

// verify they set up git config
// verify that user exists on GitHub (not case sensitve)
// compare the two to make sure cases match

module.exports = async function () {
  const result = getEmptyVerifyResult()
  let username = ''
  let githubUsername = ''

  // Check if username has been set on git-config
  try {
    const out = execGit('config user.username')
    username = out.trim()

    if (username === '') {
      addToVerifyList(result.verifyList, i18n.t('verify~No username found.'), false)
      return result
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Username added to Git config!'), true)
    }
  } catch (err) {
    // TODO Catch 'Command failed: /bin/sh -c git config user.username'
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // Check if respecitve user exists on github
  try {
    const response = await axios.get('https://api.github.com/users/' + username, axiosOptions)

    if (response.status === 200) {
      addToVerifyList(result.verifyList, i18n.t("verify~You're on GitHub!"), true)
      githubUsername = response.data.login
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~GitHub account matching stored Git-username was not found.'), false)
      return result
    }
  } catch (err) {
    if (err.response.status === 404) {
      addToVerifyList(result.verifyList, i18n.t('verify~GitHub account matching stored Git-username was not found.'), false)
      return result
    } else {
      addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
      return result
    }
  }

  // Check if stored username matches Github-Username - CaseSensitive!
  if (username === githubUsername) {
    addToVerifyList(result.verifyList, i18n.t('verify~Username capitalisation identical on GitHub and Git config!'), true)
  } else {
    addToVerifyList(result.verifyList, i18n.t('verify~GitHub & Git config usernames do not match (Take care on capitalisation!).'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
