var locale = require('../lib/locale.js')
module.exports = function menu (app, mainWindow, i18n) {
  var darwinMenu = [
    {
      label: i18n.t('Git-it'),
      submenu: [
        {
          label: i18n.t('About Git-it'),
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('Services'),
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('Hide Git-it'),
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: i18n.t('Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: i18n.t('Show All'),
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('Quit'),
          accelerator: 'Command+Q',
          click: function () {
            app.quit()
          }
        }
      ]
    },
    {
      label: i18n.t('View'),
      submenu: [
        {
          label: i18n.t('Reload'),
          accelerator: 'Command+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload()
            }
          }
        },
        {
          label: i18n.t('Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        },
        {
          label: i18n.t('Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('Bring All to Front'),
          selector: 'arrangeInFront:'
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('Toggle Developer Tools'),
          accelerator: 'Alt+Command+I',
          click: function (item, focusedWindow) {
            focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: i18n.t('Window'),
      submenu: [
        {
          label: i18n.t('Home'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'index.html')
              focusedWindow.loadURL('file://' + path)
            }
          }
        },
        {
          label: i18n.t('Dictionary'),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              var path = require('path').join(locale.getLocaleBuiltPath(locale.getCurrentLocale(focusedWindow)), 'pages', 'dictionary.html')
              focusedWindow.loadURL('file://' + path)
            }
          }
        },
        {
          label: i18n.t('Resources'),
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
      label: i18n.t('Help'),
      submenu: [
        {
          label: i18n.t('App Repository'),
          click: function () {
            require('electron').shell.openExternal('http://github.com/jlord/git-it-electron')
          }
        },
        {
          label: i18n.t('Open Issue'),
          click: function () {
            require('electron').shell.openExternal('https://github.com/jlord/git-it-electron/issues/new')
          }
        },
        {
          label: i18n.t('About App'),
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
