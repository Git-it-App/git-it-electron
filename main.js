const fs = require('fs')
const path = require('path')

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const { i18nInit } = require('./lib/i18nInit.js')
const { registerIpcHandlers } = require('./lib/ipcMainHandlers.js')

const darwinTemplate = require('./menus/darwin-menu.js')
const otherTemplate = require('./menus/other-menu.js')

const emptyUserData = require('./empty-user-data.json')
const emptySavedDir = require('./empty-saved-dir.json')
const GititIcon = path.join(__dirname, '/assets/git-it.png')

const userDataPath = app.getPath('userData')
const userDataFile = path.join(userDataPath, 'user-data.json')
const savedDirFile = path.join(userDataPath, 'saved-dir.json')

let mainWindow = null

app.on('ready', () => {
  // Create main-window and set listener to remove reference after it got closed
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 1100,
    height: 850,
    title: 'Git-it',
    icon: GititIcon,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.on('closed', function winClosed () {
    mainWindow = null
  })

  // Init App-Components
  initUserData()
  i18nInit(buildMenus, mainWindow)
  buildMenus()
  registerIpcHandlers(mainWindow, userDataPath)

  // Debugging-Settings if required
  checkDebugSettings()

  // Open Index-page
  mainWindow.loadFile(path.normalize(path.join(__dirname, 'built', 'pages', 'index.html')))
})

/*
 * Quit app
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/*
 * Create 'user-data.json' and 'saved-dir.json', if not existing.
 */
function initUserData () {
  fs.access(userDataFile, (err) => {
    if (err) {
      fs.writeFile(userDataFile, JSON.stringify(emptyUserData, null, 2), (err) => {
        if (err) return console.log(err)
      })
    }
  })
  fs.access(savedDirFile, (err) => {
    if (err) {
      fs.writeFile(savedDirFile, JSON.stringify(emptySavedDir, null, 2), (err) => {
        if (err) return console.log(err)
      })
    }
  })
}

/*
 * Build the menu from template and set it on application.
 */
function buildMenus () {
  if (process.platform === 'darwin') {
    const menu = Menu.buildFromTemplate(darwinTemplate(mainWindow, global.i18n))
    Menu.setApplicationMenu(menu)
  } else {
    const menu = Menu.buildFromTemplate(otherTemplate(mainWindow, global.i18n))
    mainWindow.setMenu(menu)
  }
}

/*
 * Tools for development
 * - Preset challenge completion
 *   usage: electron . --none
 *          electron . --some
 *          electron . --all
 * - Show devtools in maximized Window
 *   usage: NODE_ENV=debug
 */
function checkDebugSettings () {
  const debugArguments = ['--none', '--some', '--all']

  // Preset challenges
  if (process.argv[2] && debugArguments.includes(process.argv[2])) {
    const userData = JSON.parse(fs.readFileSync(userDataFile))

    if (process.argv[2] === '--none') {
      Object.keys(userData).forEach(challenge => {
        userData[challenge].challengeComplete = false
      })
    }
    if (process.argv[2] === '--some') {
      Object.keys(userData).forEach((challenge, index) => {
        userData[challenge].challengeComplete = index < 6
      })
    }
    if (process.argv[2] === '--all') {
      Object.keys(userData).forEach(challenge => {
        userData[challenge].challengeComplete = true
      })
    }

    fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2))
  }

  // Show devtools
  if (process.env.NODE_ENV === 'debug') {
    mainWindow.maximize()
    mainWindow.webContents.openDevTools()
  }
}
