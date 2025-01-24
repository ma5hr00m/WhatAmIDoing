import { createSignal } from 'solid-js'
import styles from './Setting.module.scss'

function Settings() {
  const gconfig = window.api.getStoreValue('gconfig')
  const [serverUrl, setServerUrl] = createSignal(gconfig.serverUrl)
  const [pollingFrequency, setPollingFrequency] = createSignal(gconfig.pollingFrequency)
  const [blacklist, setBlacklist] = createSignal(gconfig.blacklist.join(', '))

  const handleServerUrlSubmit = (e) => {
    e.preventDefault()
    const newConfig = { ...gconfig, serverUrl: serverUrl() }
    window.api.setStoreValue('gconfig', newConfig)
  }

  const handlePollingFrequencySubmit = (e) => {
    e.preventDefault()
    const frequency = parseInt(pollingFrequency(), 10)
    const newConfig = { ...gconfig, pollingFrequency: frequency }
    window.api.setStoreValue('gconfig', newConfig)
  }

  const handleBlacklistSubmit = (e) => {
    e.preventDefault()
    const blacklistArray = blacklist()
      .split(',')
      .map((item) => item.trim())
    const newConfig = { ...gconfig, blacklist: blacklistArray }
    window.api.setStoreValue('gconfig', newConfig)
  }

  return (
    <div class={styles.root}>
      <div class={styles.settingBox}>
        <hgroup>
          <h2>设置</h2>
        </hgroup>
        <div class={styles.formGroup}>
          <h3>服务端地址</h3>
          <form class={styles.serverUrlSubmit} onSubmit={handleServerUrlSubmit}>
            <input
              type="text"
              value={serverUrl()}
              onInput={(e) => setServerUrl(e.target.value)}
              class={styles.inputField}
              spellCheck="false"
            />
            <button type="submit" class={styles.submitButton}>
              提交
            </button>
          </form>
        </div>
        <div class={styles.formGroup}>
          <h3>轮询频率</h3>
          <form class={styles.pollingFrequencySubmit} onSubmit={handlePollingFrequencySubmit}>
            <input
              type="text"
              value={pollingFrequency()}
              onInput={(e) => setPollingFrequency(e.target.value)}
              class={styles.inputField}
              spellCheck="false"
            />
            <button type="submit" class={styles.submitButton}>
              提交
            </button>
          </form>
        </div>
        <div class={styles.formGroup}>
          <h3>应用黑名单</h3>
          <form class={styles.blacklistSubmit} onSubmit={handleBlacklistSubmit}>
            <textarea
              value={blacklist()}
              onInput={(e) => setBlacklist(e.target.value)}
              class={styles.textareaField}
              spellCheck="false"
            />
            <button type="submit" class={styles.submitButton}>
              提交
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
