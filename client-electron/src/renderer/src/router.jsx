import { Route } from '@solidjs/router' // 确保导入语法正确
import Home from './pages/Home/Home' // 确保路径正确
import Setting from './pages/Setting/Setting' // 确保路径正确

function Router() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Setting} />
    </>
  )
}

export default Router
