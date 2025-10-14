import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Daftar - Pempek POS</title>
        <meta name="description" content="Buat akun Pempek POS Anda" />
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
              Buat Akun Anda
            </h2>
            <p className="mt-2 text-sm text-slate">
              Daftar untuk mulai mengelola kedai pempek Anda
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <SignUp 
              routing="hash"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  headerTitle: "text-2xl font-bold",
                  headerSubtitle: "text-sm",
                  socialButtonsBlockButton: "border-gray-600",
                  formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                  formFieldInput: "bg-gray-50 border-gray-300 focus:border-primary focus:ring-primary",
                  footerActionLink: "text-primary hover:text-primary/90"
                },
              }}
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-slate">
              Sudah punya akun?{' '}
              <a href="/sign-in" className="font-medium text-primary hover:text-primary/90">
                Masuk sekarang
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}