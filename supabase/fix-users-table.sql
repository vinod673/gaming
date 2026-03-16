-- ============================================
-- FIX: Create users table if it doesn't exist
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
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

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Allow authenticated users to insert new user profiles (for registration)
CREATE POLICY "Authenticated users can insert new profiles"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view all user profiles (for leaderboards, etc.)
CREATE POLICY "Authenticated users can view all profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamp
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Check if table exists
SELECT 
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';
