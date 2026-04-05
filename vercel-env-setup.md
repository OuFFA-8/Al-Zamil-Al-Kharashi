# Vercel Environment Variables Setup

You need to set up the following environment variables in your Vercel project:

## Required Environment Variables:

1. **DATABASE_URL**

   ```
   postgresql://neondb_owner:npg_4zw9cYOJAgPo@ep-red-river-ad41p90v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **JWT_SECRET**

   ```
   your-super-secret-jwt-key-change-this-in-production-min-32-chars
   ```

3. **SESSION_SECRET**

   ```
   your-session-secret-key-change-this-in-production-min-32-chars
   ```

4. **ADMIN_EMAIL**

   ```
   admin@zk-legal.com
   ```

5. **ADMIN_PASSWORD**

   ```
   admin123
   ```

6. **NODE_ENV**

   ```
   production
   ```

7. **PORT**
   ```
   3001
   ```

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project "zk-legal-main-new"
3. Go to Settings → Environment Variables
4. Add each variable above
5. Make sure to set them for "Production" environment
6. Redeploy your project

## Alternative: Use Vercel CLI

You can also set them via CLI:

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add SESSION_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add NODE_ENV
vercel env add PORT
```

Then redeploy:

```bash
vercel --prod
```
