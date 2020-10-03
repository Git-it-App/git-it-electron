const fs = require('fs')
const i18n = require('electron').remote.getGlobal('i18n')
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// check that they've added the remote, that shows
// that they've also then forked and cloned.
// TODO Separate check on fork for nice feedback?!

module.exports = function (path) {
  const result = getEmptyVerifyResult()
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToVerifyList(result.verifyList, i18n.t('verify~Path is not a directory.'), false)
    return result
  }

  // Get stored username
  try {
    username = execGit('config user.username')
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
    return result
  }

  let remotes = []
  try {
    const out = execGit('remote -v', { cwd: path })
    remotes = out.split('\n')

    if (remotes.length !== 4) {
      addToVerifyList(result.verifyList, i18n.t('verify~Did not find 2 remotes set up.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, 'Error: ' + err.message, false)
  }

  remotes.splice(1, 2)
  remotes.forEach(remote => {
    if (remote.match('origin')) {
      if (remote.match('github.com[:/]' + username + '/patchwork')) {
        addToVerifyList(result.verifyList, i18n.t('verify~Origin points to your fork!'), true)
      } else {
        addToVerifyList(result.verifyList, i18n.t('verify~No Origin remote found pointing to {/userrepo/}.', { userrepo: username + '/patchwork' }), false)
      }
    }

    if (remote.match('upstream')) {
      if (remote.match('github.com[:/]jlord/patchwork')) {
        addToVerifyList(result.verifyList, i18n.t('verify~Upstream remote set up!'), true)
      } else {
        addToVerifyList(result.verifyList, i18n.t('verify~No Upstream remote found pointing to {/patchworkrepo/}.', { patchworkrepo: 'jlord/patchwork' }), false)
      }
    }
  })

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
