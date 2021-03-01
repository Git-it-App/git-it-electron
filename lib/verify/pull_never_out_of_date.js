const { addToVerifyList, checkChallengeComplete, execGit, getEmptyVerifyResult } = require('./verify-helpers')

// do a fetch dry run to see if there is anything
// to pull; if there is they haven't pulled yet

module.exports = async function (path) {
  const result = getEmptyVerifyResult()

  try {
    const status = await execGit('fetch --dry-run', { cwd: path })

    if (status === '') {
      addToVerifyList('verify~Up to date!', true, result.verifyList)
    } else {
      addToVerifyList('verify~There are changes to pull in.', false, result.verifyList)
    }
  } catch (err) {
    /* i18next-parser-disable-next-line */
    addToVerifyList('Error: {/error/}', false, result.verifyList, { error: err.message })
  }

  result.challengeComplete = checkChallengeComplete(result.verifyList)
  return result
}
