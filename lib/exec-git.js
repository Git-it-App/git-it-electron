/*
 * This file is a wrapper to the exec call used in each of the verify scripts.
 */
const path = require('path')
const execSync = require('child_process').execSync

module.exports = function execGit (command, options = {}) {
  // Encoding utf8 for usable output
  Object.assign(options, {
    encoding: 'utf8'
  })

  // Use system-Git to execute command
  return execSync('git  ' + command, options)
}

// TODO MOVE TO VERIFY HELPERS