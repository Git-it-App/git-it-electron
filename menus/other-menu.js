const path = require('path')

module.exports = function menu (app, mainWindow, i18n) {
  const otherMenu = [
    {
      label: i18n.t('menu~&File'),
      submenu: [
        {
          label: i18n.t('menu~&Quit'),
          role: 'quit'
        }
      ]
    },
    {
      label: i18n.t('menu~View'),
      submenu: [
        {
          label: i18n.t('menu~Reload'),
          role: 'reload'
        },
        {
          label: i18n.t('menu~Full Screen'),
          role: 'togglefullscreen'
        },
        {
          label: i18n.t('menu~Minimize'),
          role: 'minimize'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Toggle Developer Tools'),
          role: 'toggleDevTools'
        }
      ]
    },
    {
      label: i18n.t('menu~Window'),
      submenu: [
        {
          label: i18n.t('menu~Home'),
          click: function () {
            const filepath = path.normalize(path.join(__dirname, '..', 'built', 'pages', 'index.html'))
            mainWindow.loadFile(filepath)
          }
        },
        {
          label: i18n.t('menu~Dictionary'),
          click: function () {
            const filepath = path.normalize(path.join(__dirname, '..', 'built', 'pages', 'dictionary.html'))
            mainWindow.loadFile(filepath)
          }
        },
        {
          label: i18n.t('menu~Resources'),
          click: function () {
            const filepath = path.normalize(path.join(__dirname, '..', 'built', 'pages', 'resources.html'))
            mainWindow.loadFile(filepath)
          }
        }
      ]
    },
    {
      label: i18n.t('menu~Help'),
      submenu: [
        {
          label: i18n.t('menu~App Repository'),
          click: function () {
            require('electron').shell.openExternal('https://github.com/jotoeri/git-it-electron')
          }
        },
        {
          label: i18n.t('menu~Open Issue'),
          click: function () {
            require('electron').shell.openExternal('https://github.com/jotoeri/git-it-electron/issues/new')
          }
        },
        {
          label: i18n.t('menu~About App'),
          click: function () {
            const filepath = path.normalize(path.join(__dirname, '..', 'built', 'pages', 'about.html'))
            mainWindow.loadFile(filepath)
          }
        }
      ]
    }
  ]
  return otherMenu
}
