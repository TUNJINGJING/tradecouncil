import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Alert, Box, CircularProgress } from '@mui/joy';

import { ConfirmationModal } from '~/common/components/modals/ConfirmationModal';
import { ShortcutKey, useGlobalShortcuts } from '~/common/components/shortcuts/useGlobalShortcuts';
import { copyToClipboard } from '~/common/util/clipboardUtils';
import { messageFragmentsReduceText } from '~/common/stores/chat/chat.message';
import { useUICounter } from '~/common/stores/store-ui';

import { AnalysisExplainer } from './AnalysisExplainer';
import { ConsensusGrid } from './gather/ConsensusGrid';
import { AnalysisGatherPane } from './gather/AnalysisGatherPane';
import { ExpertGrid } from './scatter/ExpertGrid';
import { AnalysisInput } from './scatter/AnalysisInput';
import { AnalysisScatterPane } from './scatter/AnalysisScatterPane';
import { AnalysisStoreApi, useAnalysisStore } from './store-analysis.hooks';
import { useModuleAnalysisStore } from './store-module-analysis';


export function AnalysisView(props: {
  analysisStore: AnalysisStoreApi,
  isMobile: boolean,
  showExplainer?: boolean,
  // sx?: SxProps,
}) {

  // state
  const [hasAutoMerged, setHasAutoMerged] = React.useState(false);
  const [warnIsScattering, setWarnIsScattering] = React.useState(false);

  // external state
  const { novel: explainerUnseen, touch: explainerCompleted, forget: explainerShow } = useUICounter('analysis-wizard');
  const { cardAdd, gatherAutoStartAfterScatter } = useModuleAnalysisStore(useShallow(state => ({
    cardAdd: state.cardAdd,
    gatherAutoStartAfterScatter: state.gatherAutoStartAfterScatter,
  })));
  const {
    /* root */ inputHistoryReplaceMessageFragment,
    /* scatter */ setRayCount, startScatteringAll, stopScatteringAll,
  } = props.analysisStore.getState();
  const {
    /* root */ inputHistory, inputIssues, inputReady,
    /* scatter */ hadImportedRays, isScattering, raysReady,
    /* gather (composite) */ canGather,
  } = useAnalysisStore(props.analysisStore, useShallow(state => ({
    // input
    inputHistory: state.inputHistory,
    inputIssues: state.inputIssues,
    inputReady: state.inputReady,
    // scatter
    hadImportedRays: state.hadImportedRays,
    isScattering: state.isScattering,
    raysReady: state.raysReady,
    // gather (composite)
    canGather: state.raysReady >= 2 && state.currentFactoryId !== null && state.currentGatherLlmId !== null,
  })));
  // the following are independent because of useShallow, which would break in the above call
  const rayIds = useAnalysisStore(props.analysisStore, useShallow(state => state.rays.map(ray => ray.rayId)));
  const fusionIds = useAnalysisStore(props.analysisStore, useShallow(state => state.fusions.map(fusion => fusion.fusionId)));

  // derived state
  const raysCount = rayIds.length;


  // handlers

  const handleRaySetCount = React.useCallback((n: number) => setRayCount(n), [setRayCount]);

  const handleRayIncreaseCount = React.useCallback(() => setRayCount(raysCount + 1), [setRayCount, raysCount]);

  const handleRaysOperation = React.useCallback((operation: 'copy' | 'use') => {
    const { rays, onSuccessCallback } = props.analysisStore.getState();
    const allFragments = rays.flatMap(ray => ray.message.fragments);
    if (allFragments.length) {
      switch (operation) {
        case 'copy':
          const combinedText = messageFragmentsReduceText(allFragments, '\n\n\n---\n\n\n');
          copyToClipboard(combinedText, 'All Analyses');
          break;
        case 'use':
          onSuccessCallback?.({ fragments: allFragments });
          break;
      }
    }
  }, [props.analysisStore]);

  const handleScatterStart = React.useCallback((restart: boolean) => {
    setHasAutoMerged(false);
    startScatteringAll(restart);
  }, [startScatteringAll]);


  const handleCreateFusion = React.useCallback(() => {
    // if scatter is busy, ask for confirmation
    if (isScattering) {
      setWarnIsScattering(true);
      return;
    }
    props.analysisStore.getState().createFusion();
  }, [isScattering, props.analysisStore]);


  const handleStartMergeConfirmation = React.useCallback(() => {
    setWarnIsScattering(false);
    stopScatteringAll();
    handleCreateFusion();
  }, [handleCreateFusion, stopScatteringAll]);

  const handleStartMergeDenial = React.useCallback(() => setWarnIsScattering(false), []);


  // auto-merge
  const shallAutoMerge = gatherAutoStartAfterScatter && canGather && !isScattering && !hasAutoMerged;
  React.useEffect(() => {
    if (shallAutoMerge) {
      setHasAutoMerged(true);
      handleStartMergeConfirmation();
    }
  }, [handleStartMergeConfirmation, shallAutoMerge]);

  // (great ux) scatter finished while the "start merge" (warning) dialog is up: dismiss dialog and proceed
  // here we assume that 'warnIsScattering' shows the intention of the user to proceed with a merge asap
  const shallResumeMerge = warnIsScattering && !isScattering && !gatherAutoStartAfterScatter;
  React.useEffect(() => {
    if (shallResumeMerge)
      handleStartMergeConfirmation();
  }, [handleStartMergeConfirmation, shallResumeMerge]);


  // runnning

  // [effect] pre-populate a default number of rays
  // const bootup = raysCount < SCATTER_RAY_DEF;
  // React.useEffect(() => {
  //   bootup && handleRaySetCount(SCATTER_RAY_DEF);
  // }, [bootup, handleRaySetCount]);


  // intercept ctrl+enter and esc
  useGlobalShortcuts('AnalysisView', React.useMemo(() => [
    { key: ShortcutKey.Enter, ctrl: true, action: () => handleScatterStart(false), disabled: isScattering, level: 1 },
    ...(isScattering ? [{ key: ShortcutKey.Esc, action: stopScatteringAll, level: 10 + 1 /* becasuse > ChatBarAltAnalysis */ }] : []),
  ], [handleScatterStart, isScattering, stopScatteringAll]));


  // Explainer, if unseen
  if (props.showExplainer && explainerUnseen)
    return <AnalysisExplainer onWizardComplete={explainerCompleted} />;

  return <>

    <Box role='analysis-list' sx={{
      // scroller fill
      minHeight: '100%',
      // ...props.sx,

      // DESIGN.md: Vault/Cyber-Noir aesthetic
      backgroundColor: '#0a0a0a', // Deep void background
      // Concrete noise texture via SVG
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,

      // config
      '--Pad': { xs: '1rem', md: '1.5rem' },
      '--Pad_2': 'calc(var(--Pad) / 2)',

      // layout
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--Pad)',
    }}>

      {/* Config Issues */}
      {!!inputIssues && <Alert>{inputIssues}</Alert>}


      {/* User Message */}
      <AnalysisInput
        isMobile={props.isMobile}
        history={inputHistory}
        onMessageFragmentReplace={inputHistoryReplaceMessageFragment}
      />

      {/* Scatter Controls */}
      <AnalysisScatterPane
        analysisStore={props.analysisStore}
        isMobile={props.isMobile}
        rayCount={raysCount}
        setRayCount={handleRaySetCount}
        showRayAdd={!cardAdd}
        startEnabled={inputReady}
        startBusy={isScattering}
        startRestart={!props.isMobile && raysReady >= 1 && raysReady < raysCount && !isScattering}
        onStart={handleScatterStart}
        onStop={stopScatteringAll}
        onExplainerShow={explainerShow}
      />


      {/* Rays Grid - ExpertAnalysis[] > <ChatMessage /> */}
      <ExpertGrid
        analysisStore={props.analysisStore}
        isMobile={props.isMobile}
        rayIds={rayIds}
        showRayAdd={cardAdd}
        showRaysOps={(isScattering || raysReady < 2) ? undefined : raysReady}
        hadImportedRays={hadImportedRays}
        onIncreaseRayCount={handleRayIncreaseCount}
        onRaysOperation={handleRaysOperation}
        // linkedLlmId={currentGatherLlmId}
      />


      {/* Gapper between Rays and Merge, without compromising the auto margin of the Ray Grid */}
      <Box />


      {/* Gather Controls */}
      <AnalysisGatherPane
        analysisStore={props.analysisStore}
        canGather={canGather}
        isMobile={props.isMobile}
        // onAddFusion={handleCreateFusion}
        raysReady={raysReady}
      />

      {/* Fusion Grid - Fusion[] > <ChatMessage /> */}
      <ConsensusGrid
        analysisStore={props.analysisStore}
        canGather={canGather}
        fusionIds={fusionIds}
        isMobile={props.isMobile}
        onAddFusion={handleCreateFusion}
        raysCount={raysCount}
      />

    </Box>


    {/* Confirm Stop Scattering */}
    {warnIsScattering && (
      <ConfirmationModal
        open
        onClose={handleStartMergeDenial}
        onPositive={handleStartMergeConfirmation}
        // lowStakes
        noTitleBar
        confirmationText='Some responses are still being generated. Do you want to stop and proceed with merging the available responses now?'
        positiveActionText='Proceed with Merge'
        negativeActionText='Wait for All Responses'
        negativeActionStartDecorator={
          <CircularProgress color='neutral' sx={{ '--CircularProgress-size': '24px', '--CircularProgress-trackThickness': '1px' }} />
        }
      />
    )}

  </>;
}


/* Commented code with a callout box to explain the first message
  <Box>
    <CalloutTopRightIcon sx={{ color: 'primary.solidBg', fontSize: '2.53rem', rotate: '-10deg' }} />
    <Chip
      color='primary'
      variant='solid'
      endDecorator={<ChipDelete onClick={() => alert('aa')} />}
      sx={{
        mx: -2,
        py: 1,
        px: 2,
      }}
    >
      Last message in the conversation
    </Chip>
  </Box>
*/