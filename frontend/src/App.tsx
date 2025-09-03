import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SigninPage from './pages/signin'
import SignupPage from './pages/signup'
import DashboardPage from './pages/dashboard'
import { ProtectedRoute } from './components/protected-route'
import { AuthRedirect } from './components/auth-redirect'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className="font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={
            <AuthRedirect>
              <SigninPage />
            </AuthRedirect>
          } />
          <Route path="/signup" element={
            <AuthRedirect>
              <SignupPage />
            </AuthRedirect>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
