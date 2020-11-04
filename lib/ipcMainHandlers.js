/*
 * Runs in: Main-Process
 * Registers & Handles all ipc-Triggered Procedures
 * Done in extra-file to keep main.js neat.
 */

const electron = require('electron')
const ipcMain = electron.ipcMain
const dialog = electron.dialog

function registerIpcHandlers (mainWindow, userDataPath) {
  /*
  * Provide userDataPath to Renderer (resp. to lib/user-data.js)
  */
  ipcMain.on('getUserDataPath', event => {
    event.returnValue = userDataPath
  })

  /*
  * Select-Directory Window if called
  */
  ipcMain.on('dialog-selectDir', event => {
    const path = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] })
    if (path) {
      event.sender.send('confirm-selectDir', path[0])
    }
  })

  /*
  * ClearAll Dialog
  */
  ipcMain.on('dialog-clearAll', event => {
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
}

exports.registerIpcHandlers = registerIpcHandlers
