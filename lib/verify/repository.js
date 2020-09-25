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

  try {
    const out = execGit('status', { cwd: path })
    const status = out.trim()

    if (status.match('On branch')) {
      addToVerifyList(result.verifyList, i18n.t('verify~This is a Git repository!'), true)
    } else {
      addToVerifyList(result.verifyList, i18n.t('verify~This folder is not being tracked by Git.'), false)
    }
  } catch (err) {
    addToVerifyList(result.verifyList, i18n.t('verify~This folder is not being tracked by Git.'), false)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
