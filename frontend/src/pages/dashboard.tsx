import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { Notes } from "@/components/dashboard/notes"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  lastSignIn?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getProfile()
        if (response.success) {
          setUser(response.user)
        } else {
          toast.error("Failed to load profile")
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@')
    const maskedUsername = username.slice(0, 2) + 'x'.repeat(Math.max(username.length - 2, 4))
    const [domainName, extension] = domain.split('.')
    const maskedDomain = domainName.slice(0, 1) + 'x'.repeat(Math.max(domainName.length - 1, 3))
    return `${maskedUsername}@${maskedDomain}.${extension}`
  }

  if (loading) {
    return (
      <main className="min-h-[100svh] bg-background">
        <div className="mx-auto w-full max-w-md px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-[100svh] bg-background">
        <div className="mx-auto w-full max-w-md px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Failed to load profile</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] bg-background">
      <div className="mx-auto w-full max-w-md px-4">
        <DashboardHeader />
        <div className="space-y-4 pb-12">
          <WelcomeCard 
            name={user.name} 
            emailMasked={maskEmail(user.email)} 
          />
          <Notes />
        </div>
      </div>
    </main>
  )
}
