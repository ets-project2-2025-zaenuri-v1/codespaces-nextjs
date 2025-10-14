# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the Pempek POS application.

## 🚀 Step-by-Step Setup

### 1. Create a New Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add application" or "Create application"
3. Enter an application name (e.g., "Pempek POS")
4. Select your user authentication methods:
   - Email + Password (recommended)
   - Phone Number (optional)
   - Social Providers (optional)
5. Click "Create application"

### 2. Get Your Clerk Credentials

1. In your Clerk application, go to **API Keys**
2. Copy the following values:
   - Publishable key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
   - Secret key (CLERK_SECRET_KEY)

### 3. Configure Clerk in Your Application

1. Update your `.env.local` file with your Clerk credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

2. Restart your development server:
   ```bash
   npm run dev
   ```

### 4. Configure Redirect URLs

1. In your Clerk application, go to **Sessions**
2. Under "Redirect URLs", add the following URLs:
   - Sign in: `http://localhost:3000/sign-in`
   - Sign up: `http://localhost:3000/sign-up`
   - After sign in: `http://localhost:3000/dashboard`
   - After sign up: `http://localhost:3000/dashboard`

3. For production, add your production URLs:
   - Sign in: `https://your-domain.com/sign-in`
   - Sign up: `https://your-domain.com/sign-up`
   - After sign in: `https://your-domain.com/dashboard`
   - After sign up: `https://your-domain.com/dashboard`

### 5. Configure Webhooks (Optional)

For advanced features like user synchronization with your database:

1. In your Clerk application, go to **Webhooks**
2. Click "Add endpoint"
3. Enter a webhook URL: `https://your-domain.com/api/webhooks/clerk`
4. Select the events you want to receive:
   - user.created
   - user.updated
   - user.deleted
5. Copy the webhook secret and add it to your environment variables:
   ```env
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

## 🔧 Clerk Configuration in the Application

### _app.tsx

The main application wrapper is configured in `pages/_app.tsx`:

```tsx
import '../global.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'

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
```

### Authentication Pages

#### Sign In Page (`pages/sign-in.tsx`)

```tsx
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
```

#### Sign Up Page (`pages/sign-up.tsx`)

```tsx
import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up - Pempek POS</title>
        <meta name="description" content="Create your Pempek POS account" />
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate">
              Sign up to start managing your kedai Pempek
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <SignUp 
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
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
```

### Protected Routes

For routes that require authentication, use the `ProtectedRoute` component:

```tsx
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ProtectedRoute from '../components/protected-route'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      {/* Your protected content here */}
    </ProtectedRoute>
  )
}
```

### Accessing User Information

To access user information in your components:

```tsx
import { useUser } from '@clerk/nextjs'

export default function UserProfile() {
  const { isSignedIn, user } = useUser()
  
  if (!isSignedIn) {
    return <div>Please sign in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</h1>
      <p>User ID: {user.id}</p>
    </div>
  )
}
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never expose your secret key in client-side code
2. **HTTPS**: Always use HTTPS in production
3. **Webhook Security**: Verify webhook signatures when processing webhook events
4. **Session Management**: Configure appropriate session timeouts
5. **Password Policies**: Enforce strong password requirements

## 🚀 Testing Clerk Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Sign Up" to create a new account

4. After signing up, you should be redirected to the dashboard

5. Sign out and test the sign-in flow

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/nextjs)
- [Clerk Authentication Methods](https://clerk.com/docs/authentication)
- [Clerk Webhooks](https://clerk.com/docs/webhooks)

## 🔧 Troubleshooting

### Issue: "Invalid publishable key"

**Solution**: Make sure you've correctly set the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` environment variable.

### Issue: "Redirect loop after sign in"

**Solution**: Check your redirect URLs in the Clerk Dashboard and make sure they match your application's URLs.

### Issue: "Clerk is not defined"

**Solution**: Make sure you've properly wrapped your application with `ClerkProvider` in `_app.tsx`.

### Issue: "Authentication not working in production"

**Solution**: Make sure you've added your production URLs to the Redirect URLs in the Clerk Dashboard.