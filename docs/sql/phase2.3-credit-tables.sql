-- TradeCouncil Phase 2.3: Credit System Tables
-- Run this in Supabase SQL Editor
--
-- Tables:
--   1. user_credits - Track credit balances per user
--   2. analysis_history - Log all AI usage
--
-- Functions:
--   1. initialize_user_credits - Initialize credits for new users
--   2. check_and_deduct_credits - Atomic credit check + deduction
--   3. reset_daily_credits - Cron job for daily reset

-- ============================================================
-- 1. USER_CREDITS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Subscription credits (reset monthly)
  subscription_allowance INT NOT NULL DEFAULT 0,    -- Total allowed per month (500 TRADER, 1500 ARCHITECT)
  subscription_used INT NOT NULL DEFAULT 0,         -- Used this period
  subscription_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Add-on credits (never expire, consumed first)
  addon_balance INT NOT NULL DEFAULT 0,

  -- Free tier daily limits (OBSERVER)
  free_daily_count INT NOT NULL DEFAULT 0,          -- Used today (max 3)
  free_daily_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Premium trial (OBSERVER gets 3/month)
  premium_trial_count INT NOT NULL DEFAULT 0,       -- Used this month (max 3)
  premium_trial_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_credits UNIQUE (user_id),
  CONSTRAINT subscription_used_positive CHECK (subscription_used >= 0),
  CONSTRAINT addon_balance_positive CHECK (addon_balance >= 0),
  CONSTRAINT free_daily_count_positive CHECK (free_daily_count >= 0),
  CONSTRAINT premium_trial_count_positive CHECK (premium_trial_count >= 0)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- ============================================================
-- 2. ANALYSIS_HISTORY TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Analysis details
  analysis_type VARCHAR(20) NOT NULL CHECK (analysis_type IN ('chat', 'council', 'fusion')),
  models_used TEXT[] NOT NULL DEFAULT '{}',         -- Array of model IDs used
  model_count INT NOT NULL DEFAULT 1,
  strategy_id VARCHAR(100),                         -- Strategy preset ID if used

  -- Content preview (for user reference, truncated)
  input_preview VARCHAR(500),
  has_attachment BOOLEAN NOT NULL DEFAULT FALSE,

  -- Credit info
  credits_cost INT NOT NULL DEFAULT 0,
  credit_source VARCHAR(20) NOT NULL CHECK (credit_source IN ('subscription', 'addon', 'free')),

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'aborted')),
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_date ON analysis_history(user_id, created_at DESC);

-- ============================================================
-- 3. INITIALIZE_USER_CREDITS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION initialize_user_credits(
  p_user_id UUID,
  p_tier VARCHAR DEFAULT 'OBSERVER'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_allowance INT;
BEGIN
  -- Determine subscription allowance based on tier
  CASE p_tier
    WHEN 'TRADER' THEN v_allowance := 500;
    WHEN 'ARCHITECT' THEN v_allowance := 1500;
    WHEN 'ARCHITECT_PRO' THEN v_allowance := 3000;
    ELSE v_allowance := 0;  -- OBSERVER has no subscription credits
  END CASE;

  -- Insert or update user credits
  INSERT INTO user_credits (
    user_id,
    subscription_allowance,
    subscription_reset_at,
    free_daily_reset_at,
    premium_trial_reset_at
  )
  VALUES (
    p_user_id,
    v_allowance,
    NOW() + INTERVAL '1 month',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 month'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscription_allowance = v_allowance,
    updated_at = NOW();
END;
$$;

-- ============================================================
-- 4. CHECK_AND_DEDUCT_CREDITS FUNCTION
-- ============================================================
-- Atomic check + deduction to prevent race conditions
-- Returns: 'success', 'insufficient_credits', 'daily_limit_reached', 'trial_limit_reached'

CREATE OR REPLACE FUNCTION check_and_deduct_credits(
  p_user_id UUID,
  p_credits_needed INT,
  p_is_free_model BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  result VARCHAR,
  credit_source VARCHAR,
  credits_remaining INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits user_credits%ROWTYPE;
  v_user_tier VARCHAR;
  v_source VARCHAR;
  v_remaining INT;
BEGIN
  -- Get user tier
  SELECT tier INTO v_user_tier FROM users WHERE id = p_user_id;

  -- Get or create user credits
  SELECT * INTO v_credits FROM user_credits WHERE user_id = p_user_id FOR UPDATE;

  IF v_credits IS NULL THEN
    PERFORM initialize_user_credits(p_user_id, v_user_tier);
    SELECT * INTO v_credits FROM user_credits WHERE user_id = p_user_id FOR UPDATE;
  END IF;

  -- Reset daily count if needed
  IF v_credits.free_daily_reset_at < NOW() THEN
    UPDATE user_credits SET
      free_daily_count = 0,
      free_daily_reset_at = NOW() + INTERVAL '1 day'
    WHERE user_id = p_user_id;
    v_credits.free_daily_count := 0;
  END IF;

  -- Reset monthly trial if needed
  IF v_credits.premium_trial_reset_at < NOW() THEN
    UPDATE user_credits SET
      premium_trial_count = 0,
      premium_trial_reset_at = NOW() + INTERVAL '1 month'
    WHERE user_id = p_user_id;
    v_credits.premium_trial_count := 0;
  END IF;

  -- Reset subscription if needed
  IF v_credits.subscription_reset_at < NOW() THEN
    UPDATE user_credits SET
      subscription_used = 0,
      subscription_reset_at = NOW() + INTERVAL '1 month'
    WHERE user_id = p_user_id;
    v_credits.subscription_used := 0;
  END IF;

  -- OBSERVER using free model
  IF v_user_tier = 'OBSERVER' AND p_is_free_model THEN
    IF v_credits.free_daily_count >= 3 THEN
      RETURN QUERY SELECT 'daily_limit_reached'::VARCHAR, 'free'::VARCHAR, 0;
      RETURN;
    END IF;

    UPDATE user_credits SET
      free_daily_count = free_daily_count + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT 'success'::VARCHAR, 'free'::VARCHAR, (3 - v_credits.free_daily_count - 1);
    RETURN;
  END IF;

  -- OBSERVER using premium model (trial)
  IF v_user_tier = 'OBSERVER' AND NOT p_is_free_model THEN
    IF v_credits.premium_trial_count >= 3 THEN
      RETURN QUERY SELECT 'trial_limit_reached'::VARCHAR, 'free'::VARCHAR, 0;
      RETURN;
    END IF;

    UPDATE user_credits SET
      premium_trial_count = premium_trial_count + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT 'success'::VARCHAR, 'free'::VARCHAR, (3 - v_credits.premium_trial_count - 1);
    RETURN;
  END IF;

  -- TRADER/ARCHITECT: Try addon credits first (they never expire)
  IF v_credits.addon_balance >= p_credits_needed THEN
    UPDATE user_credits SET
      addon_balance = addon_balance - p_credits_needed,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT 'success'::VARCHAR, 'addon'::VARCHAR, (v_credits.addon_balance - p_credits_needed);
    RETURN;
  END IF;

  -- TRADER/ARCHITECT: Try subscription credits
  v_remaining := v_credits.subscription_allowance - v_credits.subscription_used;
  IF v_remaining >= p_credits_needed THEN
    UPDATE user_credits SET
      subscription_used = subscription_used + p_credits_needed,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT 'success'::VARCHAR, 'subscription'::VARCHAR, (v_remaining - p_credits_needed);
    RETURN;
  END IF;

  -- Insufficient credits
  RETURN QUERY SELECT 'insufficient_credits'::VARCHAR, ''::VARCHAR, v_remaining;
END;
$$;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access on user_credits"
  ON user_credits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on analysis_history"
  ON analysis_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only read their own data
CREATE POLICY "Users read own credits"
  ON user_credits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users read own history"
  ON analysis_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 6. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
