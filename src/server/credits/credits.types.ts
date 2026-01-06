/**
 * Credit System Types
 * SRP: Only type definitions, no logic
 */

// Credit check result from Supabase RPC
export interface CreditCheckResult {
  result: 'success' | 'insufficient_credits' | 'daily_limit_reached' | 'trial_limit_reached';
  credit_source: 'subscription' | 'addon' | 'free' | '';
  credits_remaining: number;
}

// User credit balance
export interface UserCreditBalance {
  subscriptionAllowance: number;
  subscriptionUsed: number;
  subscriptionRemaining: number;
  subscriptionResetAt: Date;
  addonBalance: number;
  freeDailyCount: number;
  freeDailyLimit: number;
  premiumTrialCount: number;
  premiumTrialLimit: number;
}

// Analysis types for logging
export type AnalysisType = 'chat' | 'council' | 'fusion';

// Analysis log entry
export interface AnalysisLogEntry {
  userId: string;
  analysisType: AnalysisType;
  modelsUsed: string[];
  strategyId?: string;
  inputPreview?: string;
  hasAttachment?: boolean;
  creditsCost: number;
  creditSource: 'subscription' | 'addon' | 'free';
  status: 'completed' | 'failed' | 'aborted';
  errorMessage?: string;
}

// Credit error types for UI
export type CreditErrorType =
  | 'insufficient_credits'
  | 'daily_limit_reached'
  | 'trial_limit_reached'
  | 'unknown_error';

export interface CreditError {
  type: CreditErrorType;
  message: string;
  upgradeRequired: boolean;
}
