import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LibraryProvider } from './context/LibraryContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <AppRoutes />
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
