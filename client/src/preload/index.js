import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  setStoreValue: (key, value) => {
    ipcRenderer.send('setStore', key, value)
  },
  getStoreValue: (key) => {
    return ipcRenderer.sendSync('getStore', key)
  }
}

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

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateAppName: (callback) => ipcRenderer.on('update-app-name', callback)
})
