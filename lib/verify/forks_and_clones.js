#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList

const currentChallenge = 'forks_and_clones'

// check that they've added the remote, that shows
// that they've also then forked and cloned.
// TODO Separate check on fork for nice feedback?!

module.exports = function verifyForksAndClonesChallenge (path) {
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(path).isDirectory()) {
    addToList(i18n.t('Path is not a directory.'), false)
    return helper.challengeIncomplete()
  }

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  let remotes = []
  try {
    const out = execGit('remote -v', { cwd: path })
    remotes = out.trim().split('\n')

    if (remotes.length !== 4) {
      addToList(i18n.t('Did not find 2 remotes set up.'), false)
      return helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  remotes.splice(1, 2)
  let incomplete = false
  remotes.forEach(remote => {
    if (remote.match('origin')) {
      if (remote.match('github.com[:/]' + username + '/')) {
        addToList(i18n.t('Origin points to your fork!'), true)
      } else {
        incomplete = true
        addToList(i18n.t('No Origin remote found pointing to {{username}}/patchwork.', { username }), false)
      }
    }

    if (remote.match('upstream')) {
      if (remote.match('github.com[:/]jlord/')) {
        addToList(i18n.t('Upstream remote set up!'), true)
      } else {
        incomplete = true
        addToList(i18n.t('No Upstream remote found pointing to jlord/patchwork.'), false)
      }
    }
  })

  if (incomplete) {
    return helper.challengeIncomplete()
  }

  userData.updateData(currentChallenge)
  helper.markChallengeCompleted(currentChallenge)
}
