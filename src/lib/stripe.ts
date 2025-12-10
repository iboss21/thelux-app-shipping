import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : null

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    storage_days: 30,
    consolidation_fee: 5,
  },
  standard: {
    name: 'Standard',
    price: 9.99,
    priceId: process.env.STRIPE_STANDARD_PRICE_ID,
    storage_days: 60,
    consolidation_fee: 3,
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    storage_days: 90,
    consolidation_fee: 0,
  },
} as const
