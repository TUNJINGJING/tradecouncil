import * as React from 'react';
import { type StoreApi, useStore } from 'zustand';

import { useShallowStable } from '~/common/util/hooks/useShallowObject';

import type { AnalysisStore } from './store-analysis_vanilla';


export type AnalysisStoreApi = Readonly<StoreApi<AnalysisStore>>;


export const useAnalysisStore = <T, >(analysisStore: AnalysisStoreApi, selector: (store: AnalysisStore) => T): T =>
  useStore(analysisStore, selector);

/*export const useIsAnalysisOpen = (analysisStore?: AnalysisStoreApi) => {
  const [open, setOpen] = React.useState(false);

  // attach to the current analysisStore
  React.useEffect(() => {
    if (!analysisStore) {
      setOpen(false);
      return;
    }
    setOpen(analysisStore.getState().isOpen);
    return analysisStore.subscribe((state: AnalysisState, prevState: AnalysisState) => {
      (state.isOpen !== prevState.isOpen) && setOpen(state.isOpen);
    });
  }, [analysisStore]);

  return open;
};*/

export function useAreAnalysisOpen(analysisStores: (AnalysisStoreApi | null)[]): boolean[] {

  // state
  const [_changeVersion, setChangeVersion] = React.useState(0);

  // [effect] monitor the stores for changes
  React.useEffect(() => {
    const updateIfOpenChanges = (state: AnalysisStore, prevState: AnalysisStore) => {
      if (state.isOpen !== prevState.isOpen)
        setChangeVersion(version => version + 1);
    };

    // monitor the open status of all stores
    const unsubscribes = analysisStores.filter(store => !!store).map((analysisStore) => {
      return analysisStore?.subscribe(updateIfOpenChanges);
    });

    // unsubscribe on cleanup or when the stores change
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe?.());
  }, [analysisStores]);

  return useShallowStable(analysisStores.map(analysisStore => analysisStore?.getState().isOpen ?? false));
}