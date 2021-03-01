const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they performed a merge
// check there is not username named branch

module.exports = async function (path) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  // Get stored username
  try {
    username = await execGit('config user.username')
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
    return result
  }

  // Search log for merge activity
  try {
    const ref = await execGit('reflog -10', { cwd: path })
    if (ref.match('merge add-' + username)) {
      addToVerifyList('verify~Your branch has been merged!', true, result.verifyList)
    } else {
      addToVerifyList('verify~No merge of your branch in history.', false, result.verifyList)
    }
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
  }

  // Check if branch still exists
  try {
    const branches = await execGit('branch', { cwd: path })
    if (branches.match('add-' + username)) {
      addToVerifyList('verify~Uh oh, your branch is still there.', false, result.verifyList)
    } else {
      addToVerifyList('verify~Branch deleted!', true, result.verifyList)
    }
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
