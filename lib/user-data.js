/*
 * Runs in: Renderer-Process
 * This file handles the user-data.json and saved-dir.json files
 * Uses electron-remote fs-module to still write out async, even when function gets terminated.
 */
const fs = require('electron').remote.require('fs')
const ipc = require('electron').ipcRenderer
const path = require('path')

const userDataPath = ipc.sendSync('getUserDataPath')
const userDataFile = path.join(userDataPath, 'user-data.json')
const savedDirFile = path.join(userDataPath, 'saved-dir.json')

// Map challenge verify-directories
const verifyDir = {
  repository: 'helloWorld',
  commit_to_it: 'helloWorld',
  remote_control: 'helloWorld',
  forks_and_clones: 'patchwork',
  branches_arent_just_for_birds: 'patchwork',
  pull_never_out_of_date: 'patchwork',
  merge_tada: 'patchwork'
}

/****
 * user-data.json
 */
// Returns either an object out of all challengesData-objects or if called with parameter the object to the given challenge.
function getChallengeData (challenge = null) {
  const fileContent = JSON.parse(fs.readFileSync(userDataFile))
  if (challenge) {
    return fileContent[challenge]
  }
  return fileContent
}
// Store challenge verify-data
function storeChallengeResult (challenge, challengeComplete, verifyList) {
  const fileContent = getChallengeData()
  fileContent[challenge].challengeComplete = challengeComplete
  fileContent[challenge].verifyList = verifyList
  writeData(userDataFile, fileContent)
}
// Clear challenge verify-data
function clearChallengeResult (challenge) {
  const fileContent = getChallengeData()
  fileContent[challenge].challengeComplete = false
  fileContent[challenge].verifyList = []
  writeData(userDataFile, fileContent)
}
// Clear all challenges - Set all challenges as incomplete and clear verifyLists
function clearAllChallenges () {
  const fileContent = getChallengeData()
  Object.keys(fileContent).forEach(challenge => {
    fileContent[challenge].challengeComplete = false
    fileContent[challenge].verifyList = []
  })
  writeData(userDataFile, fileContent)
}

/****
 * saved-dir.json
 */
function getSavedDir (currentChallenge = null) {
  const fileContent = JSON.parse(fs.readFileSync(savedDirFile))
  if (currentChallenge) {
    return fileContent[verifyDir[currentChallenge]]
  }
  return fileContent
}
// Store directory
function updateSavedDir (currentChallenge, path) {
  const fileContent = getSavedDir()
  fileContent[verifyDir[currentChallenge]] = path
  writeData(savedDirFile, fileContent)
}

/****
 * Common function
 * Write out data to file
 * Writes out asynchronously.
 */
function writeData (file, data) {
  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err)
    }
  })
}

exports.getChallengeData = getChallengeData
exports.storeChallengeResult = storeChallengeResult
exports.clearChallengeResult = clearChallengeResult
exports.clearAllChallenges = clearAllChallenges
exports.getSavedDir = getSavedDir
exports.updateSavedDir = updateSavedDir
