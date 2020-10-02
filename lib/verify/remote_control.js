const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const { addToVerifyList, checkChallengeComplete, getEmptyVerifyResult } = require('./verify-helpers')

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  // Checks for added remote
  try {
    const out = execGit('remote -v', { cwd: path })
    const remotes = out.trim()

    if (remotes.match('origin')) {
      addToVerifyList(result.verifyList, i18n.t('verify~Found remote set up.'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Did not find remote origin.'), false)
      return result
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // check that they've made a push
  try {
    const out = execGit('reflog show origin/master', { cwd: path })
    const ref = out.trim()

    if (ref.match('update by push')) {
      addToVerifyList(result.verifyList, i18n.t('verify~You pushed changes!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~No evidence of push.'), false)
    }
  } catch (err) {
    // TODO provide nicer error-message and only log the error?
    console.log(err.message)
    addToVerifyList(result.verifyList, i18n.t('verify~No pushed changes found.'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
