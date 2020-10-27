const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've commited changes
module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  try {
    const show = execGit('status', { cwd: path })

    if (show.match('No commits yet')) {
      addToVerifyList("verify~Can't find committed changes.", false, result.verifyList)
    } else if (show.match('nothing to commit')) {
      addToVerifyList('verify~Changes have been committed!', true, result.verifyList)
    } else {
      addToVerifyList('verify~Seems there are still changes to commit.', false, result.verifyList)
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
