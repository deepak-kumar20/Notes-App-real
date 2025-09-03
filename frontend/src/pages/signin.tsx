import { SigninForm } from "@/components/auth/signin-form"

export default function SigninPage() {
  return (
    <main className="h-screen w-full font-sans">
      <section className="w-full h-full grid grid-cols-1 md:grid-cols-[40%_60%] bg-white">
        {/* Left column - Form (40%) */}
        <div className="p-6 md:p-10 flex flex-col">
          {/* Logo */}
          <div className="mb-8 md:mb-8 flex justify-center md:justify-start">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-16" />
          </div>

          {/* Content container with vertical centering */}
          <div className="flex-1 flex flex-col justify-start md:justify-center">
            {/* Title + subtext */}
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black text-balance">Sign in</h1>
              <p className="mt-2 text-sm text-gray-500">Please login to continue to your account.</p>
            </div>

            {/* Form */}
            <SigninForm />

            {/* Auth switch */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Need an account?{" "}
              <a href="/signup" className="text-blue-600 underline hover:text-blue-700 font-medium">
                Create one
              </a>
            </p>
          </div>
        </div>

        {/* Right column - Image (60%) */}
        <div className="relative hidden md:block p-1">
          <img
            src="/images/signin-hero.jpg"
            alt="Abstract blue folds"
            className="object-cover w-full h-full rounded-xl"
          />
        </div>
      </section>
    </main>
  )
}
