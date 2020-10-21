const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  // Checks for added remote
  try {
    const remotes = execGit('remote -v', { cwd: path })

    if (remotes.match('origin')) {
      addToVerifyList(result.verifyList, true, 'verify~Found remote set up.')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~Did not find remote origin.')
      return result
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  // check that they've made a push
  try {
    const ref = execGit('reflog show origin/master', { cwd: path })

    if (ref.match('update by push')) {
      addToVerifyList(result.verifyList, true, 'verify~You pushed changes!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~No evidence of push.')
    }
  } catch (err) {
    // TODO provide nicer error-message and only log the error?
    console.log(err.message)
    addToVerifyList(result.verifyList, false, 'verify~No pushed changes found.')
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
