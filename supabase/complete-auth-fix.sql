-- ============================================
-- COMPLETE FIX: Supabase Authentication Setup
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    country VARCHAR(100),
    gaming_platform VARCHAR(50),
    gaming_id VARCHAR(100),
    role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'admin', 'moderator')),
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0,
    total_kills INTEGER DEFAULT 0,
    total_deaths INTEGER DEFAULT 0,
    total_assists INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    rank_tier VARCHAR(20) DEFAULT 'bronze',
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_points ON public.users(points DESC);

-- Step 4: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can insert new profiles" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.users;

-- Step 5: Create RLS Policies
-- Allow anyone to view user profiles (for leaderboards, etc.)
CREATE POLICY "Users can view all profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Allow authenticated users to create their own profile
CREATE POLICY "Users can create own profile"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Step 6: Create trigger function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, username, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Update existing auth.users to have profiles (if any exist without profiles)
INSERT INTO public.users (id, email, username, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'username',
        SPLIT_PART(au.email, '@', 1),
        'user_' || SUBSTRING(au.id::text, 1, 8)
    ),
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 9: Verify the setup
SELECT 
    'Table exists' as check_type,
    COUNT(*)::text as result
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name = 'users'

UNION ALL

SELECT 
    'RLS enabled' as check_type,
    CASE WHEN relrowsecurity THEN 'YES' ELSE 'NO' END as result
FROM pg_class
WHERE oid = 'public.users'::regclass

UNION ALL

SELECT 
    'Policies count' as check_type,
    COUNT(*)::text as result
FROM pg_policies
WHERE tablename = 'users'

UNION ALL

SELECT 
    'Trigger exists' as check_type,
    CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END as result
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name = 'on_auth_user_created';

-- Step 10: Show current users
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    u.created_at,
    'Profile OK' as status
FROM public.users u
ORDER BY u.created_at DESC;
