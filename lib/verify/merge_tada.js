const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'merge_tada'
const total = 2

// check that they performed a merge
// check there is not username named branch

module.exports = function verifyMergeTadaChallenge (path) {
  let counter = 0
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList(i18n.t('verify~Path is not a directory.'), false)
    return helper.challengeIncomplete()
  }

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // Search log for merge activity
  try {
    const out = execGit('reflog -10', { cwd: path })
    const ref = out.trim()
    if (ref.match('merge add-' + username)) {
      counter++
      addToList(i18n.t('verify~Your branch has been merged!'), true)
    } else {
      addToList(i18n.t('verify~No merge of your branch in history.'), false)
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // Check if branch still exists
  try {
    const out = execGit('branch', { cwd: path })
    const branches = out.trim()
    if (branches.match('add-' + username)) {
      addToList(i18n.t('verify~Uh oh, your branch is still there.'), false)
    } else {
      counter++
      addToList(i18n.t('verify~Branch deleted!'), true)
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  if (counter === total) {
    markChallengeCompleted(currentChallenge)
    userData.setChallengeCompleted(currentChallenge)
  } else {
    helper.challengeIncomplete()
  }
}
