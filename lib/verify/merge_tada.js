const fs = require('fs')
const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

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
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // Search log for merge activity
  try {
    const ref = execGit('reflog -10', { cwd: path })
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
    const branches = execGit('branch', { cwd: path })
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
