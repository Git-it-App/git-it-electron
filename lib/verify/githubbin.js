#!/usr/bin/env node

const axios = require('axios')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'githubbin'
const total = 3

// Specifically request current REST-API v3 from Github
const axiosOptions = {
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
}

// verify they set up git config
// verify that user exists on GitHub (not case sensitve)
// compare the two to make sure cases match

module.exports = async function verifyGitHubbinChallenge () {
  let counter = 0
  let username = ''
  let githubUsername = ''

  // Check if username has been set on git-config
  try {
    const out = execGit('config user.username')
    username = out.trim()

    if (username === '') {
      addToList(i18n.t('verify~No username found.'), false)
      return helper.challengeIncomplete()
    } else {
      counter++
      addToList(i18n.t('verify~Username added to Git config!'), true)
    }
  } catch (err) {
    // TODO Catch 'Command failed: /bin/sh -c git config user.username'
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // Check if respecitve user exists on github
  try {
    const response = await axios.get('https://api.github.com/users/' + username, axiosOptions)

    if (response.status === 200) {
      counter++
      addToList(i18n.t("You're on GitHub!"), true)
      githubUsername = response.data.login
    } else {
      addToList(i18n.t('verify~GitHub account matching stored Git-username was not found.'), false)
      return helper.challengeIncomplete()
    }
  } catch (err) {
    if (err.response.status === 404) {
      addToList(i18n.t('verify~GitHub account matching stored Git-username was not found.'), false)
      return helper.challengeIncomplete()
    } else {
      addToList('Error: ' + err.message, false)
      return helper.challengeIncomplete()
    }
  }

  // Check if stored username matches Github-Username - CaseSensitive!
  if (username === githubUsername) {
    counter++
    addToList(i18n.t('verify~Username identical on GitHub and Git config!'), true)
  } else {
    addToList(i18n.t('verify~GitHub & Git config usernames do not match.'), false)
    helper.challengeIncomplete()
  }

  // Check if all challenges succeeded.
  if (counter === total) {
    markChallengeCompleted(currentChallenge)
    userData.updateData(currentChallenge)
  }
}
