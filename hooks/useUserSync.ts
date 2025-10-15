import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export const useUserSync = () => {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return

    // Sync user with our database
    const syncUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        
        if (!data.success) {
          console.error('Failed to sync user:', data.error)
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    }

    syncUser()
  }, [user, isLoaded])

  return { user, isLoaded }
}