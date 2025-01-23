import { createSignal, onMount } from 'solid-js'
import { A, Router, Route } from '@solidjs/router'
import Home from './pages/Home/Home'
import Local from './pages/Local/Local'
import Server from './pages/Server/Server'
import Setting from './pages/Setting/Setting'
import GMenu from './components/GMenu/GMenu'
import StatusBox from './components/StatusBox/StatusBox'

const App = () => {
  const [appData, setAppData] = createSignal({
    application: 'Hello World',
    timestamp: new Date()
  })

  onMount(() => {
    // eslint-disable-next-line solid/reactivity
    window.electronAPI.onUpdateAppName((event, newAppData) => {
      setAppData(newAppData)
      console.log('newAppData', newAppData)
      console.log(appData().application, appData().timestamp)
    })
  })

  const kinokoApp = (props) => (
    <>
      <GMenu />
      <main>
        <div id="sideBar">
          <nav>
            <A activeClass="activeA" inactiveClass="inactiveA" href="/home">
              主页
            </A>
            <A activeClass="activeA" inactiveClass="inactiveA" href="/local">
              本地
            </A>
            <A activeClass="activeA" inactiveClass="inactiveA" href="/server">
              服务端
            </A>
            <A activeClass="activeA" inactiveClass="inactiveA" href="/settings">
              设置
            </A>
          </nav>
          <div id="statusDock">
            <StatusBox />
          </div>
        </div>
        <div id="workspace">
          <div id="workspaceContent">{props.children}</div>
        </div>
      </main>
    </>
  )

  return (
    <>
      <Router root={kinokoApp}>
        <Route path="/home" component={() => <Home appData={appData} />} />
        <Route path="/local" component={() => <Local appData={appData} />} />
        <Route path="/server" component={Server} />
        <Route path="/settings" component={Setting} />
      </Router>
    </>
  )
}

export default App
