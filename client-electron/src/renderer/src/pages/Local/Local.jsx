import { createEffect } from 'solid-js'
import styles from './Local.module.scss'

const Local = (props) => {
  // eslint-disable-next-line solid/reactivity
  const appData = props.appData

  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  createEffect(() => {
    const applicationValue = appData().application
    console.log(applicationValue)
  })

  return (
    <div class={styles.root}>
      {/* <div class="ipc">
        <button onClick={ipcHandle}>Ping</button>
      </div> */}
      <div class={styles.action}>
        <hgroup>
          <h2>本地数据</h2>
        </hgroup>
        <ul class={styles.statusLists}>
          <li id="app-data">
            <span class="key">活动应用</span>
            <span class="value">{appData().application}</span>
          </li>
          {/* <p id="timestamp">时间戳{appData().timestamp}</p> */}
          <li id="time">
            <span class="key">时间</span>
            <span class="value">{appData().time}</span>
          </li>
          <li id="lastRequestSuccess">
            <span class="key">最近一次同步数据是否成功</span>
            <span class={appData().lastRequestSuccess ? styles.success : styles.failed}>
              {appData().lastRequestSuccess ? 'success' : 'failed'}
            </span>
          </li>
          <li id="timeSinceLastSuccess">
            <span class="key">距离最近成功同步数据时间</span>
            <span class="value">{appData().timeSinceLastSuccess}</span>
          </li>
          <li id="active">
            <span class="key">计时器状态</span>
            <span class={appData().active ? styles.success : styles.failed}>
              {appData().active ? 'running' : 'stopped'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Local
