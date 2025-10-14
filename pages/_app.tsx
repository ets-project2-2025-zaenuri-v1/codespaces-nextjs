import '../global.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "mx-auto",
          card: "shadow-md border-0",
          headerTitle: "text-2xl font-bold",
          headerSubtitle: "text-sm",
          socialButtonsBlockButton: "border-gray-600",
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          formFieldInput: "bg-gray-800 border-gray-600 focus:border-primary",
          footerActionLink: "text-primary hover:text-primary/90"
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp