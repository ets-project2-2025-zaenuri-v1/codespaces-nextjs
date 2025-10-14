import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensure this component only runs on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router, isClient])

  // Show loading state while checking authentication
  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not signed in, show nothing (will redirect)
  if (!isSignedIn) {
    return null
  }

  // If signed in, show children
  return <>{children}</>
}