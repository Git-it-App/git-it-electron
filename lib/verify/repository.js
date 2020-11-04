const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = async function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  try {
    const status = await execGit('status', { cwd: path })

    if (status.match('On branch')) {
      addToVerifyList('verify~This is a Git repository!', true, result.verifyList)
    } else {
      addToVerifyList('verify~This folder is not being tracked by Git.', false, result.verifyList)
    }
  } catch (err) {
    addToVerifyList('verify~This folder is not being tracked by Git.', false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
