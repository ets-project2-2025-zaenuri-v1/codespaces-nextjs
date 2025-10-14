# Testing Guide for Pempek POS

This guide will help you test the Pempek POS application to ensure everything is working correctly.

## 🚀 Prerequisites

Before you start testing, make sure you have:

1. **Supabase Setup**
   - Supabase project created
   - Database schema imported
   - Environment variables configured

2. **Clerk Setup**
   - Clerk application created
   - Environment variables configured

3. **Application Running**
   - Development server running: `npm run dev`
   - Application accessible at `http://localhost:3000`

## 🧪 Testing Database Connection

### Test Database Connection API

1. Open your browser and navigate to:
   ```
   http://localhost:3000/api/test-db
   ```

2. You should see a response like this:
   ```json
   {
     "success": true,
     "message": "Database connection successful",
     "data": {
       "organizations": [
         {
           "id": "00000000-0000-0000-0000-000000000001",
           "name": "Pempek Palembang",
           "description": "Sample organization for testing"
         }
       ],
       "products": [
         {
           "id": "00000000-0000-0000-0000-000000000001",
           "name": "Pempek Kapal Selam",
           "price": 25000
         }
       ],
       "ingredients": [
         {
           "id": "00000000-0000-0000-0000-000000000001",
           "name": "Tepung Tapioka",
           "current_stock": 50
         }
       ],
       "tables": [
         {
           "id": "00000000-0000-0000-0000-000000000001",
           "number": "MEJA-01",
           "capacity": 4
         }
       ],
       "timestamp": "2025-10-14T18:22:46.547Z"
     }
   }
   ```

3. **If you see empty arrays**, it means:
   - The database connection is working
   - But the sample data might not be imported correctly
   - Check your Supabase setup and re-import the schema if needed

## 🔐 Testing Clerk Authentication

### 1. Test Landing Page

1. Navigate to `http://localhost:3000`
2. You should see the landing page with:
   - Pempek POS branding
   - Sign In and Sign Up buttons in the header
   - Hero section with "Get Started" and "Sign In" buttons
   - Features section
   - Footer

### 2. Test Sign Up Flow

1. Click "Sign Up" in the header or "Get Started" button
2. You should be redirected to `http://localhost:3000/sign-up`
3. Fill in the registration form:
   - Email address
   - Password
   - Confirm password
4. Click "Continue"
5. Complete any additional verification steps if required
6. After successful registration, you should be redirected to the dashboard

### 3. Test Sign In Flow

1. Click "Sign In" in the header
2. You should be redirected to `http://localhost:3000/sign-in`
3. Fill in the sign-in form:
   - Email address
   - Password
4. Click "Continue"
5. After successful sign-in, you should be redirected to the dashboard

### 4. Test Protected Routes

1. Try to access the dashboard directly: `http://localhost:3000/dashboard`
2. If you're not signed in, you should be redirected to the sign-in page
3. After signing in, you should be able to access the dashboard

### 5. Test Dashboard

1. After signing in, you should see the dashboard with:
   - Welcome message with your name or email
   - User avatar in the header
   - Quick action cards (POS Kasir, Kitchen Display, Table Management, Reports)
   - Stats cards (Today's Sales, Total Orders, Customers, Low Stock Items)
   - Recent Orders section

## 🐛 Troubleshooting

### Issue: "Database connection failed"

**Possible Solutions**:
1. Check your Supabase environment variables
2. Verify your Supabase project is active
3. Check if the database schema is imported correctly
4. Verify your IP is whitelisted in Supabase settings

### Issue: "Clerk authentication not working"

**Possible Solutions**:
1. Check your Clerk environment variables
2. Verify your Clerk application is active
3. Check if your redirect URLs are configured correctly
4. Clear your browser cookies and cache

### Issue: "Page not found (404)"

**Possible Solutions**:
1. Make sure the development server is running
2. Check if you're accessing the correct URL
3. Restart the development server

### Issue: "Build failed"

**Possible Solutions**:
1. Check for TypeScript errors
2. Make sure all dependencies are installed
3. Clear the Next.js cache: `rm -rf .next`
4. Restart the development server

## 📱 Testing on Different Devices

### Mobile Testing

1. Open your browser's developer tools
2. Switch to mobile view or use device emulation
3. Test the responsive design of all pages
4. Test the authentication flow on mobile

### Tablet Testing

1. Open your browser's developer tools
2. Switch to tablet view or use device emulation
3. Test the responsive design of all pages
4. Test the authentication flow on tablet

## 🚀 Performance Testing

### Page Load Speed

1. Open your browser's developer tools
2. Go to the Network tab
3. Refresh the page
4. Check the load time for each resource
5. Optimize if needed

### Memory Usage

1. Open your browser's developer tools
2. Go to the Performance tab
3. Record a performance profile
4. Check for memory leaks
5. Optimize if needed

## 📊 Testing Checklist

- [ ] Landing page loads correctly
- [ ] Sign up flow works correctly
- [ ] Sign in flow works correctly
- [ ] Protected routes redirect correctly
- [ ] Dashboard displays correctly
- [ ] Database connection works correctly
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Page load speed is acceptable
- [ ] No console errors

## 📝 Reporting Issues

If you encounter any issues during testing:

1. **Check the console** for any error messages
2. **Check the terminal** for any build errors
3. **Document the issue** with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
4. **Create an issue** in the repository with all the details

## 🎯 Next Steps

After completing the testing:

1. **Fix any issues** found during testing
2. **Implement additional features** as needed
3. **Deploy to production** when ready
4. **Monitor the application** for any issues

Happy testing! 🚀