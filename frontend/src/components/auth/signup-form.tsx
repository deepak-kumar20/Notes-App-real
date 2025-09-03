
import * as React from "react"
import { useNavigate } from "react-router-dom"
import { CalendarIcon, Mail, User, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleSignInButton } from "./google-signin-button"
import { api } from "@/lib/api"
import { toast } from "sonner"

export function SignupForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [otpSent, setOtpSent] = React.useState(false)
  const [userEmail, setUserEmail] = React.useState("")
  const [verifyingOTP, setVerifyingOTP] = React.useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    
    if (!otpSent) {
      // Send OTP
      const payload = {
        name: String(fd.get("name") || ""),
        dob: String(fd.get("dob") || ""),
        email: String(fd.get("email") || ""),
      }
      
      if (!payload.name || !payload.email || !payload.dob) {
        toast.error("Please fill in all fields")
        return
      }

      setLoading(true)
      try {
        const result = await api.sendSignupOTP(payload)
        if (result.success) {
          setOtpSent(true)
          setUserEmail(payload.email)
          toast.success("OTP sent to your email!")
        } else {
          toast.error(result.message || "Failed to send OTP")
        }
      } catch (error) {
        console.error("Error sending OTP:", error)
        toast.error("Failed to send OTP. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      // Verify OTP
      const otp = String(fd.get("otp") || "")
      
      if (!otp) {
        toast.error("Please enter the OTP")
        return
      }

      setVerifyingOTP(true)
      try {
        const result = await api.verifySignupOTP(userEmail, otp)
        if (result.success) {
          toast.success("Account created successfully!")
          // Navigate to dashboard using React Router
          navigate('/dashboard')
        } else {
          toast.error(result.message || "Invalid OTP")
        }
      } catch (error) {
        console.error("Error verifying OTP:", error)
        toast.error("Failed to verify OTP. Please try again.")
      } finally {
        setVerifyingOTP(false)
      }
    }
  }

  const handleResendOTP = async () => {
    if (!userEmail) return
    
    setLoading(true)
    try {
      const result = await api.resendOTP(userEmail, 'signup')
      if (result.success) {
        toast.success("OTP resent to your email!")
      } else {
        toast.error(result.message || "Failed to resend OTP")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("Failed to resend OTP. Please try again.")
    } finally {
      setLoading(false)
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
    <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-lg">
      {!otpSent ? (
        <>
          <Field
            label="Your Name"
            name="name"
            placeholder="Enter your name"
            required
            icon={<User size={16} aria-hidden="true" />}
          />
          <Field
            label="Date of Birth"
            name="dob"
            type="date"
            placeholder="Select your date of birth"
            required
            icon={<CalendarIcon size={16} aria-hidden="true" />}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            icon={<Mail size={16} aria-hidden="true" />}
            isEmailField={true}
          />
          <Button type="submit" disabled={loading} className="mt-4 w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            {loading ? "Sending..." : "Get OTP"}
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
              <GoogleSignInButton/>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Enter OTP</h3>
            <p className="text-sm text-gray-600 mt-1">
              We've sent a 6-digit code to <span className="font-medium">{userEmail}</span>
            </p>
          </div>
          <Field
            label="OTP"
            name="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            required
            icon={<KeyRound size={16} aria-hidden="true" />}
          />
          <div className="text-center">
            <span className="text-sm text-gray-600">Didn't receive the code? </span>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 underline decoration-1 underline-offset-2 disabled:opacity-50"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
          </div>
          <Button type="submit" disabled={verifyingOTP} className="mt-4 w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            {verifyingOTP ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setOtpSent(false)
              setUserEmail("")
            }}
            className="w-full h-11 text-sm font-medium"
          >
            Back to Sign Up
          </Button>
        </>
      )}
    </form>
  )
}
