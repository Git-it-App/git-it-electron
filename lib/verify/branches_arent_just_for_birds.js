const fs = require('fs')
const path = require('path')
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
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username', { cwd: repopath })
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  let currentBranch = ''
  try {
    currentBranch = execGit('rev-parse --abbrev-ref HEAD', { cwd: repopath })

    const expectedBranch = 'add-' + username
    if (currentBranch.match(expectedBranch)) {
      addToVerifyList(result.verifyList, true, 'verify~Found branch as expected!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~Branch name expected: {/expectedBranch/}', { expectedBranch })
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
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
      addToVerifyList(result.verifyList, true, 'verify~File in contributors folder!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~File not found in contributors folder.')
      return result
    }
  } catch (err) {
    // TODO ENOENT: no such file or directory, scandir '/Users/jlord/jCode/.../contributors/'
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  // Check push
  // TODO look into this, is using reflog the best way? what about origin?
  // sometimes it seems this doesn't work
  try {
    const log = execGit('reflog show origin/' + currentBranch, { cwd: repopath })

    if (log.match('update by push')) {
      addToVerifyList(result.verifyList, true, 'verify~Changes have been pushed!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~Changes not pushed.')
    }
  } catch (err) {
    console.log(err.message)
    addToVerifyList(result.verifyList, false, 'verify~Changes not pushed.')
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
