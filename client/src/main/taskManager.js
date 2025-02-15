import { ipcMain, BrowserWindow, app } from 'electron'
import axios from 'axios'
const koffi = require('koffi')

let lastAppName = ''
let lastSuccessTimestamp = 0
let lastRequestSuccess = false
let isTimerActive = false

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  // const year = date.getFullYear()
  // const month = String(date.getMonth() + 1).padStart(2, '0')
  // const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}时${minutes}分${seconds}秒`
}

function formatTimeDifference(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}时${String(minutes).padStart(2, '0')}分${String(seconds).padStart(2, '0')}秒`
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

function sendDataToServer(serverUrl, appName) {
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

export function setupTaskManager(props) {
  // eslint-disable-next-line solid/reactivity
  const userTracking = koffi.load(props.trackingDllPath)
  const GetActiveWindowAppName = userTracking.func(
    '__stdcall',
    'GetActiveWindowAppName',
    'string',
    []
  )
  // eslint-disable-next-line solid/reactivity
  const serverApi = props.serverUrl + '/status/update'
  // eslint-disable-next-line solid/reactivity
  const pollingFrequency = props.pollingFrequency

  ipcMain.on('ping', () => console.log('pong'))

  const startTask = () => {
    isTimerActive = true
    const intervalId = setInterval(async () => {
      const appName = GetActiveWindowAppName()
      if (typeof appName === 'string' && appName.length > 0) {
        if (appName !== lastAppName) {
          sendUpdateAppNameMessage(appName)
          sendDataToServer(serverApi, appName)
          lastAppName = appName
        }
      } else {
        console.error('Failed to get active window app name.')
      }
    }, pollingFrequency)
    return intervalId
  }

  const stopTask = () => {
    isTimerActive = false
  }

  app.on('window-all-closed', stopTask)
  app.on('before-quit', stopTask)

  return startTask()
}
