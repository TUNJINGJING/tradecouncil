/**
 * TradeCouncil Curated Model List
 * Only these models are shown to users for a cleaner, more reliable experience.
 * All models via OpenRouter for unified billing.
 *
 * IMPORTANT: OpenRouter has both FREE and PAID versions of some models:
 * - FREE: 'deepseek/deepseek-r1-0528:free' (has :free suffix)
 * - PAID: 'deepseek/deepseek-r1-0528' (no suffix)
 *
 * To avoid duplicates, we use specific patterns.
 */

// FREE models - these have ':free' suffix in OpenRouter
// We'll check for ':free' suffix to identify them
export const TRADECOUNCIL_FREE_MODEL_PATTERNS = [
  'deepseek/deepseek-r1',              // DeepSeek R1 (free via :free suffix)
  'deepseek/deepseek-chat',            // DeepSeek Chat (free via :free suffix)
  'google/gemini-2.0-flash',           // Gemini 2.0 Flash (free)
  'google/gemma-3',                    // Gemma 3 (free)
  'meta-llama/llama-3.3-70b',          // Llama 3.3 70B (free)
  'meta-llama/llama-3.1-405b',         // Llama 3.1 405B (free)
  'qwen/qwen-2.5-72b',                 // Qwen 2.5 72B (free)
  'qwen/qwen3',                        // Qwen 3 (free)
  'mistralai/mistral-small',           // Mistral Small (free)
] as const;

// PAID models - these do NOT have ':free' suffix
export const TRADECOUNCIL_PAID_MODEL_PATTERNS = [
  // DeepSeek (paid versions)
  'deepseek/deepseek-v3',              // DeepSeek V3.x

  // Google
  'google/gemini-2.5-pro',             // Gemini 2.5 Pro
  'google/gemini-2.5-flash',           // Gemini 2.5 Flash (paid)

  // OpenAI
  'openai/gpt-4o',                     // GPT-4o & variants
  'openai/gpt-4.1',                    // GPT-4.1 series
  'openai/o1',                         // o1 reasoning
  'openai/o3',                         // o3 reasoning
  'openai/o4-mini',                    // o4-mini

  // Anthropic
  'anthropic/claude-3.5-sonnet',       // Claude 3.5 Sonnet
  'anthropic/claude-3.5-haiku',        // Claude 3.5 Haiku
  'anthropic/claude-sonnet-4',         // Claude Sonnet 4.x
  'anthropic/claude-opus-4',           // Claude Opus 4.x
  'anthropic/claude-haiku-4',          // Claude Haiku 4.x

  // xAI
  'x-ai/grok',                         // Grok models
] as const;

// Models to always hide (blacklist) - uses partial matching
// CAUTION: Many paid models have ':beta' suffix - don't blacklist 'beta' alone!
export const TRADECOUNCIL_MODEL_BLACKLIST = [
  // Experimental/unstable
  'speciale',
  ':experimental',
  ':extended',
  // Old versions
  'gpt-3.5',
  'gpt-4-turbo',
  'claude-2',
  'claude-instant',
  'claude-3-opus', // old opus
  // Niche/specialized
  'chimera',
  'uncensored',
  'venice',
  'kat-coder',
  'robotics',
  'nano-banana',
  'nex-',
  'tng/',
  // Distilled/small variants (keep main models only)
  'distill',
  'qwen3-4b',
  'qwen3-8b',
  'qwen3-14b',
  'qwen3-30b',
] as const;

/**
 * Check if a model should be visible in TradeCouncil
 */
export function isTradeCouncilModel(modelId: string): boolean {
  const id = modelId.toLowerCase();

  // First check blacklist - always hide these
  if (TRADECOUNCIL_MODEL_BLACKLIST.some(blocked => id.includes(blocked.toLowerCase()))) {
    return false;
  }

  const isFreeModel = id.includes(':free');

  // For FREE models - check if it matches our free model patterns
  if (isFreeModel) {
    return TRADECOUNCIL_FREE_MODEL_PATTERNS.some(pattern =>
      id.includes(pattern.toLowerCase())
    );
  }

  // For PAID models - check patterns, but exclude if a free version should be shown instead
  // (prevents showing paid version when free version exists)
  const matchesFreePattern = TRADECOUNCIL_FREE_MODEL_PATTERNS.some(pattern =>
    id.includes(pattern.toLowerCase())
  );

  // If this paid model matches a free pattern, hide it (user should use free version)
  if (matchesFreePattern) {
    return false;
  }

  // Check if it matches paid model patterns
  return TRADECOUNCIL_PAID_MODEL_PATTERNS.some(pattern =>
    id.includes(pattern.toLowerCase())
  );
}
