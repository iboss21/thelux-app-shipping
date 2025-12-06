import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendInvoiceEmail } from '@/lib/email'

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.invoice_id) {
          // Update invoice status to paid
          const { error: updateError } = await supabaseAdmin
            .from('invoices')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              stripe_invoice_id: session.payment_intent as string,
            })
            .eq('id', session.metadata.invoice_id)

          if (updateError) {
            console.error('Failed to update invoice:', updateError)
          }

          // Get user email for confirmation
          const { data: userData } = await supabaseAdmin
            .from('users')
            .select('email, name')
            .eq('id', session.metadata.user_id)
            .single()

          if (userData?.email) {
            // Send payment confirmation email
            await sendInvoiceEmail(userData.email, {
              userName: userData.name,
              invoiceId: session.metadata.invoice_id,
              amount: (session.amount_total || 0) / 100,
              type: session.metadata.type || 'payment',
              dueDate: 'Paid',
            })
          }
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        
        // Update invoice status to failed if metadata exists
        if (paymentIntent.metadata?.invoice_id) {
          await supabaseAdmin
            .from('invoices')
            .update({ status: 'failed' })
            .eq('id', paymentIntent.metadata.invoice_id)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update user subscription tier
        const customer = subscription.customer as string
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customer)
          .single()

        if (userData) {
          // Determine tier based on price
          let tier = 'free'
          if (subscription.items.data[0]?.price.id === process.env.STRIPE_STANDARD_PRICE_ID) {
            tier = 'standard'
          } else if (subscription.items.data[0]?.price.id === process.env.STRIPE_PREMIUM_PRICE_ID) {
            tier = 'premium'
          }

          await supabaseAdmin
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', userData.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = subscription.customer as string
        
        // Downgrade to free tier
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customer)
          .single()

        if (userData) {
          await supabaseAdmin
            .from('users')
            .update({ subscription_tier: 'free' })
            .eq('id', userData.id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
