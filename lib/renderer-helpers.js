/*
 * Runs in: Renderer-Process
 *
 * Helpers to be used within renderer-process.
 */

const ipc = require('electron').ipcRenderer

// Just a small wrapper to ease translation-extraction.
function translate (data, options = {}) {
  return ipc.sendSync('i18n.t', data, options)
}

exports.translate = translate
