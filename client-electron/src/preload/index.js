import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

/**
 * @description 向渲染进程暴露的API
 */
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateAppName: (callback) => ipcRenderer.on('update-app-name', callback)
})
