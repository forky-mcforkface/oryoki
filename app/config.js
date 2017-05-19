const fs = require('fs')
const {app, dialog} = require('electron')

var paths = {}
var preferences = null
var searchDictionary = null
var factory = null

exports.init = function () {
  // Check paths for the app
  // Storing in ~/Library/Application Support/Oryoki | Electron

  paths.conf = app.getPath('appData') + '/' + app.getName()
  // Check App Data dir
  try {
    fs.statSync(paths.conf)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('[config] Creating app data directory')
      fs.mkdirSync(paths.conf)
    } else {
      throw e
    }
  }

  paths.tmp = paths.conf + '/' + 'Temporary'
  // Check Temporary dir
  try {
    fs.statSync(paths.tmp)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('[config] Creating tmp directory')
      fs.mkdirSync(paths.tmp)
    } else {
      throw e
    }
  }

  console.log('[config] Paths okay')

  // Load files or create them from factory if they don't exist
  preferences = getConfFile('oryoki-preferences.json')
  searchDictionary = getConfFile('search-dictionary.json')

  // Verify data model versions
  verify()

  // Watch files for changes
  // watch()
}

function getConfFile (fileName, callback) {
  console.log('[config] Getting conf file: ' + fileName)
  try {
    // Erase comments to validate JSON
    var raw = fs.readFileSync(paths.conf + '/' + fileName, 'utf8')
    var re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
    var stripped = raw.replace(re, '')

    return JSON.parse(stripped)
  } catch (e) {
    console.log('[config] Error getting ' + fileName + ' : ' + e)

    if (e.code === 'ENOENT') {
      console.log('[config] Creating file: ' + fileName)
      fs.writeFileSync(paths.conf + '/' + fileName, fs.readFileSync(__dirname + '/data/factory.json', 'utf8'))
    } else {
      throw e
    }
  }
}

function watch () {
  fs.watchFile(paths.conf + '/' + 'oryoki-preferences.json', function () {
    preferences = getConfFile('oryoki-preferences.json')
    try {
      // CommandManager.refreshMenus()
      new Notification('Ready to go!', {
        body: 'The preferences were updated.',
        silent: true
      })
    } catch (e) {
      console.log('[config] ' + e)
    }
  }.bind(this))

  fs.watchFile(this.paths.conf + '/' + 'search-dictionary.json', function () {
    searchDictionary = getConfFile('search-dictionary.json')
    // Update accross all windows
    try {
      // for (var i = 0; i < Oryoki.windows.length; i++) {
      //   Oryoki.windows[i].updateConfFiles()
      // }
    } catch(e) {
      console.log('[config] ' + e)
    }

    new Notification('Ready to go!', {
      body: 'The search dictionary was updated.',
      silent: true
    })
  }.bind(this))
}

function verify () {
  console.log('[config] Preference model v. ' + preferences['model_version'])

  if (preferences['model_version'] !== app.getVersion()) {
    console.log('[config] Using a different model. Latest is ' + app.getVersion())

    dialog.showMessageBox(
      {
        type: 'info',
        message: 'Preference model outdated.',
        detail: 'Reset the preferences to use new features.',
        buttons: ['Reset', 'Continue Anyway'],
        defaultId: 0
      },
      function (buttonId) {
        if (buttonId == 0) reset('Preferences', 'oryoki-preferences.json', 'factory.json')
      }.bind(this)
    )
  }
}










// init (name, factory) {
//   this.name = name
//   this.factory = factory
//   this.paths = {}

//   // Storing in ~/Library/Application Support/Oryoki | Electron

//   this.paths.conf = app.getPath('appData') + '/' + app.getName()
//   // Check App Data dir
//   try {
//     fs.statSync(this.paths.conf)
//   } catch (e) {
//     if (e.code === 'ENOENT') {
//       console.log('[User] Creating App Data directory')
//       fs.mkdirSync(this.paths.conf)
//     } else {
//       throw e
//     }
//   }

//   this.paths.tmp = this.paths.conf + '/' + 'Temporary'
//   // Check Temporary dir
//   try {
//     fs.statSync(this.paths.tmp)
//   } catch (e) {
//     if (e.code === 'ENOENT') {
//       console.log('[User] Creating tmp directory')
//       fs.mkdirSync(this.paths.tmp)
//     } else {
//       throw e
//     }
//   }

//   // Load files or create them from factory if they don't exist
//   this.preferences = this.getConfFile('oryoki-preferences.json', this.createPreferences.bind(this))
//   this.searchDictionary = this.getConfFile('search-dictionary.json', this.createSearchDictionary.bind(this))

//   // Watch files for changes
//   fs.watchFile(this.paths.conf + '/' + 'oryoki-preferences.json', function () {
//     this.onPreferencesChange()
//     try {
//       CommandManager.refreshMenus()
//       new Notification('Ready to go!', {
//         body: 'The preferences were updated.',
//         silent: true
//       })
//     } catch (e) {
//       // @if NODE_ENV='development'
//       c.log('[User] ' + e)
//       // @endif
//     }

//   }.bind(this))

//   fs.watchFile(this.paths.conf + '/' + 'search-dictionary.json', function () {
//     this.onSearchDictionaryChange()

//     new Notification('Ready to go!', {
//       body: 'The search dictionary was updated.',
//       silent: true
//     })
//   }.bind(this))

//   // @if NODE_ENV='development'
//   if (this.preferences) { c.log('[User] Preference model v. ' + this.preferences['model_version']) }
//   // @endif

//   if (this.preferences) {
//     if (this.preferences['model_version'] !== app.getVersion()) {
//       // @if NODE_ENV='development'
//       c.log('[User] Using a different model. Latest is ' + app.getVersion())
//       // @endif

//       dialog.showMessageBox(
//         {
//           type: 'info',
//           message: 'Preference model outdated.',
//           detail: 'Reset the preferences to use new features.',
//           buttons: ['Reset', 'Continue Anyway'],
//           defaultId: 0
//         },
//         function (buttonId) {
//           if (buttonId == 0) this.resetFile('Preferences', 'oryoki-preferences.json', 'factory.json')
//         }.bind(this)
//       )
//     }
//   }

//   // Init conf file
//   // this.onPreferencesChange()
//   // this.onSearchDictionaryChange()
// }

// onPreferencesChange () {
//   // @if NODE_ENV='development'
//   c.log('[User] Preferences have changed')
//   // @endif

//   this.preferences = this.getConfFile('oryoki-preferences.json', this.createPreferences.bind(this))

//   /* WEB PLUGINS */

//   if (this.getPreferenceByName('web_plugins_path') != '') {
//     // Path is set
//     this.paths.webPlugins = this.getPreferenceByName('web_plugins_path')
//   } else {
//     this.paths.webPlugins = this.paths.conf + '/' + 'Web Plugins'
//   }

//   // Check Web Plugins paths
//   try {
//     fs.statSync(this.paths.webPlugins)
//   } catch (e) {
//     if (e.code === 'ENOENT') {
//       // @if NODE_ENV='development'
//       c.log('[User] Creating web plugins directory')
//       // @endif
//       fs.mkdirSync(this.paths.webPlugins)
//     } else {
//       throw e
//     }
//   }

//   /* PICTURE IN PICTURE */

//   try {
//     Oryoki.focusedWindow.browser.setFullScreenable(!this.getPreferenceByName('picture_in_picture'))
//   } catch(e) {
//     // @if NODE_ENV='development'
//     c.log('[User] ' + e)
//     // @endif
//   }
// }

// onSearchDictionaryChange () {
//   // @if NODE_ENV='development'
//   c.log('[User] Search dictionary has changed')
//   // @endif
//   this.searchDictionary = this.getConfFile('search-dictionary.json', this.createSearchDictionary.bind(this))

//   // Update accross all windows
//   try {
//     for (var i = 0; i < Oryoki.windows.length; i++) {
//       Oryoki.windows[i].updateConfFiles()
//     }
//   } catch(e) {
//     // @if NODE_ENV='development'
//     c.log('[User] ' + e)
//     // @endif
//   }
// }

// getConfFile (fileName, callback) {
//   // @if NODE_ENV='development'
//   c.log('[User] Getting conf file: ' + fileName)
//   // @endif

//   try {
//     // Erase comments to validate JSON
//     var raw = fs.readFileSync(this.paths.conf + '/' + fileName, 'utf8')
//     var re = /(^\/\/|^\t\/\/).*/gm // Any line that starts with `//` or with a tab followed by `//`
//     var stripped = raw.replace(re, '')

//     return JSON.parse(stripped)
//   } catch (e) {
//     // @if NODE_ENV='development'
//     c.log('[User] Error getting ' + fileName + ' : ' + e)
//     // @endif

//     if (e.code === 'ENOENT') {
//       // @if NODE_ENV='development'
//       c.log('[User] Creating file: ' + fileName)
//       // @endif
//       callback()
//     } else {
//       throw e
//     }
//   }
// }

// createPreferences () {
//   fs.writeFileSync(this.paths.conf + '/' + 'oryoki-preferences.json', fs.readFileSync(__dirname + '/data/factory.json', 'utf8'))
// }

// createSearchDictionary () {
//   fs.writeFileSync(this.paths.conf + '/' + 'search-dictionary.json', fs.readFileSync(__dirname + '/data/search-dictionary.json', 'utf8'))
// }

// getPreferenceByName (name) {
//   /*
//   Checks user for preference
//   If not defined, falls back to factory setting.
//   */
//   if (this.preferences[name] !== undefined) {
//     return this.preferences[name]
//   } else {
//     return this.factory.preferences[name]
//   }
// }

// resetFile (niceName, fileName, factoryName) {
//   fs.writeFile(this.paths.conf + '/' + fileName, fs.readFileSync(__dirname + '/data/' + factoryName, 'utf8'), function (e) {
//     // @if NODE_ENV='development'
//     if (e) c.log(e)
//     // @endif
//     try {
//       Oryoki.focusedWindow.browser.webContents.send('log-status', {
//         'body': niceName + ' reset'
//       })
//     } catch(e) {
//       // @if NODE_ENV='development'
//       c.log('[User] ' + e)
//       // @endif
//     }
//   })
// }