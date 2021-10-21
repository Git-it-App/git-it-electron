/*
 * Runs in: Main-Process
 * Registers & Handles all ipc-Triggered Procedures
 * Done in extra-file to keep main.js neat.
 */

const fs = require('fs')
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

  /************************
   * JSON File Operations
   ************************/

  /**
   * Async write Data as JSON to file
   */
  ipcMain.handle('fs-writeAsJson', async (event, file, data) => {
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
