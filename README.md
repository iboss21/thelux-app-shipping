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
- ✅ Database schema for all core tables with RLS policies
- ✅ Authentication system (signup/login with USA address assignment)
- ✅ User dashboard (packages, shipments, billing, consolidation)
- ✅ Admin portal (package reception, shipment management)
- ✅ Shipping rate calculator with multiple methods
- ✅ Payment integration (Stripe checkout, webhooks, subscriptions)
- ✅ Email notifications (6 professional HTML templates via Resend)
- ✅ Package consolidation with multi-package selection
- ✅ Tracking integration (webhooks and API endpoints)
- ✅ Billing dashboard with invoice management
- ✅ Real-time notifications system

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
│   │   ├── (auth)/       # Authentication pages (login, signup)
│   │   ├── admin/        # Admin portal pages
│   │   ├── dashboard/    # User dashboard pages
│   │   └── api/          # API routes
│   │       ├── calculate-rate/    # Shipping calculator
│   │       ├── consolidate/       # Package consolidation
│   │       ├── notify/            # Email notifications
│   │       ├── payment/           # Stripe integration
│   │       └── tracking/          # Shipment tracking
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── address/     # Custom components
│   └── lib/             # Utility functions and configs
│       ├── supabase/    # Supabase client setup
│       ├── stripe.ts    # Stripe configuration
│       ├── email.ts     # Email service (Resend)
│       └── utils.ts     # Helper functions
├── supabase/            # Database schema and migrations
├── public/              # Static assets
└── API_DOCUMENTATION.md # Complete API documentation
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard (see `.env.example`)
4. Deploy

For detailed deployment instructions, see [SETUP.md](SETUP.md)

### Supabase

1. Create a new Supabase project
2. Run the schema.sql in the SQL editor
3. Configure RLS policies (included in schema)
4. Set up storage buckets for package photos

### Stripe

1. Create products for subscription tiers
2. Set up webhook endpoint: `/api/payment/webhook`
3. Configure webhook events (see API_DOCUMENTATION.md)

### Resend

1. Create account and get API key
2. Verify sending domain (recommended)
3. Configure FROM_EMAIL environment variable

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Available Endpoints:**
- `POST /api/calculate-rate` - Calculate shipping costs
- `POST /api/consolidate` - Create package consolidation
- `POST /api/payment/checkout` - Create Stripe checkout session
- `POST /api/payment/webhook` - Stripe webhook handler
- `POST /api/tracking` - Tracking webhook
- `GET /api/tracking` - Get tracking info
- `POST /api/notify` - Trigger email notification

## Testing

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Security

- ✅ Row-level security (RLS) on all database tables
- ✅ Protected API routes with authentication
- ✅ Stripe webhook signature verification
- ✅ Input validation on all endpoints
- ✅ Environment variable protection
- ✅ CodeQL security scan passed (0 vulnerabilities)

## License

MIT

## Support

For support, email support@theluxshipping.com or open an issue in the repository.
