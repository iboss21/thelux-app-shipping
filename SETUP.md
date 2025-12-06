# TheLux Shipping - Setup Guide

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18 or later
- A Supabase account (https://supabase.com)
- A Stripe account (https://stripe.com)
- A Resend account for emails (https://resend.com)
- A Vercel account for deployment (optional, https://vercel.com)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iboss21/thelux-app-shipping.git
cd thelux-app-shipping
npm install
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready (this may take a few minutes)
3. Go to Project Settings > API to get your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (from Service Role section)

4. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run the SQL

5. Set up Storage Buckets:
   - Go to Storage in Supabase dashboard
   - Create a new bucket called `package-photos`
   - Make it private
   - Create another bucket called `documents` for invoices and customs forms

### 3. Set Up Stripe

1. Go to https://stripe.com and create an account
2. Get your API keys from Developers > API keys:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

3. Set up webhooks:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `invoice.payment_succeeded`, `invoice.payment_failed`
   - Get the webhook secret: `STRIPE_WEBHOOK_SECRET`

4. Create Products in Stripe:
   - Create subscription products for Free, Standard, and Premium tiers
   - Set prices: $0/month, $15/month, $40/month

### 4. Set Up Resend

1. Go to https://resend.com and create an account
2. Get your API key from API Keys section: `RESEND_API_KEY`
3. Verify your sending domain (optional but recommended)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 7. Create Admin User

1. Sign up for an account at http://localhost:3000/signup
2. Go to Supabase > Table Editor > users table
3. Find your user record and change `role` from `user` to `admin`
4. You can now access the admin panel at http://localhost:3000/admin

## Deployment to Vercel

### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Import to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables

Add all the environment variables from your `.env.local` file to Vercel:
- Go to Settings > Environment Variables
- Add each variable (without the `NEXT_PUBLIC_` prefix for public variables, they stay the same)
- Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

### 4. Deploy

Click "Deploy" and wait for the deployment to complete.

### 5. Update Stripe Webhook

Update your Stripe webhook endpoint to point to your Vercel domain:
- Old: `http://localhost:3000/api/webhooks/stripe`
- New: `https://your-domain.vercel.app/api/webhooks/stripe`

## Post-Deployment Configuration

### 1. Configure Email Templates

Create email templates in Resend for:
- Package received notification
- Shipment created notification
- Delivery confirmation
- Invoice due reminder

### 2. Set Up Shipping Integrations (Optional)

For production use, you'll want to integrate with:
- **ShipStation API**: For label generation
  - Get API key from ShipStation dashboard
  - Add to environment variables
- **Tracking APIs**: DHL, FedEx, UPS for real-time tracking
- **Freightos API**: For sea freight quotes

### 3. Configure Payment Methods

In Stripe dashboard:
- Enable payment methods you want to accept (cards, ACH, etc.)
- Set up automatic invoicing
- Configure failed payment handling

### 4. Set Up Analytics (Optional)

- Add PostHog or Mixpanel for user analytics
- Track events: signup, package_received, shipment_created, etc.

## Testing

### Test User Flow

1. Sign up as a new user
2. Note your USA address (suite number)
3. As admin, receive a package using that suite number
4. Check that you receive a notification
5. View the package in your dashboard
6. Test the shipping rate calculator

### Test Admin Flow

1. Log in as admin
2. Receive a test package
3. View packages queue
4. Manage shipments

## Troubleshooting

### Database Connection Issues

- Check that your Supabase credentials are correct
- Verify RLS policies are enabled
- Check that the schema has been run

### Authentication Issues

- Clear cookies and try again
- Check Supabase Auth settings
- Verify email confirmation settings

### Build Errors

- Run `npm run build` locally to check for errors
- Check that all environment variables are set
- Clear `.next` folder and rebuild

## Support

For issues and questions:
- GitHub Issues: https://github.com/iboss21/thelux-app-shipping/issues
- Email: support@theluxshipping.com

## License

MIT License - see LICENSE file for details
