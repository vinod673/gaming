<<<<<<< HEAD
# gaming
gaming tournament
=======
# 🎮 ArenaX Gaming - Esports Tournament Platform

A modern, production-ready esports tournament management platform built with Next.js 14, Supabase, and cutting-edge UI/UX design.

![ArenaX Gaming](https://img.shields.io/badge/ArenaX-Gaming-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🏆 Tournament Management
- Browse and search tournaments
- Advanced filtering (game, skill level, status)
- Real-time bracket visualization
- Tournament registration system
- Live match tracking and results

### 👥 Team System
- Create and manage teams
- Invite teammates
- Team captain/co-captain roles
- Team statistics and rankings

### 📊 Leaderboards
- Global player rankings
- Team rankings
- Detailed statistics (K/D ratio, win rate, etc.)
- Seasonal leaderboards

### 🎯 Player Dashboard
- Personal tournament history
- Team memberships
- Match activity feed
- Performance statistics

### 🔐 Authentication & Security
- Email/password authentication
- Google OAuth integration
- Secure session management
- Role-based access control (Player, Admin, Moderator)

### 🛡️ Admin Panel
- Tournament creation and management
- User management
- Match result updates
- System analytics

## 🎨 Design Features

- **Dark Theme**: Modern dark esports aesthetic
- **Neon Gradients**: Purple, blue, and cyan color scheme
- **Glassmorphism**: Frosted glass card effects
- **Smooth Animations**: Framer Motion powered transitions
- **Mobile Responsive**: Optimized for all devices
- **Gaming Typography**: Orbitron font for headings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd arenax-gaming
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Set up Supabase database**

   a. Go to [Supabase](https://supabase.com) and create a new project
   
   b. In SQL Editor, run the migration script:
   ```bash
   # Copy contents of supabase/schema.sql and paste in Supabase SQL Editor
   ```
   
   c. Enable Google OAuth in Authentication → Providers

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
arenax-gaming/
├── app/                      # Next.js App Router
│   ├── auth/                 # Auth callback routes
│   ├── dashboard/            # Player dashboard
│   ├── leaderboard/          # Leaderboard page
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── tournaments/          # Tournament pages
│   │   └── [id]/            # Individual tournament
│   ├── admin/                # Admin panel
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # Shadcn UI components
│   ├── hero-section.tsx      # Hero component
│   ├── navigation.tsx        # Navigation bar
│   ├── dashboard-*.tsx       # Dashboard components
│   ├── tournament-*.tsx      # Tournament components
│   └── leaderboard-*.tsx     # Leaderboard components
├── lib/                      # Utilities and configs
│   ├── supabase/             # Supabase client
│   └── utils.ts              # Helper functions
├── supabase/                 # Database schema
│   └── schema.sql            # Full database schema
├── types/                    # TypeScript types
│   └── index.ts              # All type definitions
└── tailwind.config.ts        # Tailwind configuration
```

## 🗄️ Database Schema

The platform uses PostgreSQL via Supabase with the following tables:

- **users** - User profiles and statistics
- **teams** - Team information
- **team_members** - Team membership junction table
- **tournaments** - Tournament details
- **tournament_participants** - Tournament registrations
- **matches** - Match scheduling and results
- **match_results** - Individual player match stats
- **leaderboard** - Rankings and statistics
- **transactions** - Financial transactions
- **notifications** - User notifications
- **team_invitations** - Team invite system

All tables have Row Level Security (RLS) policies enabled for data protection.

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Modern icon library

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Relational database
- **Supabase Auth** - Authentication
- **Supabase Storage** - File storage
- **Supabase Realtime** - Real-time updates

### Deployment
- **Vercel** - Primary deployment platform
- **GoDaddy** - Alternative hosting option
- **PM2** - Process manager (for VPS)

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### GoDaddy

For GoDaddy hosting, follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in SQL Editor
3. Configure Authentication providers
4. Get API keys from Project Settings → API

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (admin) | Optional |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

## 📱 Pages & Routes

- **/** - Home page with featured tournaments
- **/tournaments** - Browse all tournaments
- **/tournaments/[id]** - Tournament details and bracket
- **/leaderboard** - Global rankings
- **/dashboard** - Player dashboard
- **/login** - User login
- **/register** - User registration
- **/admin** - Admin panel (admin only)

## 🎮 Core Features Explained

### Tournament System
- Single/double elimination brackets
- Round-robin format support
- Swiss system tournaments
- Registration deadlines
- Seed management
- Prize pool tracking

### Team Management
- Team creation with custom tags
- Captain/co-captain hierarchy
- Member invitations
- Team statistics tracking
- Logo uploads (via Supabase Storage)

### Match System
- Automated scheduling
- Live score updates
- Match result submission
- MVP awards
- Player statistics tracking

### Leaderboards
- Points-based ranking system
- K/D ratio calculations
- Win rate tracking
- Seasonal rankings
- Team and individual leaderboards

## 🔒 Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation
- XSS protection

## 🚧 Future Enhancements

- [ ] Live streaming integration (Twitch, YouTube)
- [ ] Discord bot integration
- [ ] Payment gateway for entry fees
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Anti-cheat system integration
- [ ] Chat system for teams
- [ ] Tournament highlights/VODs
- [ ] Sponsor integration
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- Open an issue on GitHub

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [Shadcn UI](https://ui.shadcn.com/)
- Backend by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">

**Built with ❤️ for the esports community**

[Report Bug](https://github.com/yourusername/arenax-gaming/issues) · [Request Feature](https://github.com/yourusername/arenax-gaming/issues)

</div>
>>>>>>> 5e05880 (Initial commit: ArenaX Gaming Platform with Next.js 15)
