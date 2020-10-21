const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've commited changes
module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  try {
    const show = execGit('status', { cwd: path })

    if (show.match('No commits yet')) {
      addToVerifyList(result.verifyList, false, "verify~Can't find committed changes.")
    } else if (show.match('nothing to commit')) {
      addToVerifyList(result.verifyList, true, 'verify~Changes have been committed!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~Seems there are still changes to commit.')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
