const fs = require('fs')
const path = require('path')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// get their username
// verify branch matches username, case too.
// verify they've pushed
// check the file is in contributors directory

module.exports = async function (repopath) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(repopath, { throwIfNoEntry: false }) || !fs.lstatSync(repopath).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  // Get stored username
  try {
    username = await execGit('config user.username', { cwd: repopath })
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  let currentBranch = ''
  try {
    currentBranch = await execGit('rev-parse --abbrev-ref HEAD', { cwd: repopath })

    const expectedBranch = 'add-' + username
    if (currentBranch.match(expectedBranch)) {
      addToVerifyList('verify~Found branch as expected!', true, result.verifyList)
    } else {
      addToVerifyList('verify~Branch name expected: {/expectedBranch/}', false, result.verifyList, { expectedBranch })
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  // see if repopath is already contributors folder & search file add-username
  let pathToCheck = ''
  if (repopath.match('contributors')) {
    pathToCheck = repopath
  } else {
    pathToCheck = path.join(repopath, '/contributors/')
  }
  try {
    const out = fs.readdirSync(pathToCheck)
    const allFiles = out.join()

    if (allFiles.match('add-' + username)) {
      addToVerifyList('verify~File in contributors folder!', true, result.verifyList)
    } else {
      addToVerifyList('verify~File not found in contributors folder.', false, result.verifyList)
      return result
    }
  } catch (err) {
    // TODO ENOENT: no such file or directory, scandir '/Users/jlord/jCode/.../contributors/'
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  // Check push
  // TODO look into this, is using reflog the best way? what about origin?
  // sometimes it seems this doesn't work
  try {
    const log = await execGit('reflog show origin/' + currentBranch, { cwd: repopath })

    if (log.match('update by push')) {
      addToVerifyList('verify~Changes have been pushed!', true, result.verifyList)
    } else {
      addToVerifyList('verify~Changes not pushed.', false, result.verifyList)
    }
  } catch (err) {
    console.log(err.message)
    addToVerifyList('verify~Changes not pushed.', false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
