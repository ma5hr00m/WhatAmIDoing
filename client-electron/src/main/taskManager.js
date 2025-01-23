import { ipcMain, BrowserWindow, app } from 'electron'
import axios from 'axios'
const koffi = require('koffi')

const userTracking = koffi.load('../../../UserTracking/x64/Release/UserTracking.dll')
const GetActiveWindowAppName = userTracking.func(
  '__stdcall',
  'GetActiveWindowAppName',
  'string',
  []
)
const serverUrl = 'http://localhost:4000/status/update'

let lastAppName = ''
let lastSuccessTimestamp = 0
let lastRequestSuccess = false
let isTimerActive = false

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
}

function formatTimeDifference(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}h-${String(minutes).padStart(2, '0')}m-${String(seconds).padStart(2, '0')}s`
}

function sendUpdateAppNameMessage(appName) {
  const timestamp = Date.now()
  const time = formatTimestamp(timestamp)
  const timeSinceLastSuccess = timestamp - lastSuccessTimestamp
  const formattedTimeSinceLastSuccess = formatTimeDifference(timeSinceLastSuccess)

  const data = {
    application: appName,
    timestamp: timestamp,
    time: time,
    timeSinceLastSuccess: formattedTimeSinceLastSuccess,
    lastRequestSuccess: lastRequestSuccess,
    active: isTimerActive
  }

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('update-app-name', data)
  })
}

function sendDataToServer(appName) {
  const data = {
    application: appName,
    timestamp: Date.now()
  }

  axios
    .post(serverUrl, data)
    .then((response) => {
      console.log('Data sent successfully:', response.data)
      lastSuccessTimestamp = Date.now()
      lastRequestSuccess = true
    })
    .catch((error) => {
      if (error.response) {
        console.error('Server responded with an error status:', error.response.status)
        console.error('Error data:', error.response.data)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error setting up the request:', error.message)
      }
      lastRequestSuccess = false
    })
}

export function setupTaskManager() {
  ipcMain.on('ping', () => console.log('pong'))

  let intervalId

  const startTask = () => {
    isTimerActive = true
    intervalId = setInterval(async () => {
      const appName = GetActiveWindowAppName()
      if (typeof appName === 'string' && appName.length > 0) {
        if (appName !== lastAppName) {
          sendUpdateAppNameMessage(appName)
          sendDataToServer(appName)
          lastAppName = appName
        }
      } else {
        console.error('Failed to get active window app name.')
      }
    }, 250)
  }

  const stopTask = () => {
    isTimerActive = false
    if (intervalId) {
      clearInterval(intervalId)
    }
  }

  app.on('window-all-closed', stopTask)
  app.on('before-quit', stopTask)

  startTask()
}
