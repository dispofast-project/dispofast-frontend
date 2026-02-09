import './App.css'
import { Box } from '@mui/material'
import AppRouter from './app/router'

function App() {


  return (
    <Box className="flex h-screen overflow-visible">
      <Box component="div" className="h-full p-8">
        <AppRouter />
      </Box>
    </Box>
  )
}

export default App
