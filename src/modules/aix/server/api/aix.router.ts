import * as z from 'zod/v4';

import { createTRPCRouter, edgeProcedure } from '~/server/trpc/trpc.server';

import { _createDebugConfig } from '../dispatch/chatGenerate/chatGenerate.debug';
import { createChatGenerateDispatch, createChatGenerateResumeDispatch } from '../dispatch/chatGenerate/chatGenerate.dispatch';
import { executeChatGenerateWithRetry } from '../dispatch/chatGenerate/chatGenerate.retrier';

import { AixWire_API, AixWire_API_ChatContentGenerate, AixWire_Particles } from './aix.wiretypes';

// [TradeCouncil] Credit system integration
import { checkAndDeductCredits, logAnalysis, getModelCreditCost } from '~/server/credits';


// --- AIX tRPC Router ---

export const aixRouter = createTRPCRouter({

  /**
   * Chat content generation, streaming, multipart.
   * Architecture: Client <-- (intake) --> Server <-- (dispatch) --> AI Service
   */
  chatGenerateContent: edgeProcedure
    .input(z.object({
      access: AixWire_API.Access_schema,
      model: AixWire_API.Model_schema,
      chatGenerate: AixWire_API_ChatContentGenerate.Request_schema,
      context: AixWire_API.ContextChatGenerate_schema,
      streaming: z.boolean(),
      connectionOptions: AixWire_API.ConnectionOptionsChatGenerate_schema.optional(), // debugDispatchRequest, debugProfilePerformance, enableResumability
    }))
    .mutation(async function* ({ input, ctx }) {
      const modelId = input.model.id;

      // [TradeCouncil] Credit check - skip if no userId (anonymous/dev mode)
      let creditResult: Awaited<ReturnType<typeof checkAndDeductCredits>> | null = null;
      if (ctx.userId) {
        creditResult = await checkAndDeductCredits(ctx.userId, modelId);

        if (!creditResult.success) {
          // Yield error particles and abort
          const errorMessage = creditResult.error?.message || 'Insufficient credits';
          yield { cg: 'issue', issueId: 'client-read', issueText: errorMessage } as AixWire_Particles.ChatControlOp;
          yield { cg: 'end', reason: 'issue-rpc', tokenStopReason: 'cg-issue' } as AixWire_Particles.ChatControlOp;

          // Log failed analysis attempt
          await logAnalysis({
            userId: ctx.userId,
            analysisType: 'chat',
            modelsUsed: [modelId],
            inputPreview: undefined,
            creditsCost: getModelCreditCost(modelId),
            creditSource: 'subscription', // default
            status: 'failed',
            errorMessage: creditResult.error?.type,
          });

          return;
        }
      }

      const _d = _createDebugConfig(input.access, input.connectionOptions, input.context.name);
      const chatGenerateDispatchCreator = () => createChatGenerateDispatch(input.access, input.model, input.chatGenerate, input.streaming, !!input.connectionOptions?.enableResumability);

      // Execute AI generation
      let success = false;
      try {
        yield* executeChatGenerateWithRetry(chatGenerateDispatchCreator, input.streaming, ctx.reqSignal, _d);
        success = true;
      } finally {
        // [TradeCouncil] Log completed analysis
        if (ctx.userId && creditResult?.success) {
          await logAnalysis({
            userId: ctx.userId,
            analysisType: 'chat',
            modelsUsed: [modelId],
            creditsCost: getModelCreditCost(modelId),
            creditSource: (creditResult.creditSource as 'subscription' | 'addon' | 'free') || 'subscription',
            status: success ? 'completed' : 'failed',
          });
        }
      }
    }),

  /**
   * Chat content generation RESUME, streaming only.
   * Reconnects to an in-progress response by its ID - OpenAI Responses API only.
   */
  reattachContent: edgeProcedure
    .input(z.object({
      access: AixWire_API.Access_schema,
      resumeHandle: AixWire_API.ResumeHandle_schema, // resume has a handle instead of 'model + chatGenerate'
      context: AixWire_API.ContextChatGenerate_schema,
      streaming: z.literal(true), // resume is always streaming
      connectionOptions: AixWire_API.ConnectionOptionsChatGenerate_schema.pick({ debugDispatchRequest: true }).optional(), // debugDispatchRequest
    }))
    .mutation(async function* ({ input, ctx }) {
      const _d = _createDebugConfig(input.access, input.connectionOptions, input.context.name);
      const resumeDispatchCreator = () => createChatGenerateResumeDispatch(input.access, input.resumeHandle, input.streaming);

      yield* executeChatGenerateWithRetry(resumeDispatchCreator, input.streaming, ctx.reqSignal, _d);
    }),

});
