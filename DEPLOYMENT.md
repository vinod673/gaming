# ArenaX Gaming - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [GoDaddy Deployment](#godaddy-deployment)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Supabase account (free tier works)
- Vercel account (optional, for Vercel deployment)
- GoDaddy hosting account (optional, for GoDaddy deployment)

## Supabase Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project name: `arenax-gaming`
4. Choose a database password (save this securely)
5. Select a region closest to your target audience
6. Click "Create new project"

### 2. Run Database Migrations

1. In your Supabase dashboard, go to the SQL Editor
2. Create a "New query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" to execute all migrations

### 3. Configure Authentication

1. Go to Authentication → Providers in Supabase dashboard
2. Enable "Email" provider (should be enabled by default)
3. Enable "Google" provider:
   - Click on Google
   - Enable it
   - Add your Google OAuth credentials (or use Supabase's default for testing)
4. Go to Authentication → URL Configuration
   - Set Site URL to your production URL
   - Add your production URL to "Redirect URLs"

### 4. Get API Keys

1. Go to Project Settings → API
2. Copy the "Project URL" - this is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the "anon public" key - this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd arenax-gaming
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Supabase credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [https://vercel.com](https://vercel.com) and sign up/login
3. Click "Add New Project"
4. Import your Git repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: `.next`

6. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel deployment URL)

7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

### Vercel Production Deployment

For production deployment with custom domain:

1. Add a custom domain in Vercel dashboard
2. Update DNS records with your domain provider
3. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain
4. Redeploy the application

## GoDaddy Deployment

### Prerequisites

- GoDaddy cPanel hosting with Node.js support OR
- GoDaddy VPS/Dedicated server

### Option 1: cPanel with Node.js (if available)

1. Build your application locally:
```bash
npm run build
```

2. Upload files via FTP/File Manager:
   - Upload all files except `node_modules`
   - Or use Git deployment if available in cPanel

3. In cPanel, set up Node.js application:
   - Go to "Setup Node.js App"
   - Select Node.js version 18+
   - Set application root to your project folder
   - Set application URL
   - Set startup file: `server.js` or use PM2

4. Install dependencies on server:
```bash
cd /path/to/your/app
npm install --production
```

5. Set environment variables in cPanel or create `.env.local` file

6. Start the application

### Option 2: Static Export (Recommended for shared hosting)

1. Modify `next.config.js` for static export:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

2. Build static files:
```bash
npm run build
```

3. Upload the `dist` folder contents to your GoDaddy public_html folder

4. Note: Some features like API routes and server-side rendering won't work with static export

### Option 3: VPS/Dedicated Server

1. Connect to your server via SSH
2. Install Node.js 18+:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Install PM2:
```bash
sudo npm install -g pm2
```

4. Clone your repository:
```bash
cd /var/www
git clone <your-repo-url>
cd arenax-gaming
```

5. Install dependencies:
```bash
npm install
```

6. Create environment file:
```bash
nano .env.local
# Add your environment variables
```

7. Build the application:
```bash
npm run build
```

8. Start with PM2:
```bash
pm2 start npm --name "arenax-gaming" -- start
pm2 save
pm2 startup
```

9. Configure Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Enable SSL with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | Optional |
| `NEXT_PUBLIC_SITE_URL` | Your site's URL | Yes |

## Post-Deployment

### 1. Configure Supabase Auth Redirects

After deployment, update Supabase Authentication settings:
1. Go to Authentication → URL Configuration
2. Add your production URL to "Redirect URLs"
3. Update "Site URL" to your production URL

### 2. Test Authentication

- Test email signup/login
- Test Google OAuth login
- Verify redirects work correctly

### 3. Create Admin User

1. Sign up as a normal user
2. In Supabase dashboard, go to Table Editor → users
3. Find your user and change `role` from 'player' to 'admin'

### 4. Monitor Application

- Check Vercel/GoDaddy logs for errors
- Monitor Supabase usage and limits
- Set up error tracking (Sentry, LogRocket, etc.)

### 5. Performance Optimization

- Enable Vercel Analytics (if using Vercel)
- Configure CDN for static assets
- Optimize images using Next.js Image component
- Enable Supabase connection pooling for high traffic

## Troubleshooting

### Build Errors

1. Clear `.next` folder and rebuild:
```bash
rm -rf .next
npm run build
```

2. Check Node.js version:
```bash
node --version  # Should be 18+
```

### Database Connection Issues

1. Verify Supabase URL and API keys
2. Check Row Level Security (RLS) policies
3. Verify database tables exist

### Authentication Issues

1. Check redirect URLs in Supabase
2. Verify environment variables are set correctly
3. Check browser console for errors

## Support

For issues specific to:
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **GoDaddy**: [GoDaddy Help](https://www.godaddy.com/help)
