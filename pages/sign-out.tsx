import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useClerk } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

export default function SignOutPage() {
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut()
        router.push('/')
      } catch (error) {
        console.error('Error signing out:', error)
        router.push('/')
      }
    }

    handleSignOut()
  }, [signOut, router])

  return (
    <>
      <Head>
        <title>Sign Out - Pempek POS</title>
        <meta name="description" content="Signing out from Pempek POS" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate mb-2">
            Sedang Keluar...
          </h2>
          <p className="text-slate">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    </>
  )
}