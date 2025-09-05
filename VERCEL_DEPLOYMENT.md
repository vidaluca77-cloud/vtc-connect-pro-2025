# Deployment Guide for Vercel

This document provides step-by-step instructions for deploying VTC Connect Pro 2025 to Vercel.

## 🚀 Quick Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository `vidaluca77-cloud/vtc-connect-pro-2025`

2. **Configure the project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (keep as root)
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `app/.next`
   - **Install Command:** `npm run vercel-install`

3. **Set Environment Variables:**
   Add these environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
   
   **Note:** You can copy these variable names from `app/.env.example` file.

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from root directory:**
   ```bash
   cd vtc-connect-pro-2025
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your team/personal account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `vtc-connect-pro-2025`
   - In which directory is your code located? `./`

## 🔧 Configuration Details

### Mono-repo Structure
This project uses a mono-repo structure with workspaces:
- `app/` - Next.js frontend application
- `api/` - Node.js backend API (separate deployment)

### Vercel Configuration
The project includes a single optimized `vercel.json` file:
- **Root level**: `/vercel.json` - Optimized configuration for mono-repo deployment

### Build Process
- **Install Command:** `npm run vercel-install` - Installs dependencies using npm ci for faster, reliable builds
- **Build Command:** `npm run vercel-build` - Builds the Next.js app with optimized dependency installation
- **Output Directory:** `app/.next` - Next.js build output location

### Vercel Optimizations
The `vercel.json` configuration includes:
- ✅ **Optimized environment variables** using Vercel's secret system (@-prefixed variables)
- ✅ **Security headers** (X-Frame-Options, X-Content-Type-Options)
- ✅ **Serverless function configuration** with appropriate timeouts
- ✅ **Europe region deployment** (fra1) for better performance
- ✅ **Clean URLs and trailing slash configuration**

## 🌍 Environment Variables Setup

### Required Clerk Variables
Get these from your [Clerk Dashboard](https://dashboard.clerk.com):

```env
# Public Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Private Clerk Configuration  
CLERK_SECRET_KEY=sk_test_your_secret_here

# API Configuration (if using external API)
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Setting Variables in Vercel
1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with appropriate environment (Production, Preview, Development)

## 🔒 Clerk Configuration

### Clerk Dashboard Setup
1. **Create a Clerk Application:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create a new application
   - Choose "Next.js" as your framework

2. **Configure Allowed Origins:**
   Add your Vercel domain to allowed origins:
   - `https://your-project.vercel.app`
   - `https://your-custom-domain.com` (if using custom domain)

3. **Set Redirect URLs:**
   - Sign-in URL: `https://your-domain.com/sign-in`
   - Sign-up URL: `https://your-domain.com/sign-up`
   - After sign-in: `https://your-domain.com/dashboard`
   - After sign-up: `https://your-domain.com/dashboard`

## 🐛 Troubleshooting

### Common Issues

**Build Fails with "next: not found"**
- Solution: Ensure all dependencies are installed with `npm run install:all`
- Verify workspace configuration in root package.json

**Multiple lockfiles warning**
- Solution: Remove `app/package-lock.json` - only root lockfile should exist
- Use `npm ci` instead of `npm install` for consistent builds

**Environment variables not working**
- Solution: Use Vercel's @ syntax for secrets: `@variable_name` instead of `$VARIABLE_NAME`
- Verify environment variables are set correctly in Vercel dashboard
- Check that variable names match exactly (case-sensitive)

**Clerk authentication not working**
- Solution: Verify environment variables are set correctly in Vercel
- Check that Clerk dashboard has correct redirect URLs
- Ensure publishable key matches the deployment environment

**404 on routes**
- Solution: Ensure middleware.ts is properly configured for protected routes
- Check Next.js routing configuration in app directory

**Build timeouts or memory issues**
- Solution: Optimized build commands now use `npm ci` for faster installation
- Vercel functions configured with appropriate timeouts (30s max)
- Use Europe region (fra1) for better performance

**Monorepo deployment issues**
- Solution: Use the optimized `vercel-build` and `vercel-install` commands
- Ensure workspace dependencies are properly resolved
- Root directory should be `./` with proper outputDirectory configuration

### Build Optimization

The project is optimized for Vercel with:
- ✅ Package import optimization for Clerk
- ✅ Image optimization configured
- ✅ Middleware for protected routes
- ✅ Static generation where possible
- ✅ Clean mono-repo structure

### Performance Metrics
Expected build output:
- **14 pages** generated
- **~139kB First Load JS** (highly optimized)
- **Build time:** ~10-15 seconds

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run build checks and tests

## 📊 Monitoring

After deployment, monitor your application:
- **Analytics:** Available in Vercel dashboard
- **Logs:** Check function logs for errors
- **Performance:** Monitor Core Web Vitals

## 🎯 Next Steps

After successful deployment:
1. Configure custom domain (optional)
2. Set up monitoring and alerts
3. Configure analytics
4. Set up staging environment for development

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or [Clerk Documentation](https://clerk.com/docs) for additional support.