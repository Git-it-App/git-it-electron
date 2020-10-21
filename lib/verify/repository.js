const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  try {
    const status = execGit('status', { cwd: path })

    if (status.match('On branch')) {
      addToVerifyList(result.verifyList, true, 'verify~This is a Git repository!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~This folder is not being tracked by Git.')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'verify~This folder is not being tracked by Git.')
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
