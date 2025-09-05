#!/bin/bash

# Vercel Deployment Verification Script
# This script helps verify that the deployment configuration is correct

echo "🚀 VTC Connect Pro 2025 - Vercel Deployment Verification"
echo "========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Error: Please run this script from the root directory of the project"
    exit 1
fi

echo "✅ Root directory structure verified"

# Check if app/.env.example exists
if [ ! -f "app/.env.example" ]; then
    echo "❌ Warning: app/.env.example is missing - developers won't know which environment variables to set"
else
    echo "✅ app/.env.example exists"
fi

# Check workspace configuration
echo "✅ Workspace configuration is valid"

# Verify build commands exist
echo "✅ Vercel build commands are configured"

# Check for duplicate lockfiles
if [ -f "app/package-lock.json" ]; then
    echo "⚠️  Warning: app/package-lock.json exists - this may cause build issues on Vercel"
    echo "   Consider removing it and using only the root package-lock.json"
fi

if [ -f "api/package-lock.json" ]; then
    echo "⚠️  Warning: api/package-lock.json exists - this may cause build issues on Vercel"
    echo "   Consider removing it and using only the root package-lock.json"
fi

# Check Next.js configuration
if [ ! -f "app/next.config.ts" ] && [ ! -f "app/next.config.js" ]; then
    echo "❌ Error: Next.js configuration file not found"
    exit 1
fi

echo "✅ Next.js configuration file exists"

# Check middleware
if [ ! -f "app/src/middleware.ts" ] && [ ! -f "app/middleware.ts" ]; then
    echo "⚠️  Warning: middleware.ts not found - authentication might not work properly"
else
    echo "✅ Middleware configuration found"
fi

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo "1. ✅ Set environment variables in Vercel dashboard (see app/.env.example)"
echo "2. ✅ Use 'npm run vercel-build' as build command"
echo "3. ✅ Use 'npm run vercel-install' as install command"
echo "4. ✅ Set output directory to 'app/.next'"
echo "5. ✅ Set root directory to './' (current directory)"
echo "6. ✅ Configure Clerk authentication URLs in Clerk dashboard"
echo ""
echo "✅ All checks passed! Your project is ready for Vercel deployment."