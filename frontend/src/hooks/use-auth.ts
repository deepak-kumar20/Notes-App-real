import { useState, useEffect } from 'react'

// Custom hook for authentication state
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken')
        const isAuth = localStorage.getItem('isAuthenticated')
        const authStatus = !!(token && isAuth === 'true')
        
        setIsAuthenticated(authStatus)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Check auth status on mount
    checkAuth()

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'isAuthenticated') {
        checkAuth()
      }
    }

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('storage', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('storage', handleCustomStorageChange)
    }
  }, [])

  return { isAuthenticated, isLoading }
}
