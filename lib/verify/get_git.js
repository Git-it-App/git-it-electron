const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// TODO
// Think about how best to show errors to user

module.exports = function () {
  const result = getEmptyVerifyResult()

  // Check version, return if no git installed, as further checks are useless.
  try {
    const gitOutput = execGit('--version')

    if (gitOutput.match('git version')) {
      addToVerifyList(result.verifyList, i18n.t('verify~Found Git installed!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Did not find Git installed.'), false)
      return result
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, i18n.t('verify~Did not find Git installed.'), false)
    return result
  }

  // Check user.name
  try {
    const name = execGit('config user.name')

    if (name !== '') {
      addToVerifyList(result.verifyList, i18n.t('verify~Name Added!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~No name found.'), false)
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, i18n.t('verify~No name found.'), false)
  }

  // Check user.email
  try {
    const email = execGit('config user.email')

    if (email !== '') {
      addToVerifyList(result.verifyList, i18n.t('verify~Email Added!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~No email found.'), false)
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, i18n.t('verify~No email found.'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
