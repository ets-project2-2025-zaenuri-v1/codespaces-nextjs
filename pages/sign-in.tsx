import { SignIn } from '@clerk/nextjs'
import Head from 'next/head'

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In - Pempek POS</title>
        <meta name="description" content="Sign in to your Pempek POS account" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-ivory py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-slate font-display">
                Pempek POS
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-slate">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate">
              Enter your email and password to access the dashboard
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <SignIn 
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}