# TradeCouncil Phase 2 Technical Specification

**Version:** 1.0
**Date:** 2025-12-30
**Status:** Ready for Implementation

---

## 📋 Executive Summary

**Objective:** Implement user authentication, subscription system, and usage quota management for TradeCouncil.

**Approach:** Incremental rollout
- **Phase 2.0:** Auth + Supabase + All features unlocked (No paywall)
- **Phase 2.1:** Add paywall + Usage limits + Stripe integration

**Tech Stack:**
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js v4 + Google OAuth
- **Payment:** Stripe (deferred to Phase 2.1)
- **Storage:** Local (IndexedDB/localStorage) - No cloud sync

---

## 🎯 Finalized Pricing Tiers

### Tier Structure

| Feature | OBSERVER ($0/mo) | TRADER ($39/mo) | ARCHITECT ($99/mo) |
|---------|------------------|-----------------|-------------------|
| **Core Positioning** | Trial & Education | Daily Analysis | Professional Research |
| **Available Models** | Free models (Gemini 2.0 Flash, Llama 3.3 70B) unlimited + 3 premium trials/month | GPT-4o, Claude 3.5, DeepSeek, Gemini Pro unlimited | All top models (Claude Opus, GPT-5, o1) unlimited |
| **Analysis Quota** | 3 analyses/day (free models) + 3 premium/month | 500 credits/month | 1500 credits/month |
| **Council (Multi-AI)** | ❌ 1 model only (3 uses/day with free models) | ✅ 2-3 models concurrent | ✅ 3-5 models concurrent |
| **Fusion** | ❌ Disabled | ✅ Fuse only | ✅ All 4 fusion types |
| **Strategy Library** | ❌ None (generic prompts) | ✅ 8 presets (read-only) | ✅ 8 presets + Custom creator |
| **Vision (Chart Analysis)** | ✅ Basic (Gemini Vision free) | ✅ Advanced (GPT-4o + Claude Vision) | ✅ Multi-model validation (3-5 models) |
| **Export** | Text copy only | Markdown, JSON | Markdown, JSON, Share links |
| **History** | 7 days, max 10 chats | 90 days, unlimited | Permanent, unlimited |
| **Response Priority** | Standard queue | Standard | Priority queue |
| **Support** | Community (Discord) | Email (48h) | Priority email (12h) + 1:1 consultation/quarter |
| **Annual Discount** | - | $390/year (save $78) | $990/year (save $198) |

### Credit Consumption Model

```typescript
const MODEL_CREDIT_COST = {
  // Free models (OpenRouter free tier)
  'gemini-2.0-flash-free': 0,
  'llama-3.3-70b-free': 0,
  'qwen-2.5-72b-free': 0,

  // Mainstream models
  'gpt-4o': 1,
  'claude-3.5-sonnet': 1,
  'gemini-2.0-flash': 0.5,
  'deepseek-r1': 0.5,

  // Premium models
  'claude-4.5-opus': 3,
  'o1': 3,
  'gpt-5': 4,
};

// Example: TRADER with 500 credits
// - 500 GPT-4o analyses, OR
// - 1000 Gemini Flash analyses, OR
// - 166 Claude Opus analyses
```

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Chat App   │  │ Analysis App │  │ Strategy App │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         User State (Zustand + Session)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ tRPC
┌─────────────────────────────────────────────────────────────┐
│                    Backend (tRPC Routers)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Router │  │ User Router  │  │ Quota Router │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AIX (AI Communication)                  │   │
│  │         + Quota Check Middleware                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase (PostgreSQL)                      │
│  • users                                                     │
│  • subscriptions                                             │
│  • analysis_quota                                            │
│  • analysis_history                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema (Supabase)

### 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL,           -- 'google', 'github', etc.
  provider_id TEXT NOT NULL,        -- Provider's user ID
  tier TEXT NOT NULL DEFAULT 'OBSERVER',  -- 'OBSERVER', 'TRADER', 'ARCHITECT'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider_id ON users(provider, provider_id);
```

### 2. subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,                -- 'TRADER', 'ARCHITECT'
  status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'cancelled', 'past_due'
  interval TEXT NOT NULL,            -- 'month', 'year'
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Stripe fields (for Phase 2.1)
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 3. analysis_quota

```sql
CREATE TABLE analysis_quota (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Free model usage (daily reset)
  free_daily_count INTEGER NOT NULL DEFAULT 0,
  free_daily_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '1 day',

  -- Premium trial usage (monthly reset for OBSERVER)
  premium_trial_count INTEGER NOT NULL DEFAULT 0,
  premium_trial_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT DATE_TRUNC('month', NOW() + INTERVAL '1 month'),

  -- Paid tier credits (monthly reset)
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_allowance INTEGER NOT NULL DEFAULT 0,  -- Based on tier
  credits_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT DATE_TRUNC('month', NOW() + INTERVAL '1 month'),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_quota_user_id ON analysis_quota(user_id);
```

### 4. analysis_history

```sql
CREATE TABLE analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Analysis metadata
  analysis_type TEXT NOT NULL,       -- 'chat', 'council', 'fusion'
  models_used TEXT[] NOT NULL,       -- ['gpt-4o', 'claude-3.5']
  model_count INTEGER NOT NULL,      -- Number of models in council

  -- Input/output
  input_text TEXT,
  input_attachments JSONB,           -- {type: 'image', url: '...'}
  output_data JSONB,                 -- Full analysis result

  -- Cost tracking
  credits_cost DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',  -- 'completed', 'failed', 'aborted'

  -- Timing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_history_created_at ON analysis_history(created_at DESC);
```

### 5. payment_history (for Phase 2.1)

```sql
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,              -- 'success', 'failed', 'pending'

  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_user_id ON payment_history(user_id);
```

---

## 🔐 Authentication Flow

### NextAuth.js Configuration

**Location:** `/src/app/api/auth/[...nextauth]/route.ts` (new file)

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user.email) return false;

      // Upsert user in Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
        }, {
          onConflict: 'email',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create user:', error);
        return false;
      }

      // Initialize quota on first signup
      const { error: quotaError } = await supabase
        .from('analysis_quota')
        .upsert({
          user_id: data.id,
          credits_allowance: 0, // OBSERVER tier
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: true,
        });

      return true;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        // Fetch user data from Supabase
        const { data } = await supabase
          .from('users')
          .select('id, tier')
          .eq('email', user.email)
          .single();

        if (data) {
          token.userId = data.id;
          token.tier = data.tier;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.tier = token.tier as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### User State Integration

**Location:** `/src/common/stores/store-auth.ts` (new file)

```typescript
import { create } from 'zustand';
import { useSession } from 'next-auth/react';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string | null;
    tier: 'OBSERVER' | 'TRADER' | 'ARCHITECT';
    avatarUrl: string | null;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
}));

// Hook to sync NextAuth session with Zustand
export function useAuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((state) => state);

  React.useEffect(() => {
    if (status === 'loading') {
      useAuthStore.setState({ isLoading: true });
    } else if (status === 'authenticated' && session?.user) {
      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.name,
          tier: session.user.tier,
          avatarUrl: session.user.image,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      useAuthStore.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [session, status]);
}
```

---

## 🔢 Quota Management System

### Quota Check Middleware

**Location:** `/src/server/api/middleware/checkQuota.ts` (new file)

```typescript
import { TRPCError } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface QuotaCheckOptions {
  modelId: string;
  modelCount: number; // For council analyses
}

const MODEL_CREDIT_COST: Record<string, number> = {
  // Free models
  'openrouter/google/gemini-2.0-flash-exp:free': 0,
  'openrouter/meta-llama/llama-3.3-70b-instruct:free': 0,

  // Mainstream
  'openai/gpt-4o': 1,
  'anthropic/claude-3.5-sonnet': 1,
  'google/gemini-2.0-flash': 0.5,
  'deepseek/r1': 0.5,

  // Premium
  'anthropic/claude-4.5-opus': 3,
  'openai/o1': 3,
};

export async function checkQuota(
  userId: string,
  options: QuotaCheckOptions
): Promise<{ allowed: boolean; reason?: string }> {

  // Get user tier and quota
  const { data: user } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single();

  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

  const { data: quota } = await supabase
    .from('analysis_quota')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!quota) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

  const creditCost = MODEL_CREDIT_COST[options.modelId] || 1;
  const totalCost = creditCost * options.modelCount;

  // Check based on tier
  if (user.tier === 'OBSERVER') {
    // Check free model daily limit
    if (creditCost === 0) {
      if (quota.free_daily_count >= 3) {
        return {
          allowed: false,
          reason: 'Daily free analysis limit reached (3/day). Upgrade to TRADER for unlimited.'
        };
      }
    } else {
      // Check premium trial limit
      if (quota.premium_trial_count >= 3) {
        return {
          allowed: false,
          reason: 'Monthly premium trial exhausted (3/month). Upgrade to TRADER for unlimited access.'
        };
      }
    }
  } else {
    // Paid tier: check credits
    const remaining = quota.credits_allowance - quota.credits_used;
    if (remaining < totalCost) {
      return {
        allowed: false,
        reason: `Insufficient credits. Need ${totalCost}, have ${remaining}. Upgrade to ARCHITECT or wait for monthly reset.`
      };
    }
  }

  return { allowed: true };
}

export async function deductQuota(
  userId: string,
  options: QuotaCheckOptions
): Promise<void> {
  const creditCost = MODEL_CREDIT_COST[options.modelId] || 1;
  const totalCost = creditCost * options.modelCount;

  const { data: user } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single();

  if (user?.tier === 'OBSERVER') {
    if (creditCost === 0) {
      // Increment free daily count
      await supabase.rpc('increment_free_daily', { user_id: userId });
    } else {
      // Increment premium trial count
      await supabase.rpc('increment_premium_trial', { user_id: userId });
    }
  } else {
    // Deduct credits
    await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: totalCost
    });
  }
}

// Supabase RPC functions (to be created in Supabase dashboard)
/*
CREATE OR REPLACE FUNCTION increment_free_daily(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE analysis_quota
  SET free_daily_count = free_daily_count + 1,
      updated_at = NOW()
  WHERE analysis_quota.user_id = increment_free_daily.user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_premium_trial(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE analysis_quota
  SET premium_trial_count = premium_trial_count + 1,
      updated_at = NOW()
  WHERE analysis_quota.user_id = increment_premium_trial.user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deduct_credits(user_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE analysis_quota
  SET credits_used = credits_used + amount,
      updated_at = NOW()
  WHERE analysis_quota.user_id = deduct_credits.user_id;
END;
$$ LANGUAGE plpgsql;
*/
```

---

## 🎨 UI Components

### 1. Login Button

**Location:** `/src/components/auth/LoginButton.tsx` (new file)

```tsx
import { signIn } from 'next-auth/react';
import { Button } from '@mui/joy';

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn('google', { callbackUrl: '/chat' })}
      sx={{
        bgcolor: '#fff',
        color: '#000',
        borderRadius: '50px',
        fontWeight: 700,
        fontSize: '0.85rem',
        px: 2.5,
        py: 1,
        '&:hover': {
          bgcolor: '#00E676',
          boxShadow: '0 0 15px #00E676',
        },
      }}
    >
      LOGIN
    </Button>
  );
}
```

### 2. User Menu

**Location:** `/src/components/auth/UserMenu.tsx` (new file)

```tsx
import { signOut } from 'next-auth/react';
import { Avatar, Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import { useAuthStore } from '~/common/stores/store-auth';

export function UserMenu() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        sx={{ borderRadius: '50%', minWidth: 40, minHeight: 40 }}
      >
        <Avatar src={user.avatarUrl || undefined} alt={user.name || user.email}>
          {user.name?.[0] || user.email[0]}
        </Avatar>
      </MenuButton>
      <Menu>
        <MenuItem disabled>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              {user.tier} Tier
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
      </Menu>
    </Dropdown>
  );
}
```

---

## 🚀 Implementation Plan

### Phase 2.0: Foundation (Week 1-2)

**Branch:** `phase-2.0-auth-foundation`

#### Step 1: Environment Setup
- [ ] Create Supabase project
- [ ] Configure Google OAuth app
- [ ] Set up environment variables

#### Step 2: Database
- [ ] Create Supabase tables (users, subscriptions, analysis_quota, analysis_history)
- [ ] Create RPC functions for quota management
- [ ] Set up Row Level Security (RLS) policies

#### Step 3: NextAuth Integration
- [ ] Install dependencies (`next-auth`, `@supabase/supabase-js`)
- [ ] Create `/src/app/api/auth/[...nextauth]/route.ts`
- [ ] Create auth store (`/src/common/stores/store-auth.ts`)
- [ ] Add SessionProvider to root layout

#### Step 4: UI Components
- [ ] Create LoginButton component
- [ ] Create UserMenu component
- [ ] Update navbar to include auth UI
- [ ] Create simple sign-in page

#### Step 5: Integration Points
- [ ] Add `useAuthSync()` hook to root layout
- [ ] Verify user state flows to Zustand
- [ ] Test login/logout flow
- [ ] Verify user creation in Supabase

**Deliverable:** Working login/logout, user data in Supabase, all features still unlocked

---

### Phase 2.1: Paywall (Week 3-4) - DEFERRED

This will be implemented after Phase 2.0 is tested and verified.

- [ ] Add quota check middleware to AIX calls
- [ ] Implement tier-based feature gating
- [ ] Add usage dashboard
- [ ] Stripe integration
- [ ] Pricing page

---

## 📝 Environment Variables

Create `/Users/lr/Documents/tradecouncil/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"

# Google OAuth
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"

# Existing AI APIs (keep these)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."
```

---

## ✅ Testing Checklist (Phase 2.0)

### Authentication Flow
- [ ] Click "LOGIN" button
- [ ] Redirected to Google OAuth consent screen
- [ ] After consent, redirected back to `/chat`
- [ ] User avatar appears in navbar
- [ ] User data visible in Supabase `users` table
- [ ] Quota record created in `analysis_quota` table

### User State Management
- [ ] `useAuthStore` contains user data
- [ ] User ID accessible in components
- [ ] User tier visible in UI
- [ ] Session persists on page refresh

### Sign Out
- [ ] Click "Sign Out" in user menu
- [ ] User avatar disappears
- [ ] `useAuthStore` resets to null
- [ ] Redirected to landing page

### Edge Cases
- [ ] First-time user: Account created automatically
- [ ] Returning user: Existing account loaded
- [ ] Invalid OAuth: Error page displayed
- [ ] Session expiry: User prompted to re-login

---

## 📚 Reference Files to Copy

From `birthdaycardgenerator-1`:
- ✅ `/src/app/api/auth/[...nextauth]/route.ts` - Auth config
- ✅ `/src/backend/config/db.ts` - Supabase client setup
- ✅ `/src/providers/session.tsx` - SessionProvider wrapper
- ✅ `/src/components/button/login-button.tsx` - Login UI
- ✅ `/src/components/button/user-button.tsx` - User menu

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b phase-2.0-auth-foundation

# Incremental commits
git add .
git commit -m "feat: add Supabase database schema"
git push origin phase-2.0-auth-foundation

git commit -m "feat: integrate NextAuth.js with Google OAuth"
git push origin phase-2.0-auth-foundation

git commit -m "feat: add authentication UI components"
git push origin phase-2.0-auth-foundation

# User tests each commit
# After approval, merge to main
git checkout main
git merge phase-2.0-auth-foundation
git push origin main
```

---

## 📞 Next Steps

1. **Review this spec** - Confirm all decisions are correct
2. **Create Supabase project** - User provides credentials
3. **Create Google OAuth app** - User provides client ID/secret
4. **Start implementation** - Begin with Step 1 (Environment Setup)
5. **Incremental testing** - User tests each feature as it's built

---

**End of Specification Document**
