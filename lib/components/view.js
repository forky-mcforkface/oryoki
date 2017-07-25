const {remote, ipcRenderer} = require('electron')
const menus = remote.require('./menus')
const config = remote.require('./config')
const rpc = require('../utils/rpc')

let el = null
let webview = null
let frame = null

// utils
let isFirstLoad = true
let zoomIndex = 6
const zoomIncrements = [
  25 / 100,
  33 / 100,
  50 / 100,
  67 / 100,
  75 / 100,
  90 / 100,
  100 / 100,
  110 / 100,
  125 / 100,
  150 / 100,
  175 / 100,
  200 / 100
]

function init() {
  el = document.querySelector('#view')
  frame = document.querySelector('#frame')

  webview = el.appendChild(document.createElement('webview'))
  webview.className = 'webview'

  var webPreferences = 'experimentalFeatures=yes, experimentalCanvasFeatures=yes'
  webview.setAttribute('webPreferences', webPreferences)

  console.log('[view] ✔')
  attachEvents()
}

function attachEvents () {
  // webview events
  webview.addEventListener('load-commit', onLoadCommit)
  webview.addEventListener('page-title-updated', (e) => {
    rpc.emit('view:title-updated', e.title)
  })
  // webview.addEventListener('did-frame-finish-load', onDidFrameFinishLoad)
  // webview.addEventListener('did-finish-load', onDidFinishLoad)
  // webview.addEventListener('did-fail-load', onDidFailLoad)
  // webview.addEventListener('did-get-response-details', onDidGetResponseDetails)
  // webview.addEventListener('dom-ready', onDOMReady)

  // rpc events
  rpc.on('view:load', load)
  rpc.on('view:reload', reload)
  rpc.on('view:hard-reload', reloadIgnoringCache)
  rpc.on('view:navigate-back', navigateBack)
  rpc.on('view:navigate-forward', navigateForward)

  window.addEventListener('resize', resize)
}

function load (url) {
  rpc.emit('status:log', {
    'body': '•••',
    'type': 'loading'
  })

  rpc.emit('omnibox:hide')

  webview.classList.add('show')
  webview.setAttribute('src', url)
}

function resize () {
  frame.style.width = window.innerWidth + 'px'
  frame.style.height = (window.innerHeight - document.querySelector('handle').offsetHeight) + 'px'
}

function onLoadCommit (e) {
  if (isFirstLoad) {
    isFirstLoad = false
    rpc.emit('view:first-load')
    menus.refresh()
  }
  rpc.emit('status:log', {
    'body': '•••',
    'type': 'loading'
  })
  console.log('[view]', 'load-commit', e)
}

function reload () {
  webview.reload()
}

function reloadIgnoringCache () {
  webview.reloadIgnoringCache()
}

function navigateBack () {
  if(webview.canGoBack()) webview.goBack()
}

function navigateForward () {
  if(webview.canGoForward()) webview.goForward()
}

module.exports = {
  init: init,
  load: load
}