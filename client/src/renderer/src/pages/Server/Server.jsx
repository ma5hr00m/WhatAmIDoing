import { createSignal } from 'solid-js'
import styles from './Server.module.scss'

function Server() {
  const [inputValue, setInputValue] = createSignal('')
  const [statusCode, setStatusCode] = createSignal('')
  const [pingStatus, setPingStatus] = createSignal('等待测试')

  const synchronizeMap = async () => {
    try {
      const response = await fetch('http://localhost:4000/settings/appinfomap/get')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      if (result.code === '1') {
        setInputValue(JSON.stringify(result.data, null, 2))
        setStatusCode('同步成功！')
      } else {
        setStatusCode('同步失败！')
      }
    } catch (error) {
      setStatusCode('Synchronization failed')
      console.error(error)
    }

    setTimeout(() => {
      setStatusCode('')
    }, 3000)
  }

  const updateMap = async () => {
    try {
      const response = await fetch('http://localhost:4000/settings/appinfomap/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: inputValue()
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      setStatusCode(`Update status: ${result.code}`)
    } catch (error) {
      setStatusCode('Update failed')
      console.error(error)
    }

    setTimeout(() => {
      setStatusCode('')
    }, 3000)
  }

  const checkPing = async () => {
    try {
      const response = await fetch('http://localhost:4000/ping')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      if (result.message === 'Pong!') {
        setPingStatus('Active')
      } else {
        setPingStatus('Inactive')
      }

      setTimeout(() => {
        setPingStatus('等待测试')
      }, 3000)
    } catch (error) {
      setPingStatus('inactive')
      console.error(error)
    }
  }

  return (
    <div class={styles.root}>
      <div class={styles.serverBox}>
        <h2>服务端</h2>
        <div class={styles.appInfoMapBox}>
          <h3>服务端存活检测</h3>
          <form class={styles.appInfoMapTest} onSubmit={(e) => e.preventDefault()}>
            <p>{pingStatus()}</p>
            <button type="button" onClick={checkPing}>
              Ping
            </button>
          </form>
        </div>
        <div class={styles.availabilityBox}>
          <h3>应用信息映射</h3>
          <form class={styles.availabilityTest} onSubmit={(e) => e.preventDefault()}>
            <textarea
              value={inputValue()}
              class={styles.availabilityTextarea}
              onInput={(e) => setInputValue(e.target.value)}
              rows="10"
              cols="50"
              spellCheck="false"
            />
            <div class={styles.availabilityController}>
              <div class={styles.statusBox}>
                <p class={styles.status}>{statusCode()}</p>
              </div>
              <div class={styles.buttonBox}>
                <button class={styles.synchronizeButton} type="button" onClick={synchronizeMap}>
                  同步
                </button>
                <button class={styles.updateButton} type="button" onClick={updateMap}>
                  更新
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Server
