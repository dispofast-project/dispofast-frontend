import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router'
import { Notification } from './shared/components/Notification/Notification'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Notification />
    </BrowserRouter>
  )
}

export default App
