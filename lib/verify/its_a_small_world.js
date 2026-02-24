const axios = require('axios')
const ipc = require('electron').ipcRenderer
const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

const url = 'https://collaborators.repocatbot.workers.dev'
// const url = 'http://localhost:8787/'

module.exports = async function () {
  const result = getEmptyVerifyResult()
  let username = ''

  // Get stored username
  try {
    username = await execGit('config user.username')
  } catch (err) {
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
    return result
  }

  // Loard username art
  const art = await ipc.invoke('figlet.createArt', username)

  // Call repocatbot to check the collaborators access.
  try {
    const response = await axios.post(url, {
      username,
      art
    })

    if (response.data.catStatus === 200) {
      addToVerifyList('verify~Repocatbot has accepted your invitation!', true, result.verifyList)
    } else if (response.data.catStatus === 412) {
      // Precondition failed on user side. Repocatbot gives a specific message.
      console.debug(response.data.message, response.data.err)
      switch (response.data.messageId) {
        case 'collab_412/1':
          addToVerifyList('verify~Repocatbot: I could not find your invitation!', false, result.verifyList)
          break
        case 'collab_412/2':
          addToVerifyList('verify~Repocatbot: I could not find your branch or file!', false, result.verifyList)
          break
        case 'collab_412/3':
          addToVerifyList('verify~Repocatbot: I could not find your branch!', false, result.verifyList)
          break
        case 'collab_412/4':
          addToVerifyList('verify~Repocatbot: I could not find your file!', false, result.verifyList)
          break
        case 'collab_412/5':
          addToVerifyList('verify~Repocatbot: Do you only have your username in the file?', false, result.verifyList)
          break
        default:
          addToVerifyList(response.data.message, false, result.verifyList)
      }
    } else {
      console.error('Unknown status received', response)
      throw (new Error('Unknown status received'))
    }
  } catch (err) {
    console.error('Error: ' + err.message, err.response)
    addToVerifyList('Error: ' + err.message, false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
