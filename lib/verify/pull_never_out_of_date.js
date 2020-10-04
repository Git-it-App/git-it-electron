const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// do a fetch dry run to see if there is anything
// to pull; if there is they haven't pulled yet

module.exports = function (path) {
  const result = getEmptyVerifyResult()

  try {
    const status = execGit('fetch --dry-run', { cwd: path })

    if (status === '') {
      addToVerifyList(result.verifyList, i18n.t('verify~Up to date!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~There are changes to pull in.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
