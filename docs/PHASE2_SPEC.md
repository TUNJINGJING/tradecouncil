# TradeCouncil Phase 2 Technical Specification

**Version:** 1.4
**Date:** 2026-01-06
**Status:** Completed (Phase 2.4)

---

## 📋 Executive Summary

**Objective:** Implement user authentication, subscription system, and usage quota management for TradeCouncil.

**Core Product Positioning:**
- TradeCouncil is a **platform-provided API aggregator** (套壳工具)
- Users **DO NOT** need to provide their own API keys
- Platform provides all API keys, users only select models and pay subscription
- Value proposition: One subscription → Access to all major AI models

**Approach:** Incremental rollout
- **Phase 2.0:** Auth + Supabase ✅ COMPLETED
- **Phase 2.1:** Pricing page + Stripe (placeholder) + Disable API setup UI ✅ COMPLETED
- **Phase 2.2:** Feature restrictions by tier ✅ COMPLETED
- **Phase 2.3:** Credit system + Usage tracking ✅ COMPLETED
- **Phase 2.4:** User dashboard + Add-on credits ✅ COMPLETED

**Tech Stack:**
- **Database:** Supabase (PostgreSQL)
- **Auth:** NextAuth.js v4 + Google OAuth ✅ COMPLETED
- **Payment:** Stripe (placeholder, waiting for account)
- **Storage:** Local (IndexedDB/localStorage) - No cloud sync

---

## ⚙️ Development Principles (Mandatory)

### SOLID 原则

| 原则 | 要求 |
|------|------|
| SRP | 一个类/模块只负责一个功能领域 |
| OCP | 对扩展开放，对修改封闭 |
| LSP | 子类必须能替换父类 |
| ISP | 接口小而专注 |
| DIP | 依赖抽象而非具体实现 |

### 其他原则

| 原则 | 要求 |
|------|------|
| DRY | 不重复实现，先 Grep 检查 |
| SoC | 关注点分离，各层各司其职 |
| LoD | 最少知道，只与直接朋友通信 |
| 组合优于继承 | 优先组合，避免继承层次过深 |
| YAGNI | 只实现当前需要的功能 |

### KISS 四问

编码前必须回答：
1. 这是真问题还是臆想的？
2. 有更简单的方法吗？
3. 会破坏什么吗？
4. 真的需要这个功能吗？

### 健壮性（关键路径适用）

- **幂等性**: 写操作必须幂等
- **限流**: 保护系统不被压垮
- **熔断**: 快速失败，防止级联故障
- **重试**: 指数退避，配合幂等

---

## ✅ Phase 2.0 Completed (2025-12-31)

- [x] Supabase project setup
- [x] NextAuth.js with Google OAuth
- [x] User data persistence in Supabase
- [x] Auth UI components (LoginButton, UserMenu, AuthStatus)
- [x] Integration into OptimaBar

---

## 🎯 Finalized Pricing Tiers

### Tier Structure

| Feature | OBSERVER ($0/mo) | TRADER ($39/mo) | ARCHITECT ($99/mo) |
|---------|------------------|-----------------|-------------------|
| **Core Positioning** | Trial & Taste | Daily Analysis | Expert Consensus & Deep Strategy |
| **Available Models** | Free models only (Gemini 2.0 Flash, Llama 3.3 70B via OpenRouter) + 3 premium trials/month | Mainstream models (GPT-4o, Claude 3.5, DeepSeek, Gemini Pro) unlimited | All top models (Claude Opus, o1, GPT-5) unlimited + priority access to new models |
| **Analysis Quota** | 3/day (free models) + 3/month (premium trial) | 500 credits/month | 1500 credits/month (rollover 1 month, max 3000) |
| **Council (Multi-AI)** | ✅ 3 uses/day, 2 free models only | ✅ 2-3 models concurrent | ✅ 3-5 models concurrent |
| **Fusion** | ✅ Enabled (free models only) | ✅ All 4 fusion types | ✅ All 4 fusion types |
| **Strategy Library** | ❌ Disabled | ✅ 8 presets (read-only) | ✅ 8 presets + Custom creator (max 50) |
| **Vision (Chart)** | ✅ Basic (Gemini Vision free) | ✅ Advanced (GPT-4o + Claude Vision) | ✅ Multi-model validation |
| **Export** | Text copy only | Markdown, JSON | Markdown, JSON, Share links |
| **History** | 7 days, max 10 chats | 90 days, unlimited | Permanent, unlimited |
| **API Key Setup** | ❌ Hidden | ❌ Hidden (use platform keys) | ⚠️ Optional (can add own keys for unlimited use without credits) |
| **Annual Price** | - | $390/year (10 months) | $990/year (10 months) |

### Add-on Credits (Phase 2.4)

For TRADER and ARCHITECT users who exhaust monthly credits:

| Package | Price | Credits | Per Credit |
|---------|-------|---------|-----------|
| Small | $19 | 200 | $0.095 |
| Medium | $49 | 600 | $0.082 (14% off) |
| Large | $89 | 1200 | $0.074 (22% off) |

**Add-on credits never expire** and are consumed before subscription credits.

---

## 🔧 API Strategy (Key Decision)

### Platform-Provided API Keys

**Decision:** Platform provides ALL API keys. Users do NOT configure any API keys.

```
┌─────────────────────────────────────────────────────────────┐
│  User Request Flow                                           │
│                                                              │
│  User selects model → Request to Server → Server uses       │
│  platform API key → Response to User → Deduct credits       │
└─────────────────────────────────────────────────────────────┘
```

### Platform API Keys Required (Vercel Environment Variables)

```bash
# OpenRouter (for free models - Gemini Flash, Llama, Qwen)
OPENROUTER_API_KEY=sk-or-xxx

# OpenAI (GPT-4o, o1)
OPENAI_API_KEY=sk-xxx

# Anthropic (Claude 3.5, Claude Opus)
ANTHROPIC_API_KEY=sk-ant-xxx

# Google AI (Gemini Pro - direct API, not via OpenRouter)
GOOGLE_AI_API_KEY=xxx

# DeepSeek
DEEPSEEK_API_KEY=xxx

# Optional: Other providers as needed
```

### Model Availability by Tier

| Tier | Available Models |
|------|-----------------|
| **OBSERVER** | Gemini 2.0 Flash (free), Llama 3.3 70B (free), Qwen 2.5 72B (free) |
| **TRADER** | All OBSERVER + GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Pro, DeepSeek R1 |
| **ARCHITECT** | All TRADER + Claude 4.5 Opus, o1, o3, GPT-5 (when available), all new models |

### UI Changes Required

1. **Disable Welcome Modal** - No more "Setup AI Models" prompt
2. **Hide API Settings** - Remove from Settings/Preferences for all users
3. **Model Selector** - Show only tier-appropriate models (no API key input)
4. **Admin Panel (Phase 3)** - For platform operator to manage models

---

## 📊 Credit Consumption Model

```typescript
const MODEL_CREDIT_COST: Record<string, number> = {
  // Free models (via OpenRouter free tier) - 0 credits
  'openrouter/google/gemini-2.0-flash-exp:free': 0,
  'openrouter/meta-llama/llama-3.3-70b-instruct:free': 0,
  'openrouter/qwen/qwen-2.5-72b-instruct:free': 0,

  // Mainstream models - 1 credit
  'openai/gpt-4o': 1,
  'anthropic/claude-3.5-sonnet': 1,
  'google/gemini-2.0-pro': 1,
  'deepseek/deepseek-r1': 0.5,

  // Premium models - 2-3 credits
  'anthropic/claude-4.5-opus': 3,
  'openai/o1': 3,
  'openai/o3': 3,
};

// Credit consumption priority:
// 1. Add-on credits (never expire)
// 2. Subscription credits (monthly reset)
```

---

## 🚀 Implementation Phases

### Phase 2.1: Pricing + Stripe + UI Cleanup (Current)

**Tasks:**
- [x] Disable Welcome Modal auto-popup
- [x] Hide "AI Models" from Settings (Desktop Nav, Mobile Nav, LLM Dropdown, Settings UI, Keyboard shortcuts)
- [x] Create `/pricing` page with 3 tier cards
- [x] Stripe integration (placeholder)
  - [x] `/api/checkout` - Create Checkout Session (placeholder)
  - [x] `/api/webhook/stripe` - Handle payment events (placeholder)
  - [ ] Environment variables placeholder
- [ ] Update user tier after payment (placeholder logic)

**Files to modify:**
- `src/common/layout/optima/Modals.tsx` - Disable auto-open
- `src/apps/settings-modal/SettingsModal.tsx` - Hide AI Models tab
- `pages/pricing.tsx` - New pricing page
- `app/api/checkout/route.ts` - Stripe checkout
- `app/api/webhook/stripe/route.ts` - Stripe webhook

### Phase 2.2: Feature Restrictions ✅ COMPLETED (2026-01-06)

**Tasks:**
- [x] Council concurrent model limit by tier
- [x] Fusion method availability by tier
- [x] Strategy library access by tier
- [x] Model selector filtering by tier
- [x] Upgrade prompt UI ("Upgrade to unlock...")
- [x] Model list cleanup (free/paid separation, no duplicates)

**Files modified:**
- `src/common/hooks/useTierPermissions.ts` - Tier permission system (NEW)
- `src/common/stores/llms/llms.tradecouncil.ts` - Model whitelist/blacklist (NEW)
- `src/common/stores/llms/llms.types.ts` - isLLMVisible() for TradeCouncil
- `src/modules/analysis/scatter/ExpertGrid.tsx` - Council limits
- `src/modules/analysis/scatter/AnalysisScatterPane.tsx` - Expert count display
- `src/modules/analysis/gather/AnalysisGatherPane.tsx` - Fusion restrictions
- `src/apps/strategies/AppStrategies.tsx` - Strategy access control
- `src/common/components/forms/useLLMSelect.tsx` - Model tier filtering

**Model List Logic:**
- FREE models: Only show `:free` suffix versions (DeepSeek R1, Gemma 3, Llama, Qwen, Mistral)
- PAID models: Show versions without `:free` suffix (GPT-4o, Claude, Gemini Pro)
- Avoid duplicates: If free version exists, hide paid version of same model

### Phase 2.3: Credit System + Usage Tracking ✅ COMPLETED (2026-01-06)

**Tasks:**
- [x] Create Supabase tables (user_credits, analysis_history)
- [x] Create `check_and_deduct_credits` RPC function (atomic operation)
- [x] Create credit service (`src/server/credits/`)
  - [x] `credits.types.ts` - Type definitions (CreditCheckResult, UserCreditBalance, etc.)
  - [x] `credits.cost.ts` - Model credit cost mapping
  - [x] `credits.service.ts` - Core service (checkAndDeductCredits, logAnalysis)
  - [x] `index.ts` - Public API exports
- [x] Integrate credit check into AI calls
  - [x] Modified `trpc.server.ts` to extract userId/userTier from headers
  - [x] Modified `aix.router.ts` to check/deduct credits before AI dispatch
  - [x] Modified `trpc.client.ts` to send user headers with requests
- [x] Credit deduction on API calls (atomic via Supabase RPC)
- [x] Usage tracking and logging to analysis_history

**Files Created:**
- `docs/sql/phase2.3-credit-tables.sql` - SQL schema for Supabase
- `src/server/credits/credits.types.ts` - Type definitions
- `src/server/credits/credits.cost.ts` - Model credit costs
- `src/server/credits/credits.service.ts` - Credit service
- `src/server/credits/index.ts` - Public exports

**Files Modified:**
- `src/server/trpc/trpc.server.ts` - Added userId/userTier context
- `src/modules/aix/server/api/aix.router.ts` - Credit check integration
- `src/common/util/trpc.client.ts` - User headers for credit system

**Database Schema:**
```sql
-- user_credits: Track user credit balances
-- analysis_history: Log all AI usage for billing/analytics
-- See /docs/sql/phase2.3-credit-tables.sql
```

**Credit Flow:**
```
User sends request
    ↓
Client adds userId/userTier headers (from next-auth session)
    ↓
Server extracts context in tRPC
    ↓
aix.router checks credits via Supabase RPC
    ↓
FREE model? → Allow (no deduction)
PAID model? → Check credits → Deduct atomically → Call AI
    ↓
Log to analysis_history (success or failure)
```

**Architecture:**
```
User → tRPC (headers) → aix.router → checkAndDeductCredits (RPC) → AI Provider
                                         ↓
                              Credits deducted atomically via Supabase RPC
                              Usage logged to analysis_history
```

### Phase 2.4: Add-on Credits + Dashboard ✅ COMPLETED (2026-01-06)

**Tasks:**
- [x] Create credits tRPC router (`credits.router.ts`)
  - [x] `getBalance` query - Fetch user credit balance
  - [x] `getUsageHistory` query - Fetch paginated usage history
- [x] User dashboard (`/dashboard`)
  - [x] Credit balance display (subscription + addon)
  - [x] Usage progress bar
  - [x] Recent usage history table
  - [x] Quick action buttons
- [x] Credit display in user menu (AuthUserMenu)
  - [x] Credit balance with progress bar
  - [x] Dashboard link

**Files Created:**
- `src/server/credits/credits.router.ts` - tRPC router for credits
- `src/apps/dashboard/DashboardPage.tsx` - Dashboard page component
- `pages/dashboard.tsx` - Dashboard page route

**Files Modified:**
- `src/server/trpc/trpc.router-cloud.ts` - Added credits router
- `src/common/components/auth/AuthUserMenu.tsx` - Added credit display and dashboard link

**Note:** Add-on credit purchase flow requires Stripe integration (Phase 2.1 placeholder).
When Stripe is configured, update:
1. `/pricing` page add-on section with purchase buttons
2. Create Stripe checkout flow for credit packages
3. Webhook handler to add credits after purchase

### Phase 3: Admin Panel (Future)

**Tasks:**
- [ ] `/admin` route (protected)
- [ ] Model configuration UI
- [ ] User management
- [ ] Usage analytics
- [ ] Revenue dashboard

---

## 📁 New Files Structure

```
/app/api/
├── auth/[...nextauth]/route.ts  ✅ Created
├── checkout/route.ts            ✅ Created (placeholder)
└── webhook/stripe/route.ts      ✅ Created (placeholder)

/docs/sql/
└── phase2.3-credit-tables.sql   ✅ Created (Phase 2.3)

/pages/
├── pricing.tsx                  ✅ Created
└── dashboard.tsx                ✅ Created (Phase 2.4)

/src/apps/
├── pricing/
│   └── PricingPage.tsx          ✅ Created
└── dashboard/
    └── DashboardPage.tsx        ✅ Created (Phase 2.4)

/src/server/
├── auth/auth.config.ts          ✅ Created
├── supabase/client.ts           ✅ Created
├── credits/                     ✅ Created (Phase 2.3-2.4)
│   ├── index.ts                 - Public API
│   ├── credits.types.ts         - Type definitions
│   ├── credits.cost.ts          - Model cost mapping
│   ├── credits.service.ts       - Core service
│   └── credits.router.ts        - tRPC router (Phase 2.4)
├── stripe/                      ← Future (when Stripe configured)
│   ├── stripe.config.ts
│   └── stripe.service.ts
└── quota/                       (deprecated, replaced by credits/)
    └── quota.service.ts

/src/common/components/
├── auth/                        ✅ Created
│   ├── AuthLoginButton.tsx
│   ├── AuthUserMenu.tsx         ✅ Modified (Phase 2.4 - credits)
│   └── AuthStatus.tsx
└── pricing/                     (merged into /src/apps/pricing/)
```

---

## 🔑 Environment Variables

### Current (Phase 2.0)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qwtcispyxfnncxemmvig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# NextAuth
NEXTAUTH_URL=https://tradecouncil.vercel.app
NEXTAUTH_SECRET=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Phase 2.1 (Add these)

```bash
# Stripe (placeholder until account ready)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_TRADER_MONTHLY=price_xxx
STRIPE_PRICE_TRADER_YEARLY=price_xxx
STRIPE_PRICE_ARCHITECT_MONTHLY=price_xxx
STRIPE_PRICE_ARCHITECT_YEARLY=price_xxx
```

### Phase 2.3 (Platform API Keys)

```bash
# Platform API Keys (for server-side use only)
OPENROUTER_API_KEY=sk-or-xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_AI_API_KEY=xxx
DEEPSEEK_API_KEY=xxx
```

---

## 📝 Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-31 | Platform provides all API keys | Core product value - users don't need to manage APIs |
| 2025-12-31 | OBSERVER gets Council (3/day, free models) | Lower barrier, let users experience core feature |
| 2025-12-31 | OBSERVER gets Fusion (free models) | Same as above |
| 2025-12-31 | OBSERVER: Strategy library disabled | Premium feature to drive upgrades |
| 2025-12-31 | No one-time purchase option | Subscription-only model |
| 2025-12-31 | Annual = 10 months price | Standard 2-month discount |
| 2025-12-31 | Add-on credits never expire | User-friendly, encourages purchases |
| 2025-12-31 | ARCHITECT can optionally add own keys | Power user feature, unlimited without credits |

---

## ✅ Testing Checklist

### Phase 2.0 ✅
- [x] Google OAuth login
- [x] User created in Supabase
- [x] Logout works
- [x] Session persists

### Phase 2.1
- [ ] Welcome Modal does NOT auto-popup
- [ ] AI Models hidden from Settings
- [ ] Pricing page renders correctly
- [ ] Stripe checkout redirects (with test keys)
- [ ] Webhook receives events (test mode)

### Phase 2.2 ✅
- [x] OBSERVER: Council limited to 2 models
- [x] OBSERVER: Only free models visible (others locked with upgrade prompt)
- [x] OBSERVER: Strategy library shows upgrade prompt
- [x] OBSERVER: Only basic Fusion type available
- [x] TRADER: 3 model Council works
- [x] TRADER: Mainstream models accessible
- [x] TRADER: All fusion types except Custom
- [x] ARCHITECT: 5 model Council works
- [x] ARCHITECT: All models accessible
- [x] ARCHITECT: Custom strategies available

### Phase 2.3 ✅
- [x] Credit check prevents AI calls when insufficient credits
- [x] Free models (`:free` suffix) bypass credit check
- [x] Credits deducted atomically via Supabase RPC
- [x] Usage logged to analysis_history table
- [x] User headers sent with tRPC requests
- [x] Error message shown when credits exhausted

### Phase 2.4 ✅
- [x] Dashboard page renders at `/dashboard`
- [x] Credit balance displayed correctly
- [x] Usage history shows recent analyses
- [x] Credit display in user menu
- [x] Dashboard link in user menu
- [ ] Add-on credit purchase works (requires Stripe)
- [ ] Credits persist after purchase (requires Stripe)

---

**End of Specification Document**
