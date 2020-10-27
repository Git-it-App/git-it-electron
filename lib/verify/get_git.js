const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// TODO
// Think about how best to show errors to user

module.exports = function () {
  const result = getEmptyVerifyResult()

  // Check version, return if no git installed, as further checks are useless.
  try {
    const gitOutput = execGit('--version')

    if (gitOutput.match('git version')) {
      addToVerifyList('verify~Found Git installed!', true, result.verifyList)
    } else {
      addToVerifyList('verify~Did not find Git installed.', false, result.verifyList)
      return result
    }
  } catch (err) {
    console.log(err)
    addToVerifyList('verify~Did not find Git installed.', false, result.verifyList)
    return result
  }

  // Check user.name
  try {
    const name = execGit('config user.name')

    if (name !== '') {
      addToVerifyList('verify~Name Added!', true, result.verifyList)
    } else {
      addToVerifyList('verify~No name found.', false, result.verifyList)
    }
  } catch (err) {
    console.log(err)
    addToVerifyList('verify~No name found.', false, result.verifyList)
  }

  // Check user.email
  try {
    const email = execGit('config user.email')

    if (email !== '') {
      addToVerifyList('verify~Email Added!', true, result.verifyList)
    } else {
      addToVerifyList('verify~No email found.', false, result.verifyList)
    }
  } catch (err) {
    console.log(err)
    addToVerifyList('verify~No email found.', false, result.verifyList)
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
