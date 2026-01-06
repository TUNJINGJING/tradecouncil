/**
 * Model Credit Cost Configuration
 * SRP: Only model-to-credit cost mapping
 * OCP: Easy to add new models without modifying logic
 */

// Cost per model (in credits)
// Free models via OpenRouter: 0 credits
// Standard models: 1 credit
// Premium models: 2-3 credits

const MODEL_CREDIT_COSTS: Record<string, number> = {
  // === FREE MODELS (0 credits) ===
  // DeepSeek free
  'deepseek/deepseek-r1': 0,
  'deepseek/deepseek-chat:free': 0,
  // Google free
  'google/gemini-2.0-flash': 0,
  'google/gemma-3': 0,
  // Meta free
  'meta-llama/llama-3.3-70b': 0,
  'meta-llama/llama-3.1-405b': 0,
  // Qwen free
  'qwen/qwen-2.5-72b': 0,
  'qwen/qwen3': 0,
  // Mistral free
  'mistralai/mistral-small': 0,

  // === STANDARD MODELS (1 credit) ===
  // DeepSeek paid
  'deepseek/deepseek-v3': 1,
  // Google paid
  'google/gemini-2.5-pro': 1,
  'google/gemini-2.5-flash': 1,
  // OpenAI standard
  'openai/gpt-4o': 1,
  'openai/gpt-4.1': 1,
  // Anthropic standard
  'anthropic/claude-3.5-sonnet': 1,
  'anthropic/claude-3.5-haiku': 1,
  'anthropic/claude-sonnet-4': 1,
  'anthropic/claude-haiku-4': 1,
  // xAI
  'x-ai/grok': 1,

  // === PREMIUM MODELS (2-3 credits) ===
  // OpenAI reasoning
  'openai/o1': 3,
  'openai/o3': 3,
  'openai/o4-mini': 2,
  // Anthropic premium
  'anthropic/claude-opus-4': 3,
};

// Default cost for unknown models
const DEFAULT_CREDIT_COST = 1;

/**
 * Get the credit cost for a model
 * Uses partial matching to handle versioned model IDs
 */
export function getModelCreditCost(modelId: string): number {
  const id = modelId.toLowerCase();

  // Check for :free suffix first (always 0 credits)
  if (id.includes(':free')) {
    return 0;
  }

  // Direct match
  if (MODEL_CREDIT_COSTS[id] !== undefined) {
    return MODEL_CREDIT_COSTS[id];
  }

  // Partial match (for versioned IDs like openai/gpt-4o-2024-08-06)
  for (const [pattern, cost] of Object.entries(MODEL_CREDIT_COSTS)) {
    if (id.includes(pattern.toLowerCase())) {
      return cost;
    }
  }

  // Unknown model - use default
  console.warn(`[Credits] Unknown model cost for: ${modelId}, using default ${DEFAULT_CREDIT_COST}`);
  return DEFAULT_CREDIT_COST;
}

/**
 * Check if a model is free (0 credits)
 */
export function isModelFree(modelId: string): boolean {
  return getModelCreditCost(modelId) === 0;
}

/**
 * Calculate total credits for multiple models (Council/Fusion)
 */
export function calculateTotalCredits(modelIds: string[]): number {
  return modelIds.reduce((total, id) => total + getModelCreditCost(id), 0);
}
