/*
 * Runs in: Renderer-Process
 * This file handles the user-data.json and saved-dir.json files
 * Uses electron-remote fs-module to still write out async, even when function gets terminated.
 */
const fs = require('electron').remote.require('fs')
const ipc = require('electron').ipcRenderer

/****
 * user-data.json
 */
function getChallengeData () {
  const data = {}
  data.path = ipc.sendSync('getUserDataPath')
  data.content = JSON.parse(fs.readFileSync(data.path))
  return data
}
// Set given challenge completed-status
function setChallengeCompleted (challenge, completed) {
  const data = getChallengeData()
  data.content[challenge].completed = completed
  writeData(data)
}
// Clear all challenges - Set all challenges as incomplete
function clearAllChallenges () {
  const data = getChallengeData()
  Object.keys(data.content).forEach(challenge => {
    data.content[challenge].completed = false
  })
  writeData(data)
}

/****
 * saved-dir.json
 */
function getSavedDir () {
  const data = {}
  data.path = ipc.sendSync('getUserSavedDir')
  data.content = JSON.parse(fs.readFileSync(data.path))
  return data
}
function updateSavedDir (path) {
  const data = getSavedDir()
  data.content.savedDir = path
  writeData(data)
}

/****
 * Common function
 * Write out data.content to data.path
 * Writes out asynchronously.
 */
function writeData (data) {
  fs.writeFile(data.path, JSON.stringify(data.content, null, 2), (err) => {
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
