# TheLux Shipping - International Parcel Forwarding SaaS

International parcel forwarding service. Users in foreign countries get a USA address. Ship packages to that address. Forward to their international location via air/sea freight.

![Landing Page](https://github.com/user-attachments/assets/8bdd93e5-4cf5-4ccc-98e4-5abbd9e32ab7)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Payments**: Stripe (subscriptions + per-shipment charges)
- **File Storage**: Supabase Storage (package photos, documents)
- **Email**: Resend
- **Hosting**: Vercel

## Features

- ✅ Landing page with 21st.dev style features grid
- ✅ Database schema for all core tables
- 🚧 Authentication system (signup/login with USA address assignment)
- 🚧 User dashboard (packages, shipments, billing)
- 🚧 Admin portal (package reception, shipment management)
- 🚧 Shipping rate calculator
- 🚧 Payment integration (Stripe)
- 🚧 Email notifications
- 🚧 Package consolidation
- 🚧 Tracking integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Stripe account
- Resend account for emails

### Installation

1. Clone the repository
```bash
git clone https://github.com/iboss21/thelux-app-shipping.git
cd thelux-app-shipping
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase URL and keys
- Stripe keys
- Resend API key

4. Set up the database
```bash
# Run the schema.sql file in your Supabase SQL editor
# File location: supabase/schema.sql
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:
- `users` - User accounts with subscription tiers
- `usa_addresses` - Assigned USA addresses for users
- `packages` - Received packages at the warehouse
- `shipments` - International shipments
- `invoices` - Billing and payments
- `notifications` - User notifications
- `shipping_rates` - Rate cards for different shipping methods

See `supabase/schema.sql` for the complete schema with RLS policies.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   └── lib/             # Utility functions and configs
│       └── supabase/    # Supabase client setup
├── supabase/            # Database schema and migrations
└── public/              # Static assets
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase

1. Create a new Supabase project
2. Run the schema.sql in the SQL editor
3. Configure RLS policies
4. Set up storage buckets for package photos

## License

MIT

## Support

For support, email support@theluxshipping.com or open an issue in the repository.
