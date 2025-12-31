/**
 * TradeCouncil Curated Model List
 * Only these models are shown to users for a cleaner, more reliable experience.
 */

// Models to show (whitelist) - uses partial matching
export const TRADECOUNCIL_MODEL_WHITELIST = [
  // === Gemini (Direct API) - Best for Vision/Charts ===
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.0-flash',

  // === DeepSeek (Direct API) - Cost Effective ===
  'deepseek-chat',        // DeepSeek V3
  'deepseek-reasoner',    // DeepSeek R1

  // === OpenRouter Free Models ===
  'deepseek/deepseek-r1',              // DeepSeek R1 (free)
  'meta-llama/llama-3.3-70b-instruct', // Llama 3.3 70B (free)
  'google/gemini-2.0-flash',           // Gemini Flash (free)
  'google/gemma-3-27b',                // Gemma 3 27B (free)
  'qwen/qwen-2.5-72b-instruct',        // Qwen 2.5 72B (free)
  'mistralai/mistral-small',           // Mistral Small (free)

  // === OpenRouter Paid (when user adds OPENAI/ANTHROPIC keys via OpenRouter) ===
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-3.5-haiku',
] as const;

// Models to always hide (blacklist) - uses partial matching
export const TRADECOUNCIL_MODEL_BLACKLIST = [
  // Experimental/unstable models
  'speciale',
  'preview',
  'exp:',
  'beta',
  // Old versions
  'gpt-3.5',
  'gpt-4-turbo',
  'claude-2',
  'claude-instant',
  // Niche/specialized
  'chimera',
  'uncensored',
  'venice',
  'kat-coder',
  'robotics',
  'nano-banana', // Test model?
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

  // Then check whitelist - only show these
  return TRADECOUNCIL_MODEL_WHITELIST.some(allowed => id.includes(allowed.toLowerCase()));
}
