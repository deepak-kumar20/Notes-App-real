import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

interface AuthRedirectProps {
  children: React.ReactNode
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  // If not authenticated, show the auth pages
  return <>{children}</>
}
