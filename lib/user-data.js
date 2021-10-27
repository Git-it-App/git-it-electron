/*
 * Runs in: Renderer-Process
 * This file handles the user-data.json and saved-dir.json files
 * Uses electron-remote fs-module to still write out async, even when function gets terminated.
 */
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
async function getChallengeData (challenge = null) {
  const fileContent = await readData(userDataFile)
  if (challenge) {
    return fileContent[challenge]
  }
  return fileContent
}
// Store challenge verify-data
async function storeChallengeResult (challenge, challengeComplete, verifyList) {
  const fileContent = await getChallengeData()
  fileContent[challenge].challengeComplete = challengeComplete
  fileContent[challenge].verifyList = verifyList
  writeData(userDataFile, fileContent)
}
// Clear challenge verify-data
async function clearChallengeResult (challenge) {
  const fileContent = await getChallengeData()
  fileContent[challenge].challengeComplete = false
  fileContent[challenge].verifyList = []
  writeData(userDataFile, fileContent)
}
// Clear all challenges - Set all challenges as incomplete and clear verifyLists
async function clearAllChallenges () {
  const fileContent = await getChallengeData()
  Object.keys(fileContent).forEach(challenge => {
    fileContent[challenge].challengeComplete = false
    fileContent[challenge].verifyList = []
  })
  writeData(userDataFile, fileContent)
}

/****
 * saved-dir.json
 */
async function getSavedDir (currentChallenge = null) {
  const fileContent = await readData(savedDirFile)
  if (currentChallenge) {
    return fileContent[verifyDir[currentChallenge]]
  }
  return fileContent
}
// Store directory
async function updateSavedDir (currentChallenge, path) {
  const fileContent = await getSavedDir()
  fileContent[verifyDir[currentChallenge]] = path
  writeData(savedDirFile, fileContent)
}

/****
 * Common function
 * Write out data to file
 * Writes out asynchronously.
 */
async function writeData (file, data) {
  ipc.invoke('fs-writeAsJson', file, data).then(
    // Resolved
    () => {
      // Silent Handle, everything as expected.
    },
    // Rejected, sth. went wrong.
    (rejectErr) => {
      console.error('Some error occured while writing into', file, rejectErr)
    }
  )
}

/****
 * Common function
 * Read Data from File asynchronously, but wait for returned data.
 */
async function readData (file) {
  try {
    return await ipc.invoke('fs-readFromJson', file)
  } catch (err) {
    console.debug('Some error occured while reading from ', file, err)
    return {}
  }
}

exports.getChallengeData = getChallengeData
exports.storeChallengeResult = storeChallengeResult
exports.clearChallengeResult = clearChallengeResult
exports.clearAllChallenges = clearAllChallenges
exports.getSavedDir = getSavedDir
exports.updateSavedDir = updateSavedDir
