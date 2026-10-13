import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthPage } from './pages/auth/AuthPage'
import { MainWorkspace } from './pages/dashboard/MainWorkspace'

function AppContent() {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <MainWorkspace /> : <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
