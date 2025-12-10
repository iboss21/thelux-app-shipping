# TheLux International Parcel Forwarding Service

International parcel forwarding service that enables users in foreign countries to receive a unique USA address. They can ship packages to that address, and the service forwards them to their international location via air or sea freight.

## Features

- **Unique USA Addresses**: Each user receives a unique suite number at our Miami, FL warehouse
- **Package Tracking**: Track packages from receipt to delivery
- **Multiple Shipping Options**: Choose between air freight (7 days) or sea freight (30 days)
- **Cost Calculator**: Calculate shipping costs based on weight, method, and destination
- **RESTful API**: Complete API for integration with external systems
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

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iboss21/thelux-app-shipping.git
   cd thelux-app-shipping
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The server will start on http://localhost:3000 with auto-reload on file changes.

#### Production Mode
```bash
npm run build
npm start
```

### Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Documentation

See [API.md](./API.md) for complete API documentation.

### Quick Start Example

1. Create a user and get their USA address:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "homeCountry": "United Kingdom",
       "homeAddress": "10 Downing Street, London"
     }'
   ```

2. Register a received package:
   ```bash
   curl -X POST http://localhost:3000/api/packages \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "USER_ID",
       "trackingNumber": "TRACK123",
       "description": "Books",
       "weight": 2.5,
       "dimensions": {"length": 30, "width": 20, "height": 15}
     }'
   ```

3. Forward the package:
   ```bash
   curl -X POST http://localhost:3000/api/packages/PACKAGE_ID/forward \
     -H "Content-Type: application/json" \
     -d '{
       "shippingMethod": "AIR_FREIGHT",
       "destinationAddress": "10 Downing Street, London",
       "destinationCountry": "United Kingdom"
     }'
   ```
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
thelux-app-shipping/
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/           # Data types and interfaces
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── index.ts          # Application entry point
├── dist/                 # Compiled JavaScript (generated)
├── node_modules/         # Dependencies (generated)
├── API.md               # API documentation
├── package.json         # Project metadata
├── tsconfig.json        # TypeScript configuration
└── jest.config.js       # Test configuration
```

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Jest
- **Development**: ts-node, nodemon

## How It Works

1. **User Registration**: Users from foreign countries register and receive a unique USA warehouse address with a suite number (e.g., Suite STE-12345, 1234 Shipping Way, Miami, FL 33101)

2. **Package Receipt**: When packages arrive at the warehouse, they're registered in the system with tracking information

3. **Forwarding Options**:
   - **Air Freight**: Fast delivery (~7 days), higher cost
   - **Sea Freight**: Economy delivery (~30 days), lower cost

4. **Cost Calculation**: Shipping costs are calculated based on:
   - Package weight
   - Shipping method (air/sea)
   - Destination region

5. **Package Forwarding**: Packages are consolidated and shipped to the user's international address

6. **Status Tracking**: Users can track their packages through various statuses:
   - AWAITING_ARRIVAL
   - RECEIVED
   - PROCESSING
   - IN_TRANSIT
   - DELIVERED
   - EXCEPTION

## License

ISC
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
