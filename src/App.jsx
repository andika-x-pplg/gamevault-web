import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import { LibraryProvider } from './context/LibraryContext'
import { ToastProvider } from './context/ToastContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <GameProvider>
            <LibraryProvider>
              <AppRoutes />
            </LibraryProvider>
          </GameProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
