import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '~/server/auth/auth.config';

// Stripe Price IDs (placeholder - configure in Vercel environment)
const STRIPE_PRICES = {
  TRADER: {
    month: process.env.STRIPE_PRICE_TRADER_MONTHLY,
    year: process.env.STRIPE_PRICE_TRADER_YEARLY,
  },
  ARCHITECT: {
    month: process.env.STRIPE_PRICE_ARCHITECT_MONTHLY,
    year: process.env.STRIPE_PRICE_ARCHITECT_YEARLY,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { planId, interval } = body as {
      planId: 'TRADER' | 'ARCHITECT';
      interval: 'month' | 'year';
    };

    // Validate plan
    if (!['TRADER', 'ARCHITECT'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get price ID
    const priceId = STRIPE_PRICES[planId]?.[interval];

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      // Placeholder response when Stripe is not configured
      return NextResponse.json({
        message: `Stripe checkout is being configured. You selected ${planId} (${interval}ly). Please check back soon!`,
        planId,
        interval,
        configured: false,
      });
    }

    // TODO: Implement actual Stripe checkout when keys are available
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //
    // // Create or get Stripe customer
    // const customer = await getOrCreateStripeCustomer(session.user.email);
    //
    // // Create checkout session
    // const checkoutSession = await stripe.checkout.sessions.create({
    //   customer: customer.id,
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${process.env.NEXTAUTH_URL}/chat?upgrade=success`,
    //   cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    //   metadata: {
    //     userId: session.user.id,
    //     planId,
    //     interval,
    //   },
    // });
    //
    // return NextResponse.json({ url: checkoutSession.url });

    // Placeholder: Return message instead of checkout URL
    return NextResponse.json({
      message: `Stripe integration coming soon! You selected ${planId} (${interval}ly) plan.`,
      planId,
      interval,
      configured: false,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
