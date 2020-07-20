//
// This file is a wrapper to the exec call used in each of the verify scripts.
// It first checks what operating system is being used and if Windows it uses
// the Portable Git rather than the system Git.
//

var execSync = require('child_process').execSync
var path = require('path')
var os = require('os')

var winGit = path.join(__dirname, '../assets/PortableGit/bin/git.exe')

module.exports = function execGit (command, options = {}) {
  // Encoding utf8 for usable output
  Object.assign(options, {
    encoding: 'utf8'
  })

  // If Windows, use portableGit
  if (os.platform() === 'win32') {
    return execSync('"' + winGit + '" ' + command, options)
  }

  // Else use system-Git
  return execSync('git  ' + command, options)
}
