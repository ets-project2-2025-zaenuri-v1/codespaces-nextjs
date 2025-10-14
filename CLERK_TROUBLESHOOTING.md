# Clerk Authentication Troubleshooting Guide

This guide provides solutions to common issues with Clerk authentication in the Pempek POS application.

## 🔧 Common Issues and Solutions

### Issue: "The <SignIn/> component is not configured correctly"

**Error Message**:
```
Clerk: The <SignIn/> component is not configured correctly. The most likely reasons for this error are:

1. The "/sign-in" route is not a catch-all route.
It is recommended to convert this route to a catch-all route, eg: "/sign-in/[[...index]].tsx". Alternatively, you can update the <SignIn/> component to use hash-based routing by setting the "routing" prop to "hash".

2. The <SignIn/> component is mounted in a catch-all route, but all routes under "/sign-in" are protected by the middleware.
To resolve this, ensure that the middleware does not protect the catch-all route or any of its children.
```

**Solution**: Use hash-based routing for the SignIn component:

```tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <SignIn 
            routing="hash"  // Add this line
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
  )
}
```

### Issue: "The <SignUp/> component is not configured correctly"

**Error Message**:
```
Clerk: The <SignUp/> component is not configured correctly. The most likely reasons for this error are:

1. The "/sign-up" route is not a catch-all route.
It is recommended to convert this route to a catch-all route, eg: "/sign-up/[[...index]].tsx". Alternatively, you can update the <SignUp/> component to use hash-based routing by setting the "routing" prop to "hash".

2. The <SignUp/> component is mounted in a catch-all route, but all routes under "/sign-up" are protected by the middleware.
To resolve this, ensure that the middleware does not protect the catch-all route or any of its children.
```

**Solution**: Use hash-based routing for the SignUp component:

```tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <SignUp 
            routing="hash"  // Add this line
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
  )
}
```

### Issue: "Invalid publishable key"

**Error Message**:
```
Clerk: Invalid publishable key. Make sure you're using the correct key from your Clerk dashboard.
```

**Solution**: Check your environment variables:

1. Make sure you're using the correct key from your Clerk dashboard
2. Ensure the key is set in your `.env.local` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
3. Restart your development server after updating the environment variables

### Issue: "Redirect loop after sign in"

**Error Message**: The page keeps redirecting between sign-in and dashboard.

**Solution**: Check your redirect URLs in the Clerk Dashboard:

1. Go to your Clerk application
2. Navigate to **Sessions**
3. Under "Redirect URLs", add the following URLs:
   - Sign in: `http://localhost:3001/sign-in`
   - Sign up: `http://localhost:3001/sign-up`
   - After sign in: `http://localhost:3001/dashboard`
   - After sign up: `http://localhost:3001/dashboard`

### Issue: "Clerk is not defined"

**Error Message**: ReferenceError: Clerk is not defined.

**Solution**: Make sure you've properly wrapped your application with ClerkProvider in `_app.tsx`:

```tsx
import { ClerkProvider } from '@clerk/nextjs'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
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
```

### Issue: "Authentication not working in production"

**Error Message**: Authentication works in development but not in production.

**Solution**: Check your production environment variables and redirect URLs:

1. Make sure you've added your production URLs to the Redirect URLs in the Clerk Dashboard
2. Ensure your production environment variables are set correctly
3. Check if your domain is properly configured in Clerk

## 🚀 Testing Clerk Authentication

### 1. Test Sign In Flow

1. Navigate to `http://localhost:3001/sign-in`
2. Enter your email and password
3. Click "Continue"
4. Verify you're redirected to the dashboard after successful sign-in

### 2. Test Sign Up Flow

1. Navigate to `http://localhost:3001/sign-up`
2. Enter your email and password
3. Complete any verification steps
4. Verify you're redirected to the dashboard after successful sign-up

### 3. Test Protected Routes

1. Try to access `http://localhost:3001/dashboard` without signing in
2. Verify you're redirected to the sign-in page
3. Sign in and verify you can access the dashboard

### 4. Test Sign Out

1. Sign in to your account
2. Click the "Account" button in the dashboard
3. Sign out
4. Verify you're redirected to the sign-in page

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/nextjs)
- [Clerk Authentication Methods](https://clerk.com/docs/authentication)
- [Clerk Troubleshooting](https://clerk.com/docs/troubleshooting)

## 🔧 Debugging Tips

1. **Check the Console**: Look for any error messages in the browser console
2. **Check the Network Tab**: Look for any failed requests to Clerk APIs
3. **Check Environment Variables**: Make sure all required environment variables are set
4. **Clear Browser Cache**: Clear your browser cache and cookies
5. **Restart Development Server**: Restart your development server after making changes

## 📝 Reporting Issues

If you encounter any issues with Clerk authentication:

1. **Check the Console**: Look for any error messages
2. **Check the Network Tab**: Look for any failed requests
3. **Document the Issue**: Include steps to reproduce, expected behavior, and actual behavior
4. **Create an Issue**: Create an issue in the repository with all the details

Happy coding! 🚀