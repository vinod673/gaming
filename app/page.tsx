import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/hero-section";
import { FeaturedTournaments } from "@/components/featured-tournaments";
import { StatsSection } from "@/components/stats-section";
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Fetch all data in parallel
  const [
    { data: tournaments },
    { count: totalTournaments },
    { count: totalUsers },
    { count: totalTeams }
  ] = await Promise.all([
    supabase
      .from('tournaments')
      .select(`
        *,
        organizer:users(id, username, avatar_url)
      `)
      .eq('is_featured', true)
      .eq('is_public', true)
      .order('start_date', { ascending: true })
      .limit(6),
    
    supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true }),
    
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true }),
    
    supabase
      .from('teams')
      .select('*', { count: 'exact', head: true })
  ]);

  const stats = {
    tournaments: totalTournaments || 0,
    users: totalUsers || 0,
    teams: totalTeams || 0,
    prizePool: 1250000, // Can be calculated from actual data
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection stats={stats} />
      <FeaturedTournaments tournaments={tournaments || []} />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
