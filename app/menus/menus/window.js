const windows = require('./../../windows')

module.exports = function () {
  const submenu = [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize' // Also adds Minimize All
      },
      {
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Float on Top',
        type: 'checkbox',
        click: function (item, win) {
          if (win) {
            // console.log(win.id)
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Window Helper',
        accelerator: 'CmdOrCtrl+Alt+M',
        type: 'checkbox',
        click () {
          
        }
      },
      {
        label: 'Size',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Cycle Through Windows',
        accelerator: 'Ctrl+Tab',
        // accelerator: 'CmdOrCtrl+`',
        click () {
          windows.cycle()
        }
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      },
      {
        type: 'separator'
      }
  ]

  return {
    label: 'Window',
    role: 'window',
    submenu
  }
}