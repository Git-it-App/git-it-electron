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
    addToVerifyList(result.verifyList, false, 'verify~Path is not a directory.')
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
    return result
  }

  let remotes = []
  try {
    const out = execGit('remote -v', { cwd: path })
    remotes = out.split('\n')

    if (remotes.length !== 4) {
      addToVerifyList(result.verifyList, false, 'verify~Did not find 2 remotes set up.')
    }
  } catch (err) {
    addToVerifyList(result.verifyList, false, 'Error: ' + err.message)
  }

  remotes.splice(1, 2)
  remotes.forEach(remote => {
    if (remote.match('origin')) {
      if (remote.match('github.com[:/]' + username + '/patchwork')) {
        addToVerifyList(result.verifyList, true, 'verify~Origin points to your fork!')
      } else {
        addToVerifyList(result.verifyList, false, 'verify~No Origin remote found pointing to {/userrepo/}.', { userrepo: username + '/patchwork' })
      }
    }

    if (remote.match('upstream')) {
      if (remote.match('github.com[:/]jlord/patchwork')) {
        addToVerifyList(result.verifyList, true, 'verify~Upstream remote set up!')
      } else {
        addToVerifyList(result.verifyList, false, 'verify~No Upstream remote found pointing to {/patchworkrepo/}.', { patchworkrepo: 'jlord/patchwork' })
      }
    }
  })

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
