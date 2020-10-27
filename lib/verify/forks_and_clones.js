const fs = require('fs')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've added the remote, that shows
// that they've also then forked and cloned.
// TODO Separate check on fork for nice feedback?!

module.exports = function (path) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList('verify~Path is not a directory.', false, result.verifyList)
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  let remotes = []
  try {
    const out = execGit('remote -v', { cwd: path })
    remotes = out.split('\n')

    if (remotes.length !== 4) {
      addToVerifyList('verify~Did not find 2 remotes set up.', false, result.verifyList)
    }
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
  }

  remotes.splice(1, 2)
  remotes.forEach(remote => {
    if (remote.match('origin')) {
      if (remote.match('github.com[:/]' + username + '/patchwork')) {
        addToVerifyList('verify~Origin points to your fork!', true, result.verifyList)
      } else {
        addToVerifyList('verify~No Origin remote found pointing to {/userrepo/}.', false, result.verifyList, { userrepo: username + '/patchwork' })
      }
    }

    if (remote.match('upstream')) {
      if (remote.match('github.com[:/]jlord/patchwork')) {
        addToVerifyList('verify~Upstream remote set up!', true, result.verifyList)
      } else {
        addToVerifyList('verify~No Upstream remote found pointing to {/patchworkrepo/}.', false, result.verifyList, { patchworkrepo: 'jlord/patchwork' })
      }
    }
  })

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
