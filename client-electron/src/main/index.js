import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './windowManager'
import { setupTaskManager } from './taskManager'
import { gconfig, store } from './electron.store'

let taskIntervalId

function startTaskWithConfig(config) {
  if (taskIntervalId) {
    clearInterval(taskIntervalId)
  }
  taskIntervalId = setupTaskManager(config)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  startTaskWithConfig(gconfig)
  createWindow(gconfig)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('setStore', (_, key, value) => {
  store.set(key, value)
  let newConfig = store.get('gconfig')
  Object.assign(gconfig, newConfig)
  startTaskWithConfig(gconfig)
})

ipcMain.on('getStore', (event, key) => {
  let value = store.get(key)
  event.returnValue = value || 'nonono'
})
