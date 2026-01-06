/**
 * Credits Router
 * SRP: tRPC endpoints for credit-related operations
 */

import * as z from 'zod/v4';

import { createTRPCRouter, publicProcedure } from '~/server/trpc/trpc.server';
import { getUserCreditBalance } from './credits.service';
import { supabaseAdmin } from '~/server/supabase/client';

export const creditsRouter = createTRPCRouter({
  /**
   * Get user's current credit balance
   * Requires userId in context (from headers)
   */
  getBalance: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return null;
    }

    const balance = await getUserCreditBalance(ctx.userId);
    return balance;
  }),

  /**
   * Get user's recent usage history
   */
  getUsageHistory: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        return { items: [], total: 0 };
      }

      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      try {
        // Get total count
        const { count } = await supabaseAdmin
          .from('analysis_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', ctx.userId);

        // Get paginated history
        const { data, error } = await supabaseAdmin
          .from('analysis_history')
          .select('*')
          .eq('user_id', ctx.userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error('[Credits] Failed to get usage history:', error);
          return { items: [], total: 0 };
        }

        return {
          items: data?.map((row) => ({
            id: row.id,
            analysisType: row.analysis_type,
            modelsUsed: row.models_used,
            modelCount: row.model_count,
            strategyId: row.strategy_id,
            creditsCost: row.credits_cost,
            creditSource: row.credit_source,
            status: row.status,
            createdAt: row.created_at,
            completedAt: row.completed_at,
          })) ?? [],
          total: count ?? 0,
        };
      } catch (err) {
        console.error('[Credits] Unexpected error getting history:', err);
        return { items: [], total: 0 };
      }
    }),
});
