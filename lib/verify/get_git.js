const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// TODO
// Think about how best to show errors to user

module.exports = function () {
  const result = getEmptyVerifyResult()

  // Check version, return if no git installed, as further checks are useless.
  try {
    const gitOutput = execGit('--version')

    if (gitOutput.match('git version')) {
      addToVerifyList(result.verifyList, true, 'verify~Found Git installed!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~Did not find Git installed.')
      return result
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, false, 'verify~Did not find Git installed.')
    return result
  }

  // Check user.name
  try {
    const name = execGit('config user.name')

    if (name !== '') {
      addToVerifyList(result.verifyList, true, 'verify~Name Added!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~No name found.')
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, false, 'verify~No name found.')
  }

  // Check user.email
  try {
    const email = execGit('config user.email')

    if (email !== '') {
      addToVerifyList(result.verifyList, true, 'verify~Email Added!')
    } else {
      addToVerifyList(result.verifyList, false, 'verify~No email found.')
    }
  } catch (err) {
    console.log(err)
    addToVerifyList(result.verifyList, false, 'verify~No email found.')
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
