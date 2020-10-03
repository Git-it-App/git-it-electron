const fs = require('fs')
const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  try {
    const status = execGit('status', { cwd: path })

    if (status.match('On branch')) {
      addToVerifyList(result.verifyList, i18n.t('verify~This is a Git repository!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~This folder is not being tracked by Git.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, i18n.t('verify~This folder is not being tracked by Git.'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
