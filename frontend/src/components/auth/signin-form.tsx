import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, KeyRound } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { GoogleSignInButton } from "./google-signin-button"
import { toast } from "sonner"
import { api } from "@/lib/api"

export function SigninForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [userEmail, setUserEmail] = useState('')
  const [sendingOTP, setSendingOTP] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    if (step === 'email') {
      // Send OTP step
      const email = String(formData.get("email") || "")
      
      if (!email) {
        toast.error("Please enter your email")
        setLoading(false)
        return
      }

      try {
        const result = await api.sendSigninOTP(email)
        if (result.success) {
          setUserEmail(email)
          setStep('otp')
          toast.success("OTP sent to your email!")
        } else {
          toast.error(result.message || "Failed to send OTP")
        }
      } catch (error) {
        console.error("Error sending OTP:", error)
        toast.error("Failed to send OTP. Please try again.")
      }
    } else {
      // Verify OTP step
      const otp = String(formData.get("otp") || "")
      
      if (!otp) {
        toast.error("Please enter the OTP")
        setLoading(false)
        return
      }

      try {
        const result = await api.verifySigninOTP(userEmail, otp)
        if (result.success) {
          toast.success("Signed in successfully!")
          // Navigate to dashboard using React Router
          navigate('/dashboard')
        } else {
          toast.error(result.message || "Invalid OTP")
        }
      } catch (error) {
        console.error("Error verifying OTP:", error)
        toast.error("Failed to verify OTP. Please try again.")
      }
    }
    
    setLoading(false)
  }

  const handleResendOTP = async () => {
    // Get email from form field
    const emailField = document.querySelector('input[name="email"]') as HTMLInputElement
    const email = emailField?.value || userEmail
    
    if (!email) {
      toast.error("Please enter your email address first")
      return
    }
    
    setSendingOTP(true)
    try {
      const result = await api.resendOTP(email, 'signin')
      if (result.success) {
        setUserEmail(email) // Set userEmail for later use
        setStep('otp') // Switch to OTP step
        toast.success("OTP sent to your email!")
      } else {
        toast.error(result.message || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("Failed to send OTP. Please try again.")
    } finally {
      setSendingOTP(false)
    }
  }

  const Field = ({
    label,
    name,
    type = "text",
    icon,
    required,
    isEmailField = false,
    placeholder,
  }: {
    label: string
    name: string
    type?: string
    icon?: React.ReactNode
    required?: boolean
    isEmailField?: boolean
    placeholder?: string
  }) => (
    <div className="relative">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 z-10">{icon}</span>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`h-12 ${icon ? "pl-10" : "pl-3"} ${isEmailField ? 'border-blue-500 focus:border-blue-600' : ''} text-sm`}
        />
        <Label
          htmlFor={name}
          className={`absolute ${icon ? 'left-10' : 'left-3'} top-[-8px] text-xs ${isEmailField ? 'text-blue-600' : 'text-gray-600'} bg-white px-1 transition-all`}
        >
          {label}
        </Label>
      </div>
    </div>
  )

  return (
    <form className="flex flex-col gap-6 max-w-lg" onSubmit={onSubmit}>
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email address"
        required
        icon={<Mail size={16} aria-hidden="true" />}
        isEmailField={true}
      />

      <div className="space-y-2">
        <Field
          label="OTP"
          name="otp"
          type="text"
          placeholder="Enter OTP"
          required
          icon={<KeyRound size={16} aria-hidden="true" />}
        />
        <div className="mt-1">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={sendingOTP}
            className="text-sm text-blue-600 hover:text-blue-700 underline decoration-1 underline-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {sendingOTP ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm text-gray-600">
          Keep me logged in
        </Label>
      </div>

      <Button type="submit" className="mt-4 w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-4">
          <GoogleSignInButton />
        </div>
      </div>
    </form>
  )
}
