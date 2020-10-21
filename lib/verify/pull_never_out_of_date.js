const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// do a fetch dry run to see if there is anything
// to pull; if there is they haven't pulled yet

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  try {
    const status = execGit('fetch --dry-run', { cwd: path })

    if (status === '') {
      addToVerifyList(result.verifyList, true, 'verify~Up to date!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~There are changes to pull in.')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
