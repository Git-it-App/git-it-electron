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

/****
 * user-data.json
 */
// Returns either an object out of all challengesData-objects or if called with parameter the object to the given challenge.
function getChallengeData (challenge = null) {
  if (challenge) {
    return JSON.parse(fs.readFileSync(userDataFile))[challenge]
  }
  return JSON.parse(fs.readFileSync(userDataFile))
}
// Set given challenge completed-status
function setChallengeCompleted (challenge, completed) {
  const data = getChallengeData()
  data[challenge].completed = completed
  writeData(userDataFile, data)
}
// Clear all challenges - Set all challenges as incomplete
function clearAllChallenges () {
  const data = getChallengeData()
  Object.keys(data).forEach(challenge => {
    data[challenge].completed = false
  })
  writeData(userDataFile, data)
}

/****
 * saved-dir.json
 */
function getSavedDir () {
  return JSON.parse(fs.readFileSync(savedDirFile))
}
function updateSavedDir (path) {
  const data = getSavedDir()
  data.savedDir = path
  writeData(savedDirFile, data)
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
exports.setChallengeCompleted = setChallengeCompleted
exports.clearAllChallenges = clearAllChallenges
exports.getSavedDir = getSavedDir
exports.updateSavedDir = updateSavedDir
