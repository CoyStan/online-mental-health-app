# Thrive 5 Maternal Wellness App

A beautiful, evidence-based mental health support platform for mothers during pregnancy and the first years of their baby's life. Built for NGOs serving under-resourced communities.

## Based on WashU Research

This app is built on the **Thrive 5** framework from Washington University in St. Louis research published in JAMA Pediatrics. The research identified 5 key factors that support infant brain development even in adverse conditions:

1. **Environmental Stimulation** - Talking, eye contact, exposure to interesting stimuli
2. **Nutrition** - Feeding baby AND mother (no judgment on breast vs formula)
3. **Neighborhood Safety** - Coping strategies for unsafe environments
4. **Positive Caregiving** - Bonding, responsive parenting, emotional presence
5. **Sleep & Circadian Rhythms** - Regular sleep patterns for baby and parent

## Features

### For Mothers
- 📝 **Wellness Assessment Survey** - Personalized check-in covering all 5 Thrive factors
- 🗺️ **Visual Journey Map** - Game-like node network showing progress through content
- 📚 **Research-Backed Content** - Educational articles, practical exercises, coping strategies
- 👩‍⚕️ **Coaching Support** - 1-on-1 Zoom sessions with trained coaches
- 📈 **Progress Tracking** - Visual feedback on completed tracks

### For Coaches
- 👥 **Caseload Management** - View all assigned mothers and their progress
- 📅 **Session Scheduling** - Book and manage Zoom sessions
- 📝 **Session Notes** - Private notes with risk assessment, action items
- 🎯 **Homework Assignment** - Assign specific content for mothers to review

### For Admins
- 👤 **User Management** - View all users, filter by role
- 📊 **Analytics Dashboard** - Track engagement, completion rates, Thrive factor scores
- 📝 **Content Management** - Add/edit tracks and content without coding
- 👩‍🏫 **Coach Management** - Assign coaches to mothers, manage profiles
- 📤 **Data Export** - Anonymized data export for grant reporting

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animated gradients
- **Database**: Prisma ORM with SQLite (easily migrates to PostgreSQL)
- **Authentication**: NextAuth.js with credentials provider
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd online-mental-health-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Seed the database with Thrive 5 content
npm run db:seed

# Start development server
npm run dev
```

### Default Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@thrive5.org | admin123 |
| Demo User | demo@example.com | demo123 |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── coach/              # Coach dashboard pages
│   ├── coaching/           # Mom's coaching interface
│   ├── content/            # Content viewing pages
│   ├── dashboard/          # Main user dashboard
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── survey/             # Wellness survey
│   └── tracks/             # Track visualization
├── components/             # Reusable components
├── lib/                    # Utilities (Prisma, Auth)
└── types/                  # TypeScript definitions

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data with Thrive 5 content
```

## Design Philosophy

The app is designed with the target audience in mind:
- **Mobile-first** - Most users access via phones
- **Calming aesthetics** - Gradient backgrounds, soft colors, smooth animations
- **Simple language** - 8th grade reading level, no jargon
- **Empowering tone** - Acknowledges hardship without toxic positivity
- **Practical focus** - Adapts to limited resources and tough situations

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. For production, switch to PostgreSQL (update `DATABASE_URL`)

### Environment Variables

```env
DATABASE_URL="file:./dev.db"  # Or PostgreSQL URL for production
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## Contributing

This is an open-source project for maternal mental health support. Contributions welcome!

## License

MIT License - Built with 💜 for maternal mental health support.

---

**Crisis Resources**

If you're struggling:
- Postpartum Support International: 1-800-944-4773
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
