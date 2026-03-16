-- ArenaX Gaming - Supabase Database Schema
-- This schema creates all tables, relationships, indexes, and triggers for the esports tournament platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
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

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    tag VARCHAR(10) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    captain_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    co_captain_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    total_wins INTEGER DEFAULT 0,
    total_losses INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 5,
    is_recruiting BOOLEAN DEFAULT true,
    discord_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAM MEMBERS TABLE (Junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('captain', 'co_captain', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- ============================================
-- TOURNAMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    game_title VARCHAR(100) NOT NULL,
    game_mode VARCHAR(50),
    format VARCHAR(50) DEFAULT 'single_elimination' CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled')),
    max_teams INTEGER NOT NULL,
    min_teams INTEGER DEFAULT 2,
    registered_teams INTEGER DEFAULT 0,
    team_size INTEGER DEFAULT 5,
    prize_pool DECIMAL(12,2) DEFAULT 0.00,
    entry_fee DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    rules TEXT,
    schedule JSONB,
    bracket_data JSONB,
    banner_url TEXT,
    organizer_id UUID NOT NULL REFERENCES public.users(id),
    region VARCHAR(50),
    skill_level VARCHAR(20) DEFAULT 'all' CHECK (skill_level IN ('all', 'beginner', 'intermediate', 'advanced', 'pro')),
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TOURNAMENT PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
    seed_number INTEGER,
    CHECK (
        (team_id IS NOT NULL AND user_id IS NULL) OR
        (team_id IS NULL AND user_id IS NOT NULL)
    ),
    UNIQUE(tournament_id, team_id),
    UNIQUE(tournament_id, user_id)
);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    team1_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    team2_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled', 'postponed')),
    stream_url TEXT,
    vod_url TEXT,
    bracket_position VARCHAR(50),
    next_match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MATCH RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.match_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    damage_dealt INTEGER DEFAULT 0,
    damage_taken INTEGER DEFAULT 0,
    healing_done INTEGER DEFAULT 0,
    objective_score INTEGER DEFAULT 0,
    mvp BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LEADERBOARD TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    season VARCHAR(20),
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    total_kills INTEGER DEFAULT 0,
    total_deaths INTEGER DEFAULT 0,
    total_assists INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    kd_ratio DECIMAL(5,2) DEFAULT 0.00,
    rank_position INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (user_id IS NOT NULL AND team_id IS NULL) OR
        (user_id IS NULL AND team_id IS NOT NULL)
    )
);

-- ============================================
-- TRANSACTIONS TABLE (Wallet/Payments)
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'entry_fee', 'prize', 'refund', 'bonus')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),
    external_transaction_id VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAM INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES public.users(id),
    invited_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    invited_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (invited_user_id IS NOT NULL) OR (invited_email IS NOT NULL)
    )
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_points ON public.users(points DESC);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_captain ON public.teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_teams_points ON public.teams(points DESC);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);

-- Tournaments indexes
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON public.tournaments(start_date);
CREATE INDEX IF NOT EXISTS idx_tournaments_game ON public.tournaments(game_title);
CREATE INDEX IF NOT EXISTS idx_tournaments_organizer ON public.tournaments(organizer_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_featured ON public.tournaments(is_featured) WHERE is_featured = true;

-- Tournament participants indexes
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON public.tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_team ON public.tournament_participants(team_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON public.tournament_participants(user_id);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled ON public.matches(scheduled_time);

-- Match results indexes
CREATE INDEX IF NOT EXISTS idx_match_results_match ON public.match_results(match_id);
CREATE INDEX IF NOT EXISTS idx_match_results_player ON public.match_results(player_id);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON public.leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_team ON public.leaderboard(team_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_tournament ON public.leaderboard(tournament_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON public.leaderboard(points DESC);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update tournament registered teams count
CREATE OR REPLACE FUNCTION update_tournament_registered_teams()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE public.tournaments 
        SET registered_teams = registered_teams + 1
        WHERE id = NEW.tournament_id;
    ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved') THEN
        UPDATE public.tournaments 
        SET registered_teams = GREATEST(registered_teams - 1, 0)
        WHERE id = COALESCE(NEW.tournament_id, OLD.tournament_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tournament_teams
    AFTER INSERT OR UPDATE OR DELETE ON public.tournament_participants
    FOR EACH ROW EXECUTE FUNCTION update_tournament_registered_teams();

-- Function to update user stats from match results
CREATE OR REPLACE FUNCTION update_user_stats_from_match()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET 
        total_kills = total_kills + NEW.kills,
        total_deaths = total_deaths + NEW.deaths,
        total_assists = total_assists + NEW.assists
    WHERE id = NEW.player_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT ON public.match_results
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_from_match();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Team captains can update their team" ON public.teams
    FOR UPDATE USING (auth.uid() = captain_id);

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.uid() = captain_id);

-- Team members policies
CREATE POLICY "Team members are viewable by everyone" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Team captains can manage members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE id = team_members.team_id 
            AND captain_id = auth.uid()
        )
    );

-- Tournaments policies
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
    FOR SELECT USING (true);

CREATE POLICY "Admins and organizers can create tournaments" ON public.tournaments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        ) OR auth.uid() = organizer_id
    );

CREATE POLICY "Admins and organizers can update tournaments" ON public.tournaments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        ) OR auth.uid() = organizer_id
    );

-- Tournament participants policies
CREATE POLICY "Participants are viewable by everyone" ON public.tournament_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can register for tournaments" ON public.tournament_participants
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT user_id FROM public.team_members WHERE team_id = tournament_participants.team_id
    ) OR auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Matches are viewable by everyone" ON public.matches
    FOR SELECT USING (true);

CREATE POLICY "Admins and organizers can update matches" ON public.matches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        ) OR EXISTS (
            SELECT 1 FROM public.tournaments 
            WHERE id = matches.tournament_id 
            AND organizer_id = auth.uid()
        )
    );

-- Match results policies
CREATE POLICY "Match results are viewable by everyone" ON public.match_results
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage match results" ON public.match_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Leaderboard policies
CREATE POLICY "Leaderboard is viewable by everyone" ON public.leaderboard
    FOR SELECT USING (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Team invitations policies
CREATE POLICY "Users can view own invitations" ON public.team_invitations
    FOR SELECT USING (
        auth.uid() = invited_user_id OR 
        auth.uid() IN (SELECT captain_id FROM public.teams WHERE id = team_invitations.team_id)
    );

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default admin user (to be linked with auth.users)
-- Note: This will be linked after creating the auth user in Supabase Dashboard

-- Insert sample tournaments
INSERT INTO public.tournaments (
    name, description, game_title, game_mode, format, status,
    max_teams, team_size, prize_pool, entry_fee,
    start_date, end_date, registration_deadline,
    rules, region, skill_level, is_featured, is_public, organizer_id
) VALUES 
(
    'ArenaX Championship 2024',
    'The ultimate esports championship featuring the best teams competing for glory and massive prizes.',
    'Valorant',
    '5v5',
    'double_elimination',
    'registration_open',
    32, 5, 50000.00, 100.00,
    '2024-04-01 18:00:00+00', '2024-04-15 22:00:00+00', '2024-03-28 23:59:59+00',
    'Standard tournament rules apply. All matches are BO3 except finals which are BO5.',
    'Global',
    'all',
    true, true,
    (SELECT id FROM public.users LIMIT 1)
),
(
    'Pro League Season 5',
    'Weekly competitive league for professional and semi-professional teams.',
    'Counter-Strike 2',
    '5v5',
    'round_robin',
    'upcoming',
    16, 5, 25000.00, 50.00,
    '2024-04-10 19:00:00+00', '2024-05-10 21:00:00+00', '2024-04-05 23:59:59+00',
    'Round robin format. Top 8 teams advance to playoffs.',
    'North America',
    'advanced',
    true, true,
    (SELECT id FROM public.users LIMIT 1)
),
(
    'Weekend Warriors Cup',
    'Casual weekend tournament for players of all skill levels.',
    'Apex Legends',
    'Trios',
    'single_elimination',
    'upcoming',
    64, 3, 5000.00, 10.00,
    '2024-03-23 16:00:00+00', '2024-03-24 20:00:00+00', '2024-03-22 23:59:59+00',
    'Single elimination bracket. All matches are BO1 except semifinals and finals.',
    'Europe',
    'all',
    false, true,
    (SELECT id FROM public.users LIMIT 1)
);

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;
