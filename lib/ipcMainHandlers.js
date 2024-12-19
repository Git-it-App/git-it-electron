/*
 * Runs in: Main-Process
 * Registers & Handles all ipc-Triggered Procedures
 * Done in extra-file to keep main.js neat.
 */

const fs = require('fs')
const electron = require('electron')
const ipcMain = electron.ipcMain
const dialog = electron.dialog

// i18n-defaultOptions for Interpolation
const { i18nDefaultOptions } = require('../config/i18next.config.js')

/**
 * Validate sender according to electron recommendations.
 * @param {WebFrameMain} frame
 * @returns Boolean Valid.
 */
function validateSender (frame) {
  // Block everything coming from the outside, internal sender has no host.
  if ((new URL(frame.url)).host === '') return true
  return false
}

/**
 * Register Handlers for IPC
 */
function registerIpcHandlers (mainWindow, userDataPath) {
  /************************
   * Provide Data to Renderer
   ************************/

  /**
   * Provide userDataPath to Renderer (resp. to lib/user-data.js)
   */
  ipcMain.on('getUserDataPath', event => {
    if (!validateSender(event.senderFrame)) return null
    event.returnValue = userDataPath
  })

  /************************
   * Provide I18n-Data to Renderer
   * Some kind of a strange construct, but such there is only one i18n-Object on the main process no remote module is necesssary.
   ************************/

  /**
   * Provide translated text
   */
  ipcMain.on('i18n.t', (event, data, options) => {
    if (!validateSender(event.senderFrame)) return null
    event.returnValue = global.i18n.t(data, { ...i18nDefaultOptions, ...options })
  })
  /**
   * Provide current language
   */
  ipcMain.on('i18n.language', (event) => {
    if (!validateSender(event.senderFrame)) return null
    event.returnValue = global.i18n.language
  })
  /**
   * Change current language
   */
  ipcMain.on('i18n.changeLanguage', (event, newLang) => {
    if (!validateSender(event.senderFrame)) return null
    global.i18n.changeLanguage(newLang)
  })

  /************************
   * Show User Dialogs
   ************************/

  /**
   * Show Directory-select window if called
   */
  ipcMain.on('dialog-selectDir', event => {
    if (!validateSender(event.senderFrame)) return null
    const path = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] })
    if (path) {
      event.sender.send('confirm-selectDir', path[0])
    }
  })

  /**
   * ClearAll Dialog
   */
  ipcMain.on('dialog-clearAll', event => {
    if (!validateSender(event.senderFrame)) return null
    const dialogOptions = {
      type: 'info',
      title: global.i18n.t('Confirm Clearing Statuses'),
      message: global.i18n.t('Are you sure you want to clear the status for every challenge?'),
      buttons: [global.i18n.t('Yes'), global.i18n.t('No')],
      defaultId: 0,
      cancelId: 1
    }

    const resp = dialog.showMessageBoxSync(dialogOptions)
    if (resp === 0) {
      event.sender.send('confirm-clearAll')
    }
  })

  /************************
   * JSON File Operations
   ************************/

  /**
   * Async write Data as JSON to file
   */
  ipcMain.handle('fs-writeAsJson', async (event, file, data) => {
    if (!validateSender(event.senderFrame)) return null
    return new Promise((resolve, reject) => {
      fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })

  /**
   * Async read of JSON Data
   */
  ipcMain.handle('fs-readFromJson', async (event, file) => {
    if (!validateSender(event.senderFrame)) return null
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(JSON.parse(data))
      })
    })
  })
}

exports.registerIpcHandlers = registerIpcHandlers
