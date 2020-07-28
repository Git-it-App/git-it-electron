#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const i18n = require('electron').remote.getGlobal('i18n')
const execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
const helper = require(path.join(__dirname, '../../lib/helpers.js'))
const userData = require(path.join(__dirname, '../../lib/user-data.js'))

const addToList = helper.addToList
const markChallengeCompleted = helper.markChallengeCompleted

const currentChallenge = 'branches_arent_just_for_birds'
const total = 3

// get their username
// verify branch matches username, case too.
// verify they've pushed
// check the file is in contributors directory

module.exports = function verifyBranchesChallenge (repopath) {
  let counter = 0
  let username = ''

  // path should be a directory
  if (!fs.lstatSync(repopath).isDirectory()) {
    addToList(i18n.t('verify~Path is not a directory.'), false)
    return helper.challengeIncomplete()
  }

  // Get stored username
  try {
    const out = execGit('config user.username', { cwd: repopath })
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  let currentBranch = ''
  try {
    const out = execGit('rev-parse --abbrev-ref HEAD', { cwd: repopath })
    currentBranch = out.trim()

    const expectedBranch = 'add-' + username
    if (currentBranch.match(expectedBranch)) {
      counter++
      addToList(i18n.t('verify~Found branch as expected!'), true)
    } else {
      addToList(i18n.t('verify~Branch name expected: {/expectedBranch/}', { expectedBranch }), false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
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
      counter++
      addToList(i18n.t('verify~File in contributors folder!'), true)
    } else {
      addToList(i18n.t('verify~File not found in contributors folder.'), false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    // TODO ENOENT: no such file or directory, scandir '/Users/jlord/jCode/.../contributors/'
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // Check push
  // TODO look into this, is using reflog the best way? what about origin?
  // sometimes it seems this doesn't work
  try {
    const out = execGit('reflog show origin/' + currentBranch, { cwd: repopath })
    const log = out.trim()

    if (log.match('update by push')) {
      counter++
      addToList(i18n.t('verify~Changes have been pushed!'), true)
    } else {
      addToList(i18n.t('verify~Changes not pushed.'), false)
      helper.challengeIncomplete()
    }
  } catch (err) {
    console.log(err.message)
    addToList(i18n.t('verify~Changes not pushed.'), false)
    return helper.challengeIncomplete()
  }

  if (counter === total) {
    markChallengeCompleted(currentChallenge)
    userData.updateData(currentChallenge)
  }
}
