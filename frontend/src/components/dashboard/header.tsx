"use client"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function DashboardHeader({
  className,
}: {
  className?: string
}) {
  const handleSignOut = async () => {
    try {
      await api.signOut()
      toast.success("Signed out successfully!")
      window.location.href = '/signin'
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error("Failed to sign out. Please try again.")
    }
  }

  return (
    <header className={cn("flex items-center justify-between py-4", className)}>
      <div className="flex items-center gap-2">
            <img src="/images/logo1.png" alt="Logo" className="h-8 w-8" />
        <span className="text-base font-medium">Dashboard</span>
      </div>
      <button 
        onClick={handleSignOut} 
        className="text-md font-semibold text-blue-600 hover:underline underline decoration-1 underline-offset-2 cursor-pointer disabled:cursor-not-allowed" 
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </header>
  )
}
