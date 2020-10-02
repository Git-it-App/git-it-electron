const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

// check that they performed a merge
// check there is not username named branch

module.exports = function (path) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // Search log for merge activity
  try {
    const out = execGit('reflog -10', { cwd: path })
    const ref = out.trim()
    if (ref.match('merge add-' + username)) {
      addToVerifyList(result.verifyList, i18n.t('verify~Your branch has been merged!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~No merge of your branch in history.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  // Check if branch still exists
  try {
    const out = execGit('branch', { cwd: path })
    const branches = out.trim()
    if (branches.match('add-' + username)) {
      addToVerifyList(result.verifyList, i18n.t('verify~Uh oh, your branch is still there.'), false)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Branch deleted!'), true)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
