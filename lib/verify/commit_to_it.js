const fs = require('fs')
const path = require('path')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'commit_to_it'

// check that they've commited changes

module.exports = function commitVerify (path) {
  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList('Path is not a directory.', false)
    return helper.challengeIncomplete()
  }

  try {
    const out = execGit('status', { cwd: path })
    const show = out.trim()

    // TODO Need to improve the checks? Especially Initial-commit is not used anymore in up-to-date git.
    if (show.match('Initial commit')) {
      addToList("Can't find committed changes.", false)
      helper.challengeIncomplete()
    } else if (show.match('nothing to commit')) {
      addToList('Changes have been committed!', true)
      markChallengeCompleted(currentChallenge)
      userData.updateData(currentChallenge)
    } else {
      addToList('Seems there are changes to commit still.', false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    helper.challengeIncomplete()
  }
}
