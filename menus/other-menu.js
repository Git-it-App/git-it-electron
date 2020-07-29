var locale = require('../lib/locale.js')
module.exports = function menu (app, mainWindow, i18n) {
  var otherMenu = [
    {
      label: i18n.t('menu~&File'),
      submenu: [
        // {
        //     label: '&Open',
        //     accelerator: 'Ctrl+O'
        // },
        {
          label: i18n.t('menu~&Quit'),
          accelerator: 'Ctrl+Q',
          click: function () {
            app.quit()
          }
        }
      ]
    },
    {
      label: i18n.t('menu~View'),
      submenu: [
        {
          label: i18n.t('menu~Reload'),
          accelerator: 'Command+R',
          click: function (item, focusedWindow) {
            focusedWindow.reload()
          }
        },
        {
          label: i18n.t('menu~Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: function (item, focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        },
        {
          label: i18n.t('menu~Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Bring All to Front'),
          selector: 'arrangeInFront:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Toggle Developer Tools'),
          accelerator: 'Alt+Command+I',
          click: function (item, focusedWindow) {
            focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: i18n.t('menu~Window'),
      submenu: [
        {
          label: i18n.t('menu~Home'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'index.html')
              focusedWindow.loadURL(path)
              // console.log(focusedWindow)
            }
          }
        },
        {
          label: i18n.t('menu~Dictionary'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'dictionary.html')
              focusedWindow.loadURL(path)
            }
          }
        },
        {
          label: i18n.t('menu~Resources'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'resources.html')
              focusedWindow.loadURL(path)
            }
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
            require('electron').shell.openExternal('https://github.com/jlord/git-it-electron')
          }
        },
        {
          label: i18n.t('menu~Open Issue'),
          click: function () {
            require('electron').shell.openExternal('https://github.com/jlord/git-it-electron/issues/new')
          }
        },
        {
          label: i18n.t('menu~About App'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'about.html')
              focusedWindow.loadURL(path)
            }
          }
        }
      ]
    }
  ]
  return otherMenu
}
