import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Box, Button, Typography } from '@mui/joy';

import { AnalysisStoreApi, useAnalysisStore } from '~/modules/analysis/store-analysis.hooks';
import { AnalysisView } from '~/modules/analysis/AnalysisView';
import { createAnalysisVanillaStore } from '~/modules/analysis/store-analysis_vanilla';

import { OptimaToolbarIn } from '~/common/layout/optima/portals/OptimaPortalsIn';
import { createDConversation, DConversation } from '~/common/stores/chat/chat.conversation';
import { createDMessageTextContent, DMessage } from '~/common/stores/chat/chat.message';
import { useIsMobile } from '~/common/components/useMatchMedia';


function initTestConversation(): DConversation {
  const conversation = createDConversation();
  conversation.messages.push(createDMessageTextContent('system', 'You are a helpful assistant.')); // Analysis Test - seed1
  conversation.messages.push(createDMessageTextContent('user', 'Hello, who are you? (please expand...)')); // Analysis Test - seed2
  return conversation;
}

function initTestAnalysisStore(messages: DMessage[], analysisStore: AnalysisStoreApi): AnalysisStoreApi {
  analysisStore.getState().open(messages, null, false, (content) => alert(content));
  return analysisStore;
}


export function AppAnalysis() {

  // state
  const [showDebug, setShowDebug] = React.useState(false);

  const [conversation, setConversation] = React.useState<DConversation>(() => initTestConversation());
  const [analysisStoreApi] = React.useState(() => createAnalysisVanillaStore());


  // reinit the analysis store if the conversation changes
  React.useEffect(() => {
    initTestAnalysisStore(conversation.messages, analysisStoreApi);
  }, [analysisStoreApi, conversation]);


  // external state
  const isMobile = useIsMobile();
  const { isOpen, analysisState } = useAnalysisStore(analysisStoreApi, useShallow(state => {
    return {
      isOpen: state.isOpen,
      analysisState: showDebug ? state : null,
    };
  }));


  const handleClose = React.useCallback(() => {
    analysisStoreApi.getState().terminateKeepingSettings();
  }, [analysisStoreApi]);


  const toolbarItems = React.useMemo(() => <>
    {/* button to toggle debug info */}
    <Button size='sm' variant='plain' color='neutral' onClick={() => setShowDebug(on => !on)}>
      {showDebug ? 'Hide' : 'Show'} debug
    </Button>

    {/* 'open' */}
    <Button size='sm' variant='plain' color='neutral' onClick={() => setConversation(initTestConversation())}>
      .open
    </Button>

    {/* 'close' */}
    <Button size='sm' variant='plain' color='neutral' onClick={handleClose}>
      .close
    </Button>
  </>, [handleClose, showDebug]);


  return <>
    <OptimaToolbarIn>{toolbarItems}</OptimaToolbarIn>

    <Box sx={{ flexGrow: 1, overflowY: 'auto', position: 'relative' }}>

      {isOpen && (
        <AnalysisView
          analysisStore={analysisStoreApi}
          isMobile={isMobile}
        />
      )}

      {showDebug && (
        <Typography level='body-xs' sx={{
          whiteSpace: 'pre',
          position: 'absolute',
          inset: 0,
          zIndex: 1 /* debug on top of AnalysisView */,
          backdropFilter: 'blur(4px)',
          padding: '1rem',
        }}>
          {JSON.stringify(analysisState, null, 2)
            // add an extra newline between first level properties (space, space, double quote) to make it more readable
            .split('\n').map(line => line.replace(/^\s\s"/g, '\n  ')).join('\n')}
        </Typography>
      )}

    </Box>

  </>;
}
