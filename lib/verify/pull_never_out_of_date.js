const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// do a fetch dry run to see if there is anything
// to pull; if there is they haven't pulled yet

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  try {
    const status = execGit('fetch --dry-run', { cwd: path })

    if (status === '') {
      addToVerifyList('verify~Up to date!', true, result.verifyList)
    } else {
      addToVerifyList('verify~There are changes to pull in.', false, result.verifyList)
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
