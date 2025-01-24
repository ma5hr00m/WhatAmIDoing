import { createSignal } from 'solid-js'
import styles from './StatusBox.module.scss'

function StatusBox() {
  const [versions] = createSignal(window.electron.process.versions)

  return (
    <div class={styles.StatusBox}>
      <p class={styles.status}>Electron v{versions().electron}</p>
      <p class={styles.status}>Chromium v{versions().chrome}</p>
      <p class={styles.status}>Node v{versions().node}</p>
    </div>
  )
}

export default StatusBox
