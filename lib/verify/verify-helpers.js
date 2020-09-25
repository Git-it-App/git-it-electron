/*
 * Helpers for challenge-specific verification-scripts
 */

// Set each challenge verifying process to use
// English language pack
// Remained from old code... Don't know why to set this. REMOVE, if no complications appear.
// process.env.LANG = 'C'

/*
 * Add a formatted object to given verifyList.
 */
function addToVerifyList (list, message, status) {
  list.push({
    pass: status,
    message
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
exports.getEmptyVerifyResult = getEmptyVerifyResult
