const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = async function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  // Checks for added remote
  try {
    const remotes = await execGit('remote -v', { cwd: path })

    if (remotes.match('origin')) {
      addToVerifyList('verify~Found remote set up.', true, result.verifyList)
    } else {
      addToVerifyList('verify~Did not find remote origin.', false, result.verifyList)
      return result
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  // check that they've made a push
  try {
    const ref = await execGit('reflog show origin/master', { cwd: path })

    if (ref.match('update by push')) {
      addToVerifyList('verify~You pushed changes!', true, result.verifyList)
    } else {
      addToVerifyList('verify~No evidence of push.', false, result.verifyList)
    }
  } catch (err) {
    // TODO provide nicer error-message and only log the error?
    console.log(err.message)
    addToVerifyList('verify~No pushed changes found.', false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
