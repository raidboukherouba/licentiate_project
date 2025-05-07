import { Navbar } from "@/components/nav-bar"
import { LoginForm } from "@/components/login-form"

export default function LogIn() {
  return (
    <div className="flex flex-col min-h-svh">
      <Navbar />
      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <footer className="w-full bg-sidebar p-4 flex justify-center text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} Raid Boukherouba. All rights reserved.
        </p>
      </footer>
    </div>
  )
}