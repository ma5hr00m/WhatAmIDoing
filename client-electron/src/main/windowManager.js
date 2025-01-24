import { ipcMain, BrowserWindow, shell, Tray } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    resizable: false,
    backgroundColor: '#00000000',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  const path = require('path')
  const imagePath = path.join(__dirname, '../../public/icon.jpg')
  let tray = new Tray(imagePath)
  tray.on('click', () => {
    mainWindow.show()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 关闭
  ipcMain.on('window-close', () => {
    mainWindow.close()
  })

  // 隐藏，不单独使用，与隐藏到托盘栏区分
  // ipcMain.on('window-hide', () => {
  //   mainWindow.hide()
  // })

  // 最小化
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  // 全屏
  ipcMain.on('window-fullscreen', (event, isFullScreen) => {
    mainWindow.setFullScreen(isFullScreen)
  })

  // 隐藏到托盘栏
  ipcMain.on('window-minimize-to-tray', () => {
    mainWindow.hide()
    if (!tray) {
      tray = new Tray(imagePath)
    }
    tray.on('click', () => {
      mainWindow.show()
      mainWindow.setSkipTaskbar(false)
    })
    mainWindow.setSkipTaskbar(true)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
