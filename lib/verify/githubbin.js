const axios = require('axios')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

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
    username = await execGit('config user.username')

    if (username === '') {
      addToVerifyList('verify~No username found.', false, result.verifyList)
      return result
    } else {
      addToVerifyList('verify~Username added to Git config!', true, result.verifyList)
    }
  } catch (err) {
    // TODO Catch 'Command failed: /bin/sh -c git config user.username'
    addToVerifyList('verify~No username found.', false, result.verifyList)
    return result
  }

  // Check if respecitve user exists on github
  try {
    const response = await axios.get('https://api.github.com/users/' + username, axiosOptions)

    if (response.status === 200) {
      addToVerifyList("verify~You're on GitHub!", true, result.verifyList)
      githubUsername = response.data.login
    } else {
      addToVerifyList('verify~GitHub account matching stored Git-username was not found.', false, result.verifyList)
      return result
    }
  } catch (err) {
    if (err.response.status === 404) {
      addToVerifyList('verify~GitHub account matching stored Git-username was not found.', false, result.verifyList)
      return result
    } else {
      addToVerifyList('Error: ' + err.message, false, result.verifyList)
      return result
    }
  }

  // Check if stored username matches Github-Username - CaseSensitive!
  if (username === githubUsername) {
    addToVerifyList('verify~Username capitalisation identical on GitHub and Git config!', true, result.verifyList)
  } else {
    addToVerifyList('verify~GitHub & Git config usernames do not match (Take care on capitalisation!).', false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
