# Embrace Boxing Website

A modern website for Embrace Boxing – women's boxing classes in London. Built with Next.js 14, Supabase, and Stripe.

## Features

- **Membership plans**: Free trial, 10-class pack (£140), Unlimited (£95.99/month)
- **Class booking**: Book Tuesday Boxing, Saturday Boxing, or Sunday Muay Thai
- **User accounts**: Sign up, manage subscription, view bookings
- **Content pages**: About, Personal Training (WhatsApp), Coaches
- **Stripe payments**: Checkout for 10-class and unlimited plans

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema in the SQL Editor: `supabase/schema.sql`
3. In Supabase Auth settings, add your site URL and redirect URLs (e.g. `http://localhost:3000`, `https://yoursite.com`)
4. Add redirect URL: `http://localhost:3000/auth/callback`

### 3. Stripe

1. Create products in Stripe Dashboard:
   - **10-Class Pack**: One-time payment £140, get the Price ID
   - **Unlimited Plan**: Recurring £95.99/month, get the Price ID

2. Create a webhook endpoint: `https://yoursite.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret

### 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_10CLASS=price_xxx
STRIPE_PRICE_UNLIMITED=price_xxx
```

### 5. Personal Training page

Update the WhatsApp number in `app/personal-training/page.tsx`:

```ts
const WHATSAPP_NUMBER = "447700000000"; // Replace with Ruqsana's number
```

### 6. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Set up Stripe webhook URL to `https://yourdomain.com/api/stripe/webhook`
5. Add Supabase redirect URLs for your production domain

## Project structure

- `app/` – Next.js App Router pages and API routes
- `components/` – React components
- `lib/` – Supabase clients, Stripe config
- `supabase/` – Database schema
# Embrace
