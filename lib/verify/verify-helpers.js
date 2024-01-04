/*
 * Helpers for challenge-specific verification-scripts
 */

const { exec } = require('child_process')
const { promisify } = require('util')
const execPromise = promisify(exec)

// Set process to use english language (necessary for text verification)
process.env.LANG = 'C'

/*
 * Add a formatted object to given verifyList.
 * Some kind of strange argument sorting: Message first, for easy parsing, data last for optional argument.
 */
function addToVerifyList (message, pass, list, data = {}) {
  list.push({
    pass,
    message,
    data
  })
}

/*
 * Checks if a challenge is complete, by reducing the pass-states of verifyList
 */
function checkChallengeComplete (verifyList) {
  return verifyList.reduce((complete, listItem) => {
    return complete && listItem.pass
  }, true)
}

/*
 * Wrapper to the exec call used in each of the verify scripts.
 */
async function execGit (command, options = {}) {
  // Encoding utf8 for usable output
  Object.assign(options, {
    encoding: 'utf8'
  })

  // Use system-Git to execute command, trim output
  const execResult = await execPromise('git  ' + command, options)
  return execResult.stdout.trim()
}

/*
 * Returns an empty verify-Result template.
 */
function getEmptyVerifyResult () {
  return {
    challengeComplete: false,
    verifyList: []
  }
}

exports.addToVerifyList = addToVerifyList
exports.checkChallengeComplete = checkChallengeComplete
exports.execGit = execGit
exports.getEmptyVerifyResult = getEmptyVerifyResult
