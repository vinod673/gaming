import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap', // Better font loading
  preload: true,   // Preload critical fonts
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-gaming',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "ArenaX Gaming | Esports Tournament Platform",
  description: "Join the ultimate esports tournament platform. Compete in professional gaming tournaments, build your team, and climb the global leaderboards.",
  keywords: "esports, gaming, tournaments, competitive gaming, esports platform, gaming tournaments",
  openGraph: {
    title: "ArenaX Gaming | Esports Tournament Platform",
    description: "Join the ultimate esports tournament platform. Compete in professional gaming tournaments.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArenaX Gaming",
    description: "Ultimate esports tournament platform",
  },
  // Performance: Preconnect to external domains
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user data for navigation (optimized)
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  let user = null;
  if (authUser) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();
    user = profile;
  }

  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        {/* Performance: DNS prefetching */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans min-h-screen antialiased">
        <Navigation user={user} />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
