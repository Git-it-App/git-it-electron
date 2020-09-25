var fs = require('fs')
var path = require('path')

var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var Menu = electron.Menu
var ipcMain = electron.ipcMain
var dialog = electron.dialog
const { i18nInit } = require('./lib/i18nInit.js')

var darwinTemplate = require('./menus/darwin-menu.js')
var otherTemplate = require('./menus/other-menu.js')

var emptyData = require('./empty-data.json')
var emptySavedDir = require('./empty-saved-dir.json')

var mainWindow = null
var menu = null

var iconPath = path.join(__dirname, '/assets/git-it.png')

app.on('window-all-closed', function appQuit () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', function appReady () {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 980,
    height: 760,
    title: 'Git-it',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // Debug setup
  if (process.env.NODE_ENV === 'debug') {
    mainWindow.maximize()
    mainWindow.webContents.openDevTools()
  }

  // Init i18next Module
  i18nInit()

  var appPath = app.getPath('userData')
  var userDataPath = path.join(appPath, 'user-data.json')
  var userSavedDir = path.join(appPath, 'saved-dir.json')
  // tools for development to prefill challenge completion
  // usage: electron . --none
  //        electron . --some
  //        electron . --all
  if (process.argv[2] === '--none') {
    setAllChallengesUncomplete(userDataPath)
  }
  if (process.argv[2] === '--some') {
    setSomeChallengesComplete(userDataPath)
  }
  if (process.argv[2] === '--all') {
    setAllChallengesComplete(userDataPath)
  }

  // Create 'user-data.json', if not existing.
  fs.access(userDataPath, (err) => {
    if (err) {
      fs.writeFile(userDataPath, JSON.stringify(emptyData, null, ' '), (err) => {
        if (err) return console.log(err)
      })
    }
  })

  // Create 'saved-dir.json', if not existing.
  fs.access(userSavedDir, (err) => {
    if (err) {
      fs.writeFile(userSavedDir, JSON.stringify(emptySavedDir, null, ' '), (err) => {
        if (err) return console.log(err)
      })
    }
  })

  buildMenus()
  mainWindow.loadFile(path.normalize(path.join(__dirname, 'built', 'pages', 'index.html')))

  /*
   * Create ipc listeners
   */
  ipcMain.on('getUserDataPath', function (event) {
    event.returnValue = userDataPath
  })

  ipcMain.on('getUserSavedDir', function (event) {
    event.returnValue = userSavedDir
  })

  ipcMain.on('open-file-dialog', function (event) {
    var files = dialog.showOpenDialogSync(mainWindow, { properties: ['openFile', 'openDirectory'] })
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })

  ipcMain.on('dialog-clearAll', function (event) {
    var options = {
      type: 'info',
      buttons: [global.i18n.t('Yes'), global.i18n.t('No')],
      title: global.i18n.t('Confirm Clearing Statuses'),
      message: global.i18n.t('Are you sure you want to clear the status for every challenge?')
    }
    // TODO Change to promise-based showMessageBox (w/o sync)
    const resp = dialog.showMessageBoxSync(options)
    if (resp === 0) {
      event.sender.send('confirm-clearAll')
    }
  })

  /*
   * Create i18n Listener
   */
  global.i18n.on('languageChanged', () => {
    buildMenus()
    mainWindow.reload()
  })

  /*
   * MainWindow Listener
   */
  mainWindow.on('closed', function winClosed () {
    mainWindow = null
  })
})

function buildMenus () {
  if (process.platform === 'darwin') {
    menu = Menu.buildFromTemplate(darwinTemplate(app, mainWindow, global.i18n))
    Menu.setApplicationMenu(menu)
  } else {
    menu = Menu.buildFromTemplate(otherTemplate(app, mainWindow, global.i18n))
    mainWindow.setMenu(menu)
  }
}

function setAllChallengesComplete (path) {
  var challenges = JSON.parse(fs.readFileSync(path))
  for (var key in challenges) {
    challenges[key].completed = true
  }
  fs.writeFileSync(path, JSON.stringify(challenges), '', null)
}

function setAllChallengesUncomplete (path) {
  var challenges = JSON.parse(fs.readFileSync(path))
  for (var key in challenges) {
    challenges[key].completed = false
  }
  fs.writeFileSync(path, JSON.stringify(challenges), '', null)
}

function setSomeChallengesComplete (path) {
  var counter = 0
  var challenges = JSON.parse(fs.readFileSync(path))
  for (var key in challenges) {
    counter++
    challenges[key].completed = counter < 6
  }
  fs.writeFileSync(path, JSON.stringify(challenges), '', null)
}
