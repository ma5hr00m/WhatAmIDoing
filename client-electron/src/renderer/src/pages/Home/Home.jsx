import styles from './Home.module.scss'

const Home = () => {
  const openLink = (url) => {
    window.electron.shell.openExternal(url)
  }

  return (
    <div class={styles.root}>
      <div class={styles.helloBox}>
        <p class={styles.titleBox}>
          <img class={styles.logo} src="https://img.ma5hr00m.top/2025/avatar.jpg" alt="logo" />
          <span class={styles.title}>
            WhatAmIDoing
            <span class={styles.version}>0.1.0</span>
          </span>
        </p>
        <p class={styles.description}>
          监测本地用户正在使用什么软件，实时同步到服务端，提供 Web API 供其他服务调用
        </p>
        <p class={styles.linksBox}>
          <a
            class={styles.github}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              openLink('https://github.com/ma5hr00m/WhatAmIDoing')
            }}
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  )
}

export default Home
