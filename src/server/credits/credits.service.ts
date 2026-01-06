/**
 * Credit Service
 * SRP: Credit operations only (check, deduct, log)
 * DIP: Depends on Supabase abstraction via client
 *
 * Key features:
 * - Idempotent: Uses transaction-safe RPC
 * - Rate limit aware: Respects daily/monthly limits
 */

import { supabaseAdmin } from '~/server/supabase/client';
import type {
  AnalysisLogEntry,
  CreditCheckResult,
  CreditError,
  UserCreditBalance,
} from './credits.types';
import { getModelCreditCost, isModelFree, calculateTotalCredits } from './credits.cost';

// Re-export cost functions for convenience
export { getModelCreditCost, isModelFree, calculateTotalCredits };

/**
 * Check if user has sufficient credits and deduct if available
 * Uses Supabase RPC for atomic operation (prevents race conditions)
 *
 * @param userId - User ID
 * @param modelId - Model being used
 * @returns Result with success/error and remaining credits
 */
export async function checkAndDeductCredits(
  userId: string,
  modelId: string,
): Promise<{ success: boolean; creditSource?: string; remaining?: number; error?: CreditError }> {
  const creditsNeeded = getModelCreditCost(modelId);
  const isFreeModel = isModelFree(modelId);

  try {
    const { data, error } = await supabaseAdmin.rpc('check_and_deduct_credits', {
      p_user_id: userId,
      p_credits_needed: creditsNeeded,
      p_is_free_model: isFreeModel,
    });

    if (error) {
      console.error('[Credits] RPC error:', error);
      return {
        success: false,
        error: {
          type: 'unknown_error',
          message: 'Failed to check credits. Please try again.',
          upgradeRequired: false,
        },
      };
    }

    const result = data[0] as CreditCheckResult;

    if (result.result === 'success') {
      return {
        success: true,
        creditSource: result.credit_source,
        remaining: result.credits_remaining,
      };
    }

    // Handle different error types
    const errorMap: Record<string, CreditError> = {
      insufficient_credits: {
        type: 'insufficient_credits',
        message: 'You have run out of credits. Purchase more or upgrade your plan.',
        upgradeRequired: true,
      },
      daily_limit_reached: {
        type: 'daily_limit_reached',
        message: 'You have reached your daily limit (3 free analyses). Upgrade for unlimited access.',
        upgradeRequired: true,
      },
      trial_limit_reached: {
        type: 'trial_limit_reached',
        message: 'You have used all 3 premium model trials this month. Upgrade to continue.',
        upgradeRequired: true,
      },
    };

    return {
      success: false,
      error: errorMap[result.result] || {
        type: 'unknown_error',
        message: 'An unexpected error occurred.',
        upgradeRequired: false,
      },
    };
  } catch (err) {
    console.error('[Credits] Unexpected error:', err);
    return {
      success: false,
      error: {
        type: 'unknown_error',
        message: 'An unexpected error occurred.',
        upgradeRequired: false,
      },
    };
  }
}

/**
 * Check credits for multiple models (Council/Fusion)
 * Does NOT deduct - use for pre-check before analysis
 */
export async function checkCreditsForModels(
  userId: string,
  modelIds: string[],
): Promise<{ canProceed: boolean; totalCredits: number; error?: CreditError }> {
  const totalCredits = calculateTotalCredits(modelIds);
  const balance = await getUserCreditBalance(userId);

  if (!balance) {
    return {
      canProceed: false,
      totalCredits,
      error: {
        type: 'unknown_error',
        message: 'Failed to check credit balance.',
        upgradeRequired: false,
      },
    };
  }

  // Check if user has enough credits
  const totalAvailable = balance.subscriptionRemaining + balance.addonBalance;

  if (totalCredits > totalAvailable) {
    return {
      canProceed: false,
      totalCredits,
      error: {
        type: 'insufficient_credits',
        message: `This analysis requires ${totalCredits} credits, but you only have ${totalAvailable}.`,
        upgradeRequired: true,
      },
    };
  }

  return { canProceed: true, totalCredits };
}

/**
 * Get user's credit balance
 */
export async function getUserCreditBalance(userId: string): Promise<UserCreditBalance | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      subscriptionAllowance: data.subscription_allowance,
      subscriptionUsed: data.subscription_used,
      subscriptionRemaining: data.subscription_allowance - data.subscription_used,
      subscriptionResetAt: new Date(data.subscription_reset_at),
      addonBalance: data.addon_balance,
      freeDailyCount: data.free_daily_count,
      freeDailyLimit: 3,
      premiumTrialCount: data.premium_trial_count,
      premiumTrialLimit: 3,
    };
  } catch (err) {
    console.error('[Credits] Failed to get balance:', err);
    return null;
  }
}

/**
 * Log analysis to history
 * Idempotent: Uses unique constraint to prevent duplicate entries
 */
export async function logAnalysis(entry: AnalysisLogEntry): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('analysis_history').insert({
      user_id: entry.userId,
      analysis_type: entry.analysisType,
      models_used: entry.modelsUsed,
      model_count: entry.modelsUsed.length,
      strategy_id: entry.strategyId,
      input_preview: entry.inputPreview?.slice(0, 500), // Truncate to 500 chars
      has_attachment: entry.hasAttachment ?? false,
      credits_cost: entry.creditsCost,
      credit_source: entry.creditSource,
      status: entry.status,
      error_message: entry.errorMessage,
      completed_at: entry.status === 'completed' ? new Date().toISOString() : null,
    });

    if (error) {
      console.error('[Credits] Failed to log analysis:', error);
    }
  } catch (err) {
    console.error('[Credits] Unexpected error logging analysis:', err);
  }
}

/**
 * Add addon credits to user balance (after purchase)
 */
export async function addAddonCredits(userId: string, credits: number): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('user_credits')
      .update({
        addon_balance: supabaseAdmin.rpc('increment_addon_balance', {
          p_user_id: userId,
          p_amount: credits,
        }),
      })
      .eq('user_id', userId);

    if (error) {
      // Fallback to direct update
      const { error: fallbackError } = await supabaseAdmin.rpc('add_addon_credits', {
        p_user_id: userId,
        p_credits: credits,
      });

      if (fallbackError) {
        console.error('[Credits] Failed to add addon credits:', fallbackError);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('[Credits] Unexpected error adding credits:', err);
    return false;
  }
}
