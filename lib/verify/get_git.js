const path = require('path')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'get_git'
const total = 3

// TODO
// Think about how best to show errors to user
// All that nesting
// Potentially put all responses in array, use length for total

module.exports = function verifyGetGitChallenge () {
  let counter = 0

  // Check version, return if no git installed, as further checks are useless.
  try {
    const out = execGit('--version')
    const gitOutput = out.trim()

    if (gitOutput.match('git version')) {
      counter++
      addToList('Found Git installed!', true)
    } else {
      addToList('Did not find Git installed.', false)
      return helper.challengeIncomplete()
    }
  } catch (err) {
    console.log(err)
    addToList('Did not find Git installed.', false)
    return helper.challengeIncomplete()
  }

  // Check user.name
  try {
    const out = execGit('config user.name')
    const name = out.trim()

    if (name !== '') {
      counter++
      addToList('Name Added!', true)
    } else {
      addToList('No name found.', false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    console.log(err)
    addToList('No name found.', false)
    helper.challengeIncomplete()
    return false
  }

  // Check user.email
  try {
    const out = execGit('config user.email')
    const email = out.trim()

    if (email !== '') {
      counter++
      addToList('Email Added!', true)
    } else {
      addToList('No email found.', false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    console.log(err)
    addToList('No email found.', false)
    helper.challengeIncomplete()
  }

  if (counter === total) {
    markChallengeCompleted(currentChallenge)
    userData.updateData(currentChallenge)
  }
}
