const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've commited changes
module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  try {
    const out = execGit('status', { cwd: path })
    const show = out.trim()

    // TODO Need to improve the checks? Especially Initial-commit is not used anymore in up-to-date git.
    if (show.match('Initial commit')) {
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
