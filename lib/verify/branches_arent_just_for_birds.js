const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// get their username
// verify branch matches username, case too.
// verify they've pushed
// check the file is in contributors directory

module.exports = function (repopath) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(repopath).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username', { cwd: repopath })
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  let currentBranch = ''
  try {
    currentBranch = execGit('rev-parse --abbrev-ref HEAD', { cwd: repopath })

    const expectedBranch = 'add-' + username
    if (currentBranch.match(expectedBranch)) {
      addToVerifyList(result.verifyList, i18n.t('verify~Found branch as expected!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Branch name expected: {/expectedBranch/}', { expectedBranch }), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // see if repopath is already contributors folder & search file add-username
  let pathToCheck = ''
  if (repopath.match('Contributors')) {
    pathToCheck = repopath
  } else {
    pathToCheck = path.join(repopath, '/Contributors/')
  }
  try {
    const out = fs.readdirSync(pathToCheck)
    const allFiles = out.join()

    if (allFiles.match('add-' + username)) {
      addToVerifyList(result.verifyList, i18n.t('verify~File in contributors folder!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~File not found in contributors folder.'), false)
      return result
    }
  } catch (err) {
    // TODO ENOENT: no such file or directory, scandir '/Users/jlord/jCode/.../contributors/'
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  // Check push
  // TODO look into this, is using reflog the best way? what about origin?
  // sometimes it seems this doesn't work
  try {
    const log = execGit('reflog show origin/' + currentBranch, { cwd: repopath })

    if (log.match('update by push')) {
      addToVerifyList(result.verifyList, i18n.t('verify~Changes have been pushed!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~Changes not pushed.'), false)
    }
  } catch (err) {
    console.log(err.message)
    addToVerifyList(result.verifyList, i18n.t('verify~Changes not pushed.'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
