#!/usr/bin/env node

const path = require('path')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'pull_never_out_of_date'

// do a fetch dry run to see if there is anything
// to pull; if there is they haven't pulled yet

module.exports = function verifyPullChallenge (path) {
  try {
    const out = execGit('fetch --dry-run', { cwd: path })
    const status = out.trim()

    if (status === '') {
      addToList('Up to date!', true)
      markChallengeCompleted(currentChallenge)
      userData.updateData(currentChallenge)
    } else {
      addToList('There are changes to pull in.', false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }
}
