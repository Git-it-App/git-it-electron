const fs = require('fs')
const path = require('path')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

// TODO do I want to do this as a var? un-needed, also can't browser view
// pass in the challenge string?
const currentChallenge = 'repository'

module.exports = function repositoryVerify (path) {
  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList('Path is not a directory.', false)
    return helper.challengeIncomplete()
  }

  try {
    const out = execGit('status', { cwd: path })
    const status = out.trim()

    if (status.match('On branch')) {
      addToList('This is a Git repository!', true)
      markChallengeCompleted(currentChallenge)
      userData.updateData(currentChallenge)
    } else {
      addToList("This folder isn't being tracked by Git.", false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('This folder is not being tracked by Git.', false)
    helper.challengeIncomplete()
  }
}
