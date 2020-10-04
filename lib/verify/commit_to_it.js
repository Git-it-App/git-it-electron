const fs = require('fs')
const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've commited changes
module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  try {
    const show = execGit('status', { cwd: path })

    if (show.match('No commits yet')) {
      addToVerifyList(result.verifyList, i18n.t("verify~Can't find committed changes."), false)
    } else if (show.match('nothing to commit')) {
      addToVerifyList(result.verifyList, i18n.t('verify~Changes have been committed!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Seems there are still changes to commit.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
