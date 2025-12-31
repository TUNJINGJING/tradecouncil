import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '~/server/supabase/client';

// Stripe webhook event types we handle
type StripeEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

// Placeholder: Stripe webhook handler
// TODO: Implement when Stripe account is ready
export async function POST(req: NextRequest) {
  try {
    // Get the webhook signature
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.log('[Stripe Webhook] No signature provided');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Check if Stripe webhook secret is configured
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('[Stripe Webhook] Webhook secret not configured');
      return NextResponse.json(
        { received: true, message: 'Webhook secret not configured' },
        { status: 200 }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();

    // TODO: Verify webhook signature with Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    // Placeholder: Parse event without verification
    const event = JSON.parse(body) as {
      type: StripeEventType;
      data: {
        object: {
          id: string;
          customer: string;
          subscription?: string;
          metadata?: {
            userId?: string;
            planId?: string;
            interval?: string;
          };
          status?: string;
        };
      };
    };

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        console.log('[Stripe Webhook] Payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout
async function handleCheckoutCompleted(session: {
  id: string;
  customer: string;
  subscription?: string;
  metadata?: {
    userId?: string;
    planId?: string;
    interval?: string;
  };
}) {
  console.log('[Stripe Webhook] Checkout completed:', session.id);

  const { userId, planId } = session.metadata || {};

  if (!userId || !planId) {
    console.error('[Stripe Webhook] Missing metadata in checkout session');
    return;
  }

  // Update user tier in database
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      tier: planId as 'TRADER' | 'ARCHITECT',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('[Stripe Webhook] Failed to update user tier:', error);
    return;
  }

  // Create subscription record
  const { error: subError } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      tier: planId,
      status: 'active',
      interval: session.metadata?.interval || 'month',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + (session.metadata?.interval === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

  if (subError) {
    console.error('[Stripe Webhook] Failed to create subscription:', subError);
  }

  console.log(`[Stripe Webhook] User ${userId} upgraded to ${planId}`);
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: {
  id: string;
  customer: string;
  status?: string;
}) {
  console.log('[Stripe Webhook] Subscription updated:', subscription.id);

  // TODO: Update subscription status in database
  // const { error } = await supabaseAdmin
  //   .from('subscriptions')
  //   .update({ status: subscription.status })
  //   .eq('stripe_subscription_id', subscription.id);
}

// Handle subscription cancellation
async function handleSubscriptionDeleted(subscription: {
  id: string;
  customer: string;
}) {
  console.log('[Stripe Webhook] Subscription deleted:', subscription.id);

  // Find and update the subscription
  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (sub?.user_id) {
    // Downgrade user to OBSERVER
    await supabaseAdmin
      .from('users')
      .update({
        tier: 'OBSERVER',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.user_id);

    // Mark subscription as cancelled
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`[Stripe Webhook] User ${sub.user_id} downgraded to OBSERVER`);
  }
}

// Handle failed payments
async function handlePaymentFailed(invoice: {
  id: string;
  customer: string;
  subscription?: string;
}) {
  console.log('[Stripe Webhook] Payment failed:', invoice.id);

  // TODO: Send notification to user
  // TODO: Update subscription status to 'past_due'
}
