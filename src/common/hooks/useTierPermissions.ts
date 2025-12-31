'use client';

import { useSession } from 'next-auth/react';

// Tier types
export type UserTier = 'OBSERVER' | 'TRADER' | 'ARCHITECT' | 'ARCHITECT_PRO';

// [DEV] Override tier for testing - set this to test different tiers
// Set to null for production behavior (use actual user tier)
const DEV_TIER_OVERRIDE: UserTier | null = null; // Change to 'TRADER' or 'ARCHITECT' to test

// Tier hierarchy (higher number = more permissions)
const TIER_LEVELS: Record<UserTier, number> = {
  OBSERVER: 0,
  TRADER: 1,
  ARCHITECT: 2,
  ARCHITECT_PRO: 3,
};

// Tier-based limits
export const TIER_LIMITS = {
  // Council concurrent models
  council: {
    OBSERVER: 2,
    TRADER: 3,
    ARCHITECT: 5,
    ARCHITECT_PRO: 5,
  },
  // Daily analysis quota (for OBSERVER, others use credits)
  dailyAnalysis: {
    OBSERVER: 3,
    TRADER: Infinity,
    ARCHITECT: Infinity,
    ARCHITECT_PRO: Infinity,
  },
  // Premium trial count per month (OBSERVER only)
  premiumTrials: {
    OBSERVER: 3,
    TRADER: Infinity,
    ARCHITECT: Infinity,
    ARCHITECT_PRO: Infinity,
  },
  // Chat history retention days
  historyDays: {
    OBSERVER: 7,
    TRADER: 90,
    ARCHITECT: Infinity,
    ARCHITECT_PRO: Infinity,
  },
  // Max chats (for OBSERVER)
  maxChats: {
    OBSERVER: 10,
    TRADER: Infinity,
    ARCHITECT: Infinity,
    ARCHITECT_PRO: Infinity,
  },
  // Custom strategies
  customStrategies: {
    OBSERVER: 0,
    TRADER: 0, // read-only presets
    ARCHITECT: 50,
    ARCHITECT_PRO: 100,
  },
} as const;

// Feature flags by tier
export const TIER_FEATURES = {
  // Access to mainstream models (GPT-4o, Claude 3.5, etc.)
  mainstreamModels: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Access to premium models (o1, Claude Opus, etc.)
  premiumModels: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Priority access to new models
  priorityModels: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Full fusion types (OBSERVER gets basic only)
  fullFusion: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Custom fusion (ARCHITECT only)
  customFusion: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Strategy library access
  strategyLibrary: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Custom strategies
  customStrategies: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Chat folders
  chatFolders: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Clipboard history
  clipboardHistory: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Full import/export
  fullImportExport: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Share links
  shareLinks: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Full chat actions (archive, branch, compact)
  fullChatActions: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Advanced vision (multi-model chart analysis)
  advancedVision: ['TRADER', 'ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Multi-model vision validation
  multiModelVision: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
  // Credits rollover
  creditsRollover: ['ARCHITECT', 'ARCHITECT_PRO'] as UserTier[],
} as const;

// Model categories for tier filtering
export const MODEL_TIERS = {
  free: [
    'openrouter/google/gemini-2.0-flash-exp:free',
    'openrouter/meta-llama/llama-3.3-70b-instruct:free',
    'openrouter/qwen/qwen-2.5-72b-instruct:free',
  ],
  mainstream: [
    'openai/gpt-4o',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.0-pro',
    'deepseek/deepseek-r1',
  ],
  premium: [
    'anthropic/claude-4.5-opus',
    'openai/o1',
    'openai/o3',
  ],
} as const;

export interface TierPermissions {
  tier: UserTier;
  tierLevel: number;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Limit getters
  councilLimit: number;
  dailyAnalysisLimit: number;
  historyDays: number;
  maxChats: number;
  customStrategiesLimit: number;

  // Feature checks
  hasFeature: (feature: keyof typeof TIER_FEATURES) => boolean;
  canAccessModel: (modelId: string) => boolean;
  canAccessModelTier: (modelTier: 'free' | 'mainstream' | 'premium') => boolean;

  // Tier comparison
  isAtLeast: (requiredTier: UserTier) => boolean;

  // Upgrade prompt helper
  getUpgradeMessage: (feature: string) => string;
}

/**
 * Hook to get user's tier and check permissions
 */
export function useTierPermissions(): TierPermissions {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // [DEV] Use override if set, otherwise use actual user tier
  // Default to OBSERVER for unauthenticated users
  const tier: UserTier = DEV_TIER_OVERRIDE ?? (session?.user?.tier as UserTier) ?? 'OBSERVER';
  const tierLevel = TIER_LEVELS[tier];

  // Check if user has access to a feature
  const hasFeature = (feature: keyof typeof TIER_FEATURES): boolean => {
    const allowedTiers = TIER_FEATURES[feature];
    return allowedTiers.includes(tier);
  };

  // Check if user's tier is at least the required tier
  const isAtLeast = (requiredTier: UserTier): boolean => {
    return tierLevel >= TIER_LEVELS[requiredTier];
  };

  // Check if user can access a specific model
  const canAccessModel = (modelId: string): boolean => {
    // Free models - everyone can access
    if (MODEL_TIERS.free.some(m => modelId.includes(m) || m.includes(modelId))) {
      return true;
    }
    // Mainstream models - TRADER and above
    if (MODEL_TIERS.mainstream.some(m => modelId.includes(m) || m.includes(modelId))) {
      return isAtLeast('TRADER');
    }
    // Premium models - ARCHITECT and above
    if (MODEL_TIERS.premium.some(m => modelId.includes(m) || m.includes(modelId))) {
      return isAtLeast('ARCHITECT');
    }
    // Unknown models - default to mainstream access level
    return isAtLeast('TRADER');
  };

  // Check if user can access a model tier
  const canAccessModelTier = (modelTier: 'free' | 'mainstream' | 'premium'): boolean => {
    switch (modelTier) {
      case 'free':
        return true;
      case 'mainstream':
        return isAtLeast('TRADER');
      case 'premium':
        return isAtLeast('ARCHITECT');
      default:
        return false;
    }
  };

  // Get upgrade message for a feature
  const getUpgradeMessage = (feature: string): string => {
    if (tier === 'OBSERVER') {
      return `Upgrade to TRADER to unlock ${feature}`;
    }
    if (tier === 'TRADER') {
      return `Upgrade to ARCHITECT to unlock ${feature}`;
    }
    return '';
  };

  return {
    tier,
    tierLevel,
    isAuthenticated,
    isLoading,

    // Limits
    councilLimit: TIER_LIMITS.council[tier],
    dailyAnalysisLimit: TIER_LIMITS.dailyAnalysis[tier],
    historyDays: TIER_LIMITS.historyDays[tier],
    maxChats: TIER_LIMITS.maxChats[tier],
    customStrategiesLimit: TIER_LIMITS.customStrategies[tier],

    // Methods
    hasFeature,
    canAccessModel,
    canAccessModelTier,
    isAtLeast,
    getUpgradeMessage,
  };
}

/**
 * Non-hook version for use in non-React contexts
 * Requires tier to be passed in
 */
export function getTierPermissions(tier: UserTier = 'OBSERVER') {
  const tierLevel = TIER_LEVELS[tier];

  return {
    tier,
    tierLevel,
    councilLimit: TIER_LIMITS.council[tier],
    dailyAnalysisLimit: TIER_LIMITS.dailyAnalysis[tier],
    historyDays: TIER_LIMITS.historyDays[tier],
    maxChats: TIER_LIMITS.maxChats[tier],
    customStrategiesLimit: TIER_LIMITS.customStrategies[tier],

    hasFeature: (feature: keyof typeof TIER_FEATURES): boolean => {
      return TIER_FEATURES[feature].includes(tier);
    },

    isAtLeast: (requiredTier: UserTier): boolean => {
      return tierLevel >= TIER_LEVELS[requiredTier];
    },
  };
}
