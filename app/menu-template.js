const {app} = require('electron')
const updater = require('./updater')

const about = require('./about')
const windows = require('./windows')

module.exports = function () {
  var name = app.getName()
  var version = app.getVersion()

  // Special cases
  var latestVersion = updater.getLatest()
  var updaterStatus = updater.getStatus()
  var updaterMenu = ({
    'update-available': {
      label: 'Download Update',
      click: function () {
        updater.downloadUpdate()
      },
      enabled: true
    },
    'downloading-update': {
      label: 'Downloading Update...',
      click: '',
      enabled: false
    },
    'no-update': {
      label: 'Check for Update',
      click: function () {
        updater.checkForUpdate(true)
      },
      enabled: true
    },
    'update-ready': {
      label: latestVersion ? 'Update to ' + latestVersion.version : 'Quit and Install',
      click: function () {
        updater.quitAndInstall()
      },
      enabled: true
    }
  })[updaterStatus]

  var template = [
    {
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          click: function () {
            about.show()
          }
        },
        {
          label: 'Version ' + version,
          enabled: false
        },
        {
          label: updaterMenu.label,
          click: updaterMenu.click,
          enabled: updaterMenu.enabled
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: function () {
            // if (Oryoki) Oryoki.openFile()
          }
        },
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: function () {
            windows.create()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Close Window',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
  ]

  return template
}