import { createSignal } from 'solid-js'
import styles from './GMenu.module.scss'

const GMenu = () => {
  const [isFullScreen, setIsFullScreen] = createSignal(false)

  const handleClose = () => {
    window.electron.ipcRenderer.send('window-close')
  }

  const handleMinimize = () => {
    window.electron.ipcRenderer.send('window-minimize')
  }

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen())
    window.electron.ipcRenderer.send('window-fullscreen', isFullScreen())
  }

  const handleMinimizeToTray = () => {
    window.electron.ipcRenderer.send('window-minimize-to-tray')
  }

  return (
    <div class={styles.gmenu}>
      <div class={styles.menu}>
        <div class={styles.titleBox}>
          <img class={styles.logo} src="https://img.ma5hr00m.top/2025/avatar.jpg" alt="logo" />
          <span class={styles.title}>WhatAmIDoing</span>
        </div>
      </div>
      <div class={styles.windowControls}>
        <button onClick={handleMinimizeToTray}>T</button>
        <button onClick={handleFullScreen} disabled>
          {isFullScreen() ? 'F' : 'M'}
        </button>
        <button onClick={handleMinimize}>H</button>
        <button onClick={handleClose}>C</button>
      </div>
    </div>
  )
}

export default GMenu
