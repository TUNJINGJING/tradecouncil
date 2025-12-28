import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DConversationId } from '~/common/stores/chat/chat.conversation';
import type { DLLMId } from '~/common/stores/llms/llms.types';
import { agiUuid } from '~/common/util/idUtils';

import type { FFactoryId } from './gather/instructions/analysis.gather.factories';


/// Presets (persisted as zustand store) ///

export interface AnalysisConfigSnapshot {
  id: string;
  name: string;
  rayLlmIds: DLLMId[];
  gatherFactoryId?: FFactoryId | null;  // added post launch
  gatherLlmId?: DLLMId | null;          // added post launch
}


interface ModuleAnalysisState {

  // stored
  presets: AnalysisConfigSnapshot[];
  lastConfig: AnalysisConfigSnapshot | null;
  cardAdd: boolean;
  cardScrolling: boolean;
  scatterShowLettering: boolean;
  scatterShowPrevMessages: boolean;
  gatherAutoStartAfterScatter: boolean;
  gatherShowAllPrompts: boolean;

  // non-stored, temporary but useful for the UI
  openAnalysisConversationIds: Record<string, boolean>;

}

interface ModuleAnalysisStore extends ModuleAnalysisState {
  addPreset: (name: string, rayLlmIds: DLLMId[], gatherLlmId: DLLMId | null, gatherFactoryId: FFactoryId | null) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;

  updateLastConfig: (update: Partial<AnalysisConfigSnapshot>) => void;
  deleteLastConfig: () => void;

  toggleCardAdd: () => void;
  toggleCardScrolling: () => void;
  toggleScatterShowLettering: () => void;
  toggleScatterShowPrevMessages: () => void;
  toggleGatherAutoStartAfterScatter: () => void;
  toggleGatherShowAllPrompts: () => void;

  setAnalysisOpenForConversation: (conversationId: DConversationId, isOpen: boolean) => void;
  clearAnalysisOpenForConversation: (conversationId: DConversationId) => void;
}


export const useModuleAnalysisStore = create<ModuleAnalysisStore>()(persist(
  (_set, _get) => ({

    presets: [],
    lastConfig: null,
    cardAdd: true,
    cardScrolling: false,
    scatterShowLettering: false,
    scatterShowPrevMessages: false,
    gatherShowAllPrompts: false,
    gatherAutoStartAfterScatter: false,
    openAnalysisConversationIds: {},


    addPreset: (name, rayLlmIds, gatherLlmId, gatherFactoryId) => _set(state => ({
      presets: [...state.presets, {
        id: agiUuid('analysis-preset-config'),
        name,
        rayLlmIds,
        gatherLlmId: gatherLlmId ?? undefined,
        gatherFactoryId: gatherFactoryId ?? undefined,
      }],
    })),

    deletePreset: (id) => _set(state => ({
      presets: state.presets.filter(preset => preset.id !== id),
    })),

    renamePreset: (id, name) => _set(state => ({
      presets: state.presets.map(preset => preset.id === id ? { ...preset, name } : preset),
    })),


    updateLastConfig: (update) => _set(({ lastConfig }) => ({
      lastConfig: !lastConfig
        ? { id: 'current', name: '', rayLlmIds: [], ...update }
        : { ...lastConfig, ...update },
    })),

    deleteLastConfig: () => _set({ lastConfig: null }),


    toggleCardAdd: () => _set(state => ({ cardAdd: !state.cardAdd })),

    toggleCardScrolling: () => _set(state => ({ cardScrolling: !state.cardScrolling })),

    toggleScatterShowLettering: () => _set(state => ({ scatterShowLettering: !state.scatterShowLettering })),

    toggleScatterShowPrevMessages: () => _set(state => ({ scatterShowPrevMessages: !state.scatterShowPrevMessages })),

    toggleGatherAutoStartAfterScatter: () => _set(state => ({ gatherAutoStartAfterScatter: !state.gatherAutoStartAfterScatter })),

    toggleGatherShowAllPrompts: () => _set(state => ({ gatherShowAllPrompts: !state.gatherShowAllPrompts })),

    setAnalysisOpenForConversation: (conversationId, isOpen) => _set(state => {
      const openAnalysis = { ...state.openAnalysisConversationIds };
      if (isOpen)
        openAnalysis[conversationId] = true;
      else
        delete openAnalysis[conversationId];
      return { openAnalysisConversationIds: openAnalysis };
    }),

    clearAnalysisOpenForConversation: (conversationId) => _set(state => {
      const openAnalysis = { ...state.openAnalysisConversationIds };
      delete openAnalysis[conversationId];
      return { openAnalysisConversationIds: openAnalysis };
    }),

  }), {
    name: 'app-module-analysis',
    version: 1,

    partialize: (state) => {
      // exclude openAnalysisConversationIds from persistence
      const { openAnalysisConversationIds, ...persistedState } = state;
      return persistedState;
    },

    migrate: (state: any, fromVersion: number): Omit<ModuleAnalysisState, 'openAnalysisConversationIds'> => {
      // 0 -> 1: rename 'scatterPresets' to 'presets'
      if (state && fromVersion === 0 && !state.presets)
        return { ...state, presets: state.scatterPresets || [] };
      return state;
    },
  },
));


export function getAnalysisCardScrolling() {
  return useModuleAnalysisStore.getState().cardScrolling;
}

export function useAnalysisCardScrolling() {
  return useModuleAnalysisStore((state) => state.cardScrolling);
}

export function useAnalysisScatterShowLettering() {
  return useModuleAnalysisStore((state) => state.scatterShowLettering);
}

export function useIsAnalysisOpenForConversation(conversationId: DConversationId | null): boolean {
  return useModuleAnalysisStore(state => conversationId ? state.openAnalysisConversationIds[conversationId] ?? false : false);
}

export function updateAnalysisLastConfig(update: Partial<AnalysisConfigSnapshot>) {
  useModuleAnalysisStore.getState().updateLastConfig(update);
}