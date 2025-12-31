import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (with service role key)
// Use this in API routes and server components

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Client-side Supabase client (with anon key)
// Use this in client components for real-time subscriptions etc.

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string;
  provider_id: string;
  tier: 'OBSERVER' | 'TRADER' | 'ARCHITECT' | 'ARCHITECT_PRO';
  created_at: string;
  updated_at: string;
}

export interface DbSubscription {
  id: string;
  user_id: string;
  tier: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  interval: 'month' | 'year';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUserCredits {
  id: string;
  user_id: string;
  subscription_allowance: number;
  subscription_used: number;
  subscription_reset_at: string;
  addon_balance: number;
  free_daily_count: number;
  free_daily_reset_at: string;
  premium_trial_count: number;
  premium_trial_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbAnalysisHistory {
  id: string;
  user_id: string;
  analysis_type: 'chat' | 'council' | 'fusion';
  models_used: string[];
  model_count: number;
  strategy_id: string | null;
  input_preview: string | null;
  has_attachment: boolean;
  credits_cost: number;
  credit_source: 'subscription' | 'addon' | 'free';
  status: 'completed' | 'failed' | 'aborted';
  created_at: string;
  completed_at: string | null;
}

// Helper functions for database operations

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createOrUpdateUser(user: {
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  provider: string;
  provider_id: string;
}): Promise<DbUser | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert(
      {
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        provider: user.provider,
        provider_id: user.provider_id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }

  // Initialize credits for new user
  await initializeUserCredits(data.id, data.tier);

  return data;
}

export async function getUserCredits(userId: string): Promise<DbUserCredits | null> {
  const { data, error } = await supabaseAdmin
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function initializeUserCredits(userId: string, tier: string = 'OBSERVER'): Promise<void> {
  const { error } = await supabaseAdmin.rpc('initialize_user_credits', {
    p_user_id: userId,
    p_tier: tier,
  });

  if (error) {
    console.error('Error initializing user credits:', error);
  }
}

export async function getActiveSubscription(userId: string): Promise<DbSubscription | null> {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) return null;
  return data;
}
