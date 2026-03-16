# ArenaX Gaming - Login Fix Guide

## Problem Summary
Login is not working due to missing database setup for user profiles in Supabase.

## Root Causes Identified

### 1. **Missing Users Table or RLS Policies**
The `public.users` table either doesn't exist or lacks proper Row Level Security (RLS) policies, preventing authenticated users from reading their profile data.

### 2. **Missing Auto-Profile Creation Trigger**
When users create an account or login, Supabase doesn't automatically create a corresponding record in the `public.users` table, causing queries that join with this table to fail.

### 3. **Environment Variables Not Loaded**
The Next.js dev server might not have properly loaded the `.env.local` file.

---

## Step-by-Step Fix Instructions

### **Step 1: Run the Database Fix Script**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pqmyslyhkxbkrbuladhq`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open the file: `supabase/complete-auth-fix.sql`
6. Copy the ENTIRE content
7. Paste it into the SQL Editor
8. Click **Run** (or press Ctrl+Enter)
9. Verify the output shows:
   - ✅ Table exists
   - ✅ RLS enabled: YES
   - ✅ Policies count: 3 or more
   - ✅ Trigger exists: YES

**What this script does:**
- Creates the `users` table if missing
- Sets up proper RLS policies for authentication
- Creates a trigger to auto-generate user profiles on signup
- Migrates existing auth.users to have profiles

---

### **Step 2: Restart Development Server**

Stop your current dev server (Ctrl+C) and run:

```powershell
cd "d:\New folder\arenax-gaming"
Remove-Item -Recurse -Force .next
npm run dev
```

This clears the Next.js cache and reloads environment variables.

---

### **Step 3: Test Login**

1. Navigate to: http://localhost:3000/login
2. Enter your credentials
3. Check browser console (F12 → Console) for any errors
4. If you see errors, screenshot them for debugging

---

### **Step 4: Verify Environment Variables**

Check that `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://pqmyslyhkxbkrbuladhq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbXlzbHloa3Via3JidWxhZGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTEzMDMsImV4cCI6MjA4OTEyNzMwM30.F8ANX81xUXe7aNpLFlJatuTgDPOqUoTaijZt91i6tfU
```

If these are missing or incorrect, update them and restart the dev server.

---

## Testing Checklist

After applying the fix, verify:

- [ ] Login page loads without errors
- [ ] Can enter email and password
- [ ] Clicking "Sign In" shows loading spinner
- [ ] Successful login redirects to `/dashboard`
- [ ] Dashboard displays user information
- [ ] No console errors in browser DevTools
- [ ] Session persists after page refresh

---

## Common Error Messages & Solutions

### Error: "Invalid login credentials"
**Cause:** Wrong email/password  
**Solution:** Double-check credentials or register a new account

### Error: "User not found"
**Cause:** Account doesn't exist in Supabase Auth  
**Solution:** Register first at `/register`

### Error: "Profile fetch error" or infinite loading
**Cause:** Missing users table or RLS policies  
**Solution:** Run the SQL fix script (Step 1)

### Error: "Network error" or no response
**Cause:** Supabase URL/Key incorrect or dev server needs restart  
**Solution:** Verify `.env.local` and restart dev server

### Error: Console shows CORS errors
**Cause:** Supabase project URL mismatch  
**Solution:** Ensure `NEXT_PUBLIC_SUPABASE_URL` matches your project exactly

---

## Manual Testing in Supabase Dashboard

To verify your Supabase setup:

1. **Check Users Table:**
   ```sql
   SELECT * FROM public.users;
   ```
   Should show user profiles

2. **Check Auth Users:**
   - Go to **Authentication** → **Users**
   - Verify users exist here

3. **Test RLS Policy:**
   ```sql
   -- This should work (authenticated query simulation)
   SET LOCAL request.jwt.claims.sub = 'your-user-id-here';
   SELECT * FROM public.users WHERE id = auth.uid();
   ```

4. **Check Triggers:**
   ```sql
   SELECT 
       trigger_name,
       event_manipulation,
       event_object_table
   FROM information_schema.triggers
   WHERE event_object_table = 'users';
   ```

---

## Creating a Test Account

If you need to create a test account:

### Option 1: Via Registration Page
1. Go to http://localhost:3000/register
2. Fill in the form
3. Submit
4. Should auto-login and redirect to dashboard

### Option 2: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Note the user ID
5. Run this SQL to create profile:
   ```sql
   INSERT INTO public.users (id, email, username)
   VALUES ('paste-user-id-here', 'test@example.com', 'testuser');
   ```

---

## Debug Mode

Enable detailed logging by adding this to your login page temporarily:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Auth response:', data)
console.log('Profile:', profile)
```

Then check browser console (F12).

---

## Next Steps After Fix

Once login works:

1. ✅ Test registration flow
2. ✅ Test Google OAuth login (if configured)
3. ✅ Test session persistence (refresh page)
4. ✅ Test protected routes (/dashboard, /tournaments)
5. ✅ Test logout functionality

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Auth Guide:** https://nextjs.org/docs/authentication
- **Project Schema:** `supabase/schema.sql`
- **Fix Script:** `supabase/complete-auth-fix.sql`

---

## Quick Reference Commands

```powershell
# Clear cache and restart
Remove-Item -Recurse -Force .next; npm run dev

# Check environment variables
Get-Content .env.local

# View running dev server logs
npm run dev

# Install dependencies (if needed)
npm install
```
