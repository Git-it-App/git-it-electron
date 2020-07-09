#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
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
    addToList('Path is not a directory.', false)
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
      addToList('Did not find 2 remotes set up.', false)
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
        addToList('Origin points to your fork!', true)
      } else {
        incomplete = true
        addToList('No Origin remote found pointing to ' + username + '/patchwork.', false)
      }
    }

    if (remote.match('upstream')) {
      if (remote.match('github.com[:/]jlord/')) {
        addToList('Upstream remote set up!', true)
      } else {
        incomplete = true
        addToList('No Upstream remote found pointing to jlord/patchwork.', false)
      }
    }
  })

  if (incomplete) {
    return helper.challengeIncomplete()
  }

  userData.updateData(currentChallenge)
  helper.markChallengeCompleted(currentChallenge)
}
