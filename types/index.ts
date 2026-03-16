// ============================================
// USER TYPES
// ============================================
export type UserRole = 'player' | 'admin' | 'moderator';
export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  gaming_platform: string | null;
  gaming_id: string | null;
  role: UserRole;
  total_wins: number;
  total_losses: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  points: number;
  rank_tier: RankTier;
  wallet_balance: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  teams: Team[];
  tournaments: Tournament[];
}

// ============================================
// TEAM TYPES
// ============================================
export type TeamMemberRole = 'captain' | 'co_captain' | 'member';

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo_url: string | null;
  description: string | null;
  captain_id: string;
  co_captain_id: string | null;
  total_wins: number;
  total_losses: number;
  points: number;
  max_members: number;
  is_recruiting: boolean;
  discord_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamWithMembers extends Team {
  captain: User;
  co_captain: User | null;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  joined_at: string;
  user: User;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  invited_by: string;
  invited_user_id: string | null;
  invited_email: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string | null;
  created_at: string;
  team: Team;
  invited_by_user: User;
}

// ============================================
// TOURNAMENT TYPES
// ============================================
export type TournamentStatus = 'draft' | 'upcoming' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
export type SkillLevel = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'pro';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  game_title: string;
  game_mode: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  max_teams: number;
  min_teams: number;
  registered_teams: number;
  team_size: number;
  prize_pool: number;
  entry_fee: number;
  currency: string;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  rules: string | null;
  schedule: Record<string, unknown> | null;
  bracket_data: Record<string, unknown> | null;
  banner_url: string | null;
  organizer_id: string;
  region: string | null;
  skill_level: SkillLevel;
  is_featured: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TournamentWithDetails extends Tournament {
  organizer: User;
  participants: TournamentParticipant[];
  matches: Match[];
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  team_id: string | null;
  user_id: string | null;
  registration_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  seed_number: number | null;
  team?: Team;
  user?: User;
}

// ============================================
// MATCH TYPES
// ============================================
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed';

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  team1_id: string | null;
  team2_id: string | null;
  team1_score: number;
  team2_score: number;
  winner_id: string | null;
  scheduled_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: MatchStatus;
  stream_url: string | null;
  vod_url: string | null;
  bracket_position: string | null;
  next_match_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchWithDetails extends Match {
  tournament: Tournament;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  results: MatchResult[];
}

export interface MatchResult {
  id: string;
  match_id: string;
  team_id: string;
  player_id: string | null;
  kills: number;
  deaths: number;
  assists: number;
  damage_dealt: number;
  damage_taken: number;
  healing_done: number;
  objective_score: number;
  mvp: boolean;
  created_at: string;
  player?: User;
  team?: Team;
}

// ============================================
// LEADERBOARD TYPES
// ============================================
export interface LeaderboardEntry {
  id: string;
  user_id: string | null;
  team_id: string | null;
  tournament_id: string | null;
  season: string | null;
  wins: number;
  losses: number;
  draws: number;
  total_matches: number;
  total_kills: number;
  total_deaths: number;
  total_assists: number;
  points: number;
  win_rate: number;
  kd_ratio: number;
  rank_position: number | null;
  last_updated: string;
  user?: User;
  team?: Team;
  tournament?: Tournament;
}

// ============================================
// TRANSACTION TYPES
// ============================================
export type TransactionType = 'deposit' | 'withdrawal' | 'entry_fee' | 'prize' | 'refund' | 'bonus';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string | null;
  tournament_id: string | null;
  match_id: string | null;
  payment_method: string | null;
  payment_provider: string | null;
  external_transaction_id: string | null;
  processed_at: string | null;
  created_at: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ============================================
// FORM TYPES
// ============================================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateTeamFormData {
  name: string;
  tag: string;
  description: string;
  max_members: number;
}

export interface CreateTournamentFormData {
  name: string;
  description: string;
  game_title: string;
  game_mode: string;
  format: TournamentFormat;
  max_teams: number;
  team_size: number;
  prize_pool: number;
  entry_fee: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  rules: string;
  region: string;
  skill_level: SkillLevel;
}

// ============================================
// FILTER TYPES
// ============================================
export interface TournamentFilters {
  status?: TournamentStatus;
  game_title?: string;
  skill_level?: SkillLevel;
  region?: string;
  search?: string;
}

export interface LeaderboardFilters {
  season?: string;
  tournament_id?: string;
  timeframe?: 'all_time' | 'monthly' | 'weekly';
}
