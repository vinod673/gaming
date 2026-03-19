# Vercel Deployment Guide - ArenaX Gaming

## ✅ Prerequisites

- GitHub repository: https://github.com/vinod673/gaming
- Supabase project with credentials
- Vercel account (free tier works)

## 🚀 Deploy Steps

### 1. Fix Build Error First

The current build has a runtime error that needs fixing:

**File**: `next.config.mjs`

Add this webpack configuration:

```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals = [...(config.externals || []), 'critters'];
  }
  return config;
},
```

### 2. Push Fix to GitHub

```bash
cd "d:\New folder\arenax-gaming"
git add next.config.mjs vercel.json
git commit -m "Fix: Add Vercel deployment config and fix build error"
git push origin main
```

### 3. Deploy on Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `vinod673/gaming`
4. Click "Import Project"

**Configure Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
- `NEXT_PUBLIC_SITE_URL` → Your production URL (e.g., `https://your-project.vercel.app`)

5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
cd "d:\New folder\arenax-gaming"
vercel login
vercel --prod
```

Then set environment variables in Vercel dashboard.

## 🔧 Environment Variables Required

Create these in Vercel Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production & Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from Supabase | Production & Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production |

## ⚡ Post-Deployment

### 1. Check Build Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on latest deployment
- Check "Build Logs" for any errors

### 2. Test Functionality
- Homepage: `https://your-project.vercel.app/`
- Login: Test authentication
- Dashboard: Verify user data loads
- Admin: Test admin routes (if applicable)

### 3. Set up Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

## 🐛 Troubleshooting

### Build Fails with "self is not defined"
**Solution**: The webpack externals config in `next.config.mjs` should fix this.

### Runtime Errors
Check Vercel Functions logs:
- Project → Deployments → Click deployment → "Functions" tab

### Authentication Issues
1. Verify Supabase URL and keys are correct
2. Check CORS settings in Supabase dashboard
3. Ensure redirect URLs include your Vercel domain

### Slow Performance
- Enable Vercel Analytics in Project Settings
- Consider enabling ISR (Incremental Static Regeneration)
- Check bundle size with `npm run build:analyze`

## 📊 Expected Performance

With Vercel's Edge Network:
- **First Contentful Paint**: < 1.5s globally
- **Time to Interactive**: < 3s
- **LCP**: < 2.5s
- **Automatic HTTPS**: ✅
- **CDN Caching**: ✅
- **Edge Functions**: ✅ (if enabled)

## 💰 Cost Estimate

**Free Tier** (Hobby):
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for development/testing

**Pro Tier** ($20/month):
- 1TB bandwidth
- Analytics
- Faster builds
- Needed when you have real users

## 🔒 Security Notes

✅ `.env.production` is in `.gitignore` - secrets stay private
✅ Environment variables encrypted in Vercel
✅ Automatic SSL/TLS certificates
✅ DDoS protection included

## 📝 Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Integration](https://supabase.com/docs/guides/getting-started/quickstarts/vercel)

---

**Status**: Ready to deploy once build error is fixed! 🚀
