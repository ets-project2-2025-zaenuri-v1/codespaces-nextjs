# Troubleshooting Guide for Pempek POS

This document provides solutions to common issues you might encounter while setting up or running the Pempek POS application.

## 🚀 Build Issues

### Error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"

**Solution**: This error occurs when using Tailwind CSS v4. Downgrade to v3.4.16:

```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install tailwindcss@3.4.16 postcss@8.4.49 autoprefixer@10.4.20
```

Make sure your `postcss.config.js` looks like this:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Error: "Module not found: Can't resolve '../pages/_app'"

**Solution**: This error occurs with Next.js v14.2.32. Downgrade to v14.2.15:

```bash
npm uninstall next
npm install next@14.2.15
```

## 🔌 Database Connection Issues

### Error: "Database connection failed" when accessing `/api/test-db`

**Possible Solutions**:

1. **Check Environment Variables**:
   - Make sure `.env.local` is properly configured
   - Verify Supabase URL and keys are correct

2. **Check Supabase Setup**:
   - Ensure you've run all SQL schema files in the correct order
   - Verify RLS policies are properly configured

3. **Check Network**:
   - Ensure your IP is whitelisted in Supabase settings
   - Check if there are any firewall restrictions

## 🔐 Authentication Issues

### Clerk Authentication Not Working

**Solutions**:

1. **Verify Clerk Configuration**:
   - Check your Clerk Dashboard settings
   - Ensure redirect URLs are properly configured
   - Verify publishable and secret keys

2. **Check Environment Variables**:
   - Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
   - Verify Clerk keys are correct and not expired

3. **Check Middleware**:
   - Ensure middleware is properly configured if using
   - Verify public routes are correctly defined

## 🎨 Styling Issues

### Tailwind CSS Classes Not Applying

**Solutions**:

1. **Check Tailwind Configuration**:
   - Verify `tailwind.config.js` is properly set up
   - Ensure content paths include all your component files

2. **Check Global CSS**:
   - Make sure `global.css` includes Tailwind directives
   - Verify CSS is properly imported in `_app.tsx`

3. **Check PostCSS Configuration**:
   - Ensure `postcss.config.js` is properly configured
   - Verify Tailwind plugin is correctly added

## 📱 Development Server Issues

### Development Server Not Starting

**Solutions**:

1. **Clear Cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check Dependencies**:
   ```bash
   npm install
   ```

3. **Check Port Availability**:
   - Make sure port 3000 is not in use
   - Try running on a different port: `PORT=3001 npm run dev`

## 🚀 Deployment Issues

### Vercel Deployment Failing

**Solutions**:

1. **Check Environment Variables**:
   - Ensure all required environment variables are set in Vercel
   - Verify variable names match exactly with your local setup

2. **Check Build Process**:
   - Ensure `npm run build` completes successfully locally
   - Check for any build warnings or errors

3. **Check Dependencies**:
   - Ensure all dependencies are properly listed in package.json
   - Verify dependency versions are compatible

## 🐛 Common Bugs

### Page Not Found (404)

**Solutions**:

1. **Check File Structure**:
   - Ensure files are in the correct directory
   - Verify file names match the route names

2. **Check Dynamic Routes**:
   - Ensure dynamic routes are properly configured
   - Verify parameter names match

### Component Not Rendering

**Solutions**:

1. **Check Imports**:
   - Ensure components are properly imported
   - Verify import paths are correct

2. **Check Exports**:
   - Ensure components are properly exported
   - Verify default vs named exports

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the Console**: Look for error messages in the browser console
2. **Check the Terminal**: Look for error messages in the development server terminal
3. **Check the Logs**: Check Vercel logs for deployment issues
4. **Create an Issue**: If you've found a bug, create an issue in the repository

## 🔧 Development Tips

1. **Use TypeScript**: Enable strict type checking for better error catching
2. **Use ESLint**: Configure ESLint for code quality checks
3. **Use Prettier**: Configure Prettier for consistent code formatting
4. **Use Git Hooks**: Set up pre-commit hooks to catch issues early
5. **Use Environment Validation**: Validate environment variables on startup