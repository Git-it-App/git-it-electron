const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'remote_control'

module.exports = function verifyRemoteControlChallenge (path) {
  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList(i18n.t('verify~Path is not a directory.'), false)
    return helper.challengeIncomplete()
  }

  // Checks for added remote
  try {
    const out = execGit('remote -v', { cwd: path })
    const remotes = out.trim()

    if (remotes.match('origin')) {
      addToList(i18n.t('verify~Found remote set up.'), true)
    } else {
      addToList(i18n.t('verify~Did not find remote origin.'), false)
      return helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // check that they've made a push
  try {
    const out = execGit('reflog show origin/master', { cwd: path })
    const ref = out.trim()

    if (ref.match('update by push')) {
      addToList(i18n.t('verify~You pushed changes!'), true)
      markChallengeCompleted(currentChallenge)
      userData.updateData(currentChallenge)
    } else {
      addToList(i18n.t('verify~No evidence of push.'), false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    // TODO provide nicer error-message and only log the error?
    console.log(err.message)
    addToList(i18n.t('verify~No pushed changes found.'), false)
    return helper.challengeIncomplete()
  }
}
