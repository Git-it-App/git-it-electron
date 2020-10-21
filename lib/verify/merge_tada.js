const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they performed a merge
// check there is not username named branch

module.exports = function (path) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  // Search log for merge activity
  try {
    const ref = execGit('reflog -10', { cwd: path })
    if (ref.match('merge add-' + username)) {
      addToVerifyList(result.verifyList, true, 'verify~Your branch has been merged!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~No merge of your branch in history.')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  // Check if branch still exists
  try {
    const branches = execGit('branch', { cwd: path })
    if (branches.match('add-' + username)) {
      addToVerifyList(result.verifyList, false, 'verify~Uh oh, your branch is still there.')
    } else {
      addToVerifyList(result.verifyList, true, 'verify~Branch deleted!')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
