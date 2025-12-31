/**
 * TradeCouncil Curated Model List
 * Only these models are shown to users for a cleaner, more reliable experience.
 * All models via OpenRouter for unified billing.
 */

// Models to show (whitelist) - uses partial matching
export const TRADECOUNCIL_MODEL_WHITELIST = [
  // === FREE MODELS (OpenRouter) ===
  'deepseek/deepseek-r1',              // DeepSeek R1 (free)
  'deepseek/deepseek-chat:free',       // DeepSeek Chat (free)
  'google/gemini-2.0-flash',           // Gemini 2.0 Flash (free)
  'google/gemini-2.5-flash-preview',   // Gemini 2.5 Flash (free preview)
  'google/gemma-3-27b',                // Gemma 3 27B (free)
  'meta-llama/llama-3.3-70b',          // Llama 3.3 70B (free)
  'meta-llama/llama-3.1-405b',         // Llama 3.1 405B (free)
  'qwen/qwen-2.5-72b',                 // Qwen 2.5 72B (free)
  'qwen/qwen3',                        // Qwen 3 (free)
  'mistralai/mistral-small',           // Mistral Small (free)

  // === PAID MODELS (OpenRouter) ===
  // DeepSeek
  'deepseek/deepseek-chat',            // DeepSeek V3 (paid, cheap)
  'deepseek/deepseek-v3',              // DeepSeek V3.2

  // Google
  'google/gemini-2.5-pro',             // Gemini 2.5 Pro
  'google/gemini-2.5-flash',           // Gemini 2.5 Flash
  'google/gemini-flash-lite',          // Gemini Flash Lite

  // OpenAI
  'openai/gpt-4o',                     // GPT-4o
  'openai/gpt-4o-mini',                // GPT-4o Mini
  'openai/o1',                         // o1
  'openai/o3',                         // o3

  // Anthropic
  'anthropic/claude-3.5-sonnet',       // Claude 3.5 Sonnet
  'anthropic/claude-3.5-haiku',        // Claude 3.5 Haiku
  'anthropic/claude-sonnet-4',         // Claude Sonnet 4
  'anthropic/claude-opus',             // Claude Opus
] as const;

// Models to always hide (blacklist) - uses partial matching
export const TRADECOUNCIL_MODEL_BLACKLIST = [
  // Experimental/unstable
  'speciale',
  'exp:',
  'beta',
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
