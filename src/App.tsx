import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router'
import { Notification } from './shared/components/Notification/Notification'
import GlobalLoader from './shared/components/GlobalLoader/GlobalLoader'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Notification />
      <GlobalLoader />
    </BrowserRouter>
  )
}

export default App
