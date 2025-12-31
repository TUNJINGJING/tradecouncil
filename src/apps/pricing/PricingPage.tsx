'use client';

import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';

import { Box, Button, Typography, CircularProgress } from '@mui/joy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// CSS Variables - cyber-noir design from DESIGN.md
const cssVars = {
  bgDeep: '#0a0a0a',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  textDim: '#666',
  primary: '#ffffff',
  accent: '#00E676',
  danger: '#FF1744',
  warning: '#FFC107',
};

interface PlanFeature {
  label: string;
  value: string | boolean;
}

interface Plan {
  id: 'OBSERVER' | 'TRADER' | 'ARCHITECT';
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  buttonText: string;
  isPopular?: boolean;
  accentColor: string;
}

const plans: Plan[] = [
  {
    id: 'OBSERVER',
    name: 'OBSERVER',
    tagline: 'Trial & Taste',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { label: 'Available Models', value: 'Free models only' },
      { label: 'Analysis Quota', value: '3/day + 3 premium trials/mo' },
      { label: 'Council (Multi-AI)', value: '3/day, 2 models' },
      { label: 'Fusion', value: true },
      { label: 'Strategy Library', value: false },
      { label: 'Vision (Chart)', value: 'Basic' },
      { label: 'History', value: '7 days, max 10' },
    ],
    buttonText: 'GET STARTED',
    accentColor: '#888',
  },
  {
    id: 'TRADER',
    name: 'TRADER',
    tagline: 'Daily Analysis',
    monthlyPrice: 39,
    yearlyPrice: 390,
    features: [
      { label: 'Available Models', value: 'All mainstream models' },
      { label: 'Analysis Quota', value: '500 credits/month' },
      { label: 'Council (Multi-AI)', value: '2-3 models concurrent' },
      { label: 'Fusion', value: 'All 4 types' },
      { label: 'Strategy Library', value: '8 presets' },
      { label: 'Vision (Chart)', value: 'Advanced' },
      { label: 'History', value: '90 days, unlimited' },
    ],
    buttonText: 'UPGRADE NOW',
    isPopular: true,
    accentColor: cssVars.accent,
  },
  {
    id: 'ARCHITECT',
    name: 'ARCHITECT',
    tagline: 'Expert Consensus & Deep Strategy',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { label: 'Available Models', value: 'All top models + priority' },
      { label: 'Analysis Quota', value: '1500 credits/month + rollover' },
      { label: 'Council (Multi-AI)', value: '3-5 models concurrent' },
      { label: 'Fusion', value: 'All 4 types' },
      { label: 'Strategy Library', value: '8 presets + custom (50)' },
      { label: 'Vision (Chart)', value: 'Multi-model validation' },
      { label: 'History', value: 'Permanent, unlimited' },
    ],
    buttonText: 'GO PRO',
    accentColor: cssVars.warning,
  },
];

function PricingCard({ plan, isYearly, onSelect, isLoading }: {
  plan: Plan;
  isYearly: boolean;
  onSelect: () => void;
  isLoading: boolean;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isYearly ? '/year' : '/mo';
  const savings = isYearly && plan.monthlyPrice > 0 ? `Save $${plan.monthlyPrice * 12 - plan.yearlyPrice}` : null;

  return (
    <Box sx={{
      background: plan.isPopular
        ? `linear-gradient(180deg, rgba(0, 230, 118, 0.08) 0%, #111 40%)`
        : '#111',
      border: `1px solid ${plan.isPopular ? cssVars.accent : '#333'}`,
      padding: { xs: '30px', md: '40px' },
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: plan.isPopular ? `0 0 50px rgba(0, 230, 118, 0.1)` : 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 10px 40px rgba(0, 0, 0, 0.5)`,
      },
    }}>
      {/* Popular badge */}
      {plan.isPopular && (
        <Box sx={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#000',
          color: cssVars.accent,
          border: `1px solid ${cssVars.accent}`,
          padding: '4px 16px',
          fontSize: '11px',
          letterSpacing: '2px',
          fontWeight: 600,
        }}>
          MOST POPULAR
        </Box>
      )}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{
          color: plan.accentColor,
          letterSpacing: '3px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}>
          {plan.name}
        </Typography>
        <Typography sx={{
          color: '#666',
          fontSize: '0.85rem',
          mt: 0.5,
        }}>
          {plan.tagline}
        </Typography>
      </Box>

      {/* Price */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          fontWeight: 800,
          lineHeight: 1,
          color: '#fff',
        }}>
          ${price}
          <Box component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>
            {period}
          </Box>
        </Typography>
        {savings && (
          <Typography sx={{ color: cssVars.accent, fontSize: '0.85rem', mt: 1 }}>
            {savings}
          </Typography>
        )}
      </Box>

      {/* Features */}
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, flex: 1 }}>
        {plan.features.map((feature) => (
          <Box
            key={feature.label}
            component="li"
            sx={{
              padding: '12px 0',
              borderBottom: '1px dashed #222',
              color: '#999',
              fontFamily: '"Courier New", monospace',
              fontSize: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span>{feature.label}</span>
            {typeof feature.value === 'boolean' ? (
              feature.value ? (
                <CheckIcon sx={{ color: cssVars.accent, fontSize: '1.2rem' }} />
              ) : (
                <CloseIcon sx={{ color: '#444', fontSize: '1.2rem' }} />
              )
            ) : (
              <Box component="strong" sx={{ color: '#fff', textAlign: 'right' }}>
                {feature.value}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* CTA Button */}
      <Button
        onClick={onSelect}
        disabled={isLoading}
        sx={{
          mt: 4,
          width: '100%',
          padding: '16px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '0.85rem',
          border: `1px solid ${plan.isPopular ? cssVars.accent : '#444'}`,
          background: plan.isPopular ? cssVars.accent : 'transparent',
          color: plan.isPopular ? '#000' : '#fff',
          fontWeight: plan.isPopular ? 'bold' : 'normal',
          transition: '0.2s',
          '&:hover': {
            background: '#fff',
            color: '#000',
            borderColor: '#fff',
          },
          '&:disabled': {
            opacity: 0.7,
          },
        }}
      >
        {isLoading ? <CircularProgress size="sm" /> : plan.buttonText}
      </Button>
    </Box>
  );
}

export function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isYearly, setIsYearly] = React.useState(true);
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    // OBSERVER tier - just redirect to chat
    if (plan.id === 'OBSERVER') {
      router.push('/chat');
      return;
    }

    // For paid plans, check if user is logged in
    if (status !== 'authenticated') {
      // Redirect to sign in, then back to pricing
      signIn('google', { callbackUrl: '/pricing' });
      return;
    }

    // TODO: Implement Stripe checkout (Phase 2.1)
    setLoadingPlan(plan.id);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          interval: isYearly ? 'year' : 'month',
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.message) {
        // Placeholder: Show message
        alert(data.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout temporarily unavailable. Please try again later.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: cssVars.bgDeep,
      color: cssVars.primary,
    }}>
      {/* Header */}
      <Box sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
        textAlign: 'center',
        px: 3,
      }}>
        {/* Back to home */}
        <Button
          variant="plain"
          onClick={() => router.push('/')}
          sx={{
            mb: 4,
            color: '#666',
            '&:hover': { color: '#fff' },
          }}
        >
          &larr; Back to Home
        </Button>

        <Typography component="h1" sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 200,
          mb: 2,
        }}>
          Choose Your Intelligence Tier
        </Typography>
        <Typography sx={{ color: '#666', mb: 4, maxWidth: 600, mx: 'auto' }}>
          One subscription. Access to all major AI models. No API keys needed.
        </Typography>

        {/* Billing toggle */}
        <Box sx={{
          display: 'inline-flex',
          background: '#1a1a1a',
          borderRadius: '100px',
          p: 0.5,
          gap: 0.5,
        }}>
          <Button
            variant={!isYearly ? 'solid' : 'plain'}
            onClick={() => setIsYearly(false)}
            sx={{
              borderRadius: '100px',
              px: 3,
              py: 1,
              fontSize: '0.85rem',
              background: !isYearly ? '#333' : 'transparent',
              color: !isYearly ? '#fff' : '#666',
              '&:hover': { background: !isYearly ? '#333' : 'rgba(255,255,255,0.05)' },
            }}
          >
            Monthly
          </Button>
          <Button
            variant={isYearly ? 'solid' : 'plain'}
            onClick={() => setIsYearly(true)}
            sx={{
              borderRadius: '100px',
              px: 3,
              py: 1,
              fontSize: '0.85rem',
              background: isYearly ? cssVars.accent : 'transparent',
              color: isYearly ? '#000' : '#666',
              fontWeight: isYearly ? 600 : 400,
              '&:hover': { background: isYearly ? cssVars.accent : 'rgba(255,255,255,0.05)' },
            }}
          >
            Yearly (Save 2 months)
          </Button>
        </Box>
      </Box>

      {/* Pricing Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: 3, md: 4 },
        width: '90%',
        maxWidth: '1200px',
        mx: 'auto',
        pb: 10,
      }}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
            onSelect={() => handleSelectPlan(plan)}
            isLoading={loadingPlan === plan.id}
          />
        ))}
      </Box>

      {/* Add-on credits section */}
      <Box sx={{
        py: 8,
        px: 3,
        background: '#080808',
        borderTop: '1px solid #222',
      }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          <Typography component="h2" sx={{ fontSize: '1.5rem', fontWeight: 300, mb: 2 }}>
            Need More Credits?
          </Typography>
          <Typography sx={{ color: '#666', mb: 4 }}>
            For TRADER and ARCHITECT users who need extra analysis capacity.
            Add-on credits never expire.
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
          }}>
            {[
              { name: 'Small', price: 19, credits: 200, perCredit: '$0.095' },
              { name: 'Medium', price: 49, credits: 600, perCredit: '$0.082', savings: '14% off' },
              { name: 'Large', price: 89, credits: 1200, perCredit: '$0.074', savings: '22% off' },
            ].map((pkg) => (
              <Box key={pkg.name} sx={{
                background: '#111',
                border: '1px solid #333',
                p: 3,
                textAlign: 'center',
              }}>
                <Typography sx={{ color: '#888', fontSize: '0.8rem', letterSpacing: '2px' }}>
                  {pkg.name.toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, my: 1 }}>
                  ${pkg.price}
                </Typography>
                <Typography sx={{ color: cssVars.accent, fontSize: '0.9rem' }}>
                  {pkg.credits} credits
                </Typography>
                <Typography sx={{ color: '#666', fontSize: '0.8rem', mt: 1 }}>
                  {pkg.perCredit}/credit
                  {pkg.savings && <Box component="span" sx={{ color: cssVars.accent, ml: 1 }}>({pkg.savings})</Box>}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography sx={{ color: '#444', fontSize: '0.8rem', mt: 4 }}>
            Add-on credits available after subscribing to TRADER or ARCHITECT tier.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        py: 4,
        textAlign: 'center',
        borderTop: '1px solid #1a1a1a',
      }}>
        <Typography sx={{ color: '#444', fontSize: '0.8rem' }}>
          Questions? Contact support@tradecouncil.ai
        </Typography>
      </Box>
    </Box>
  );
}
