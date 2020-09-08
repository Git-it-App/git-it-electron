var locale = require('../lib/locale.js')
module.exports = function menu (app, mainWindow, i18n) {
  var darwinMenu = [
    {
      label: 'Git-it',
      submenu: [
        {
          label: i18n.t('menu~About Git-it'),
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Services'),
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Hide Git-it'),
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: i18n.t('menu~Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: i18n.t('menu~Show All'),
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('menu~Quit'),
          accelerator: 'Command+Q',
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
            if (focusedWindow) {
              focusedWindow.reload()
            }
          }
        },
        {
          label: i18n.t('menu~Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
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
              focusedWindow.loadURL('file://' + path)
            }
          }
        },
        {
          label: i18n.t('menu~Dictionary'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'dictionary.html')
              focusedWindow.loadURL('file://' + path)
            }
          }
        },
        {
          label: i18n.t('menu~Resources'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'resources.html')
              focusedWindow.loadURL('file://' + path)
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
            require('electron').shell.openExternal('http://github.com/jotoeri/git-it-electron')
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
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'about.html')
              focusedWindow.loadURL('file://' + path)
            }
          }
        }
      ]
    }
  ]
  return darwinMenu
}
