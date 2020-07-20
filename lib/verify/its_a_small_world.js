#!/usr/bin/env node

var axios = require('axios')
var path = require('path')
var execGit = require(path.join(__dirname, '../../lib/exec-git.js'))
var helper = require(path.join(__dirname, '../../lib/helpers.js'))
var userData = require(path.join(__dirname, '../../lib/user-data.js'))

var url = 'http://reporobot.jlord.us/collab?username='

var addToList = helper.addToList
var markChallengeCompleted = helper.markChallengeCompleted

var currentChallenge = 'its_a_small_world'

module.exports = async function verifySmallWorldChallenge () {
  let username = ''

  // Get stored username
  try {
    const out = execGit('config user.username')
    username = out.trim()
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }

  // check that they've added RR as a collaborator
  try {
    const response = await axios.get(url + username)

    if (response.status === 200) {
      if (response.data.collab === true) {
        addToList('Reporobot has been added!', true)
        markChallengeCompleted(currentChallenge)
        userData.updateData(currentChallenge)
      } else {
        // If they have a non 200 error, log it so that we can  use
        // devtools to help user debug what went wrong
        if (response.data.error) {
          console.log('StatusCode:', response.status, 'Body:', response.data)
        }
        addToList('Reporobot seems not to have access to your fork.', false)
        helper.challengeIncomplete()
      }
    }
  } catch (err) {
    addToList('Error: ' + err.message, false)
    return helper.challengeIncomplete()
  }
}
