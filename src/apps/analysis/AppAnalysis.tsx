import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Box } from '@mui/joy';

import { AnalysisStoreApi, useAnalysisStore } from '~/modules/analysis/store-analysis.hooks';
import { AnalysisView } from '~/modules/analysis/AnalysisView';
import { createAnalysisVanillaStore } from '~/modules/analysis/store-analysis_vanilla';

import { createDConversation, DConversation } from '~/common/stores/chat/chat.conversation';
import { createDMessageTextContent, DMessage } from '~/common/stores/chat/chat.message';
import { getChatLLMId } from '~/common/stores/llms/store-llms';
import { useIsMobile } from '~/common/components/useMatchMedia';


function initTestConversation(): DConversation {
  const conversation = createDConversation();
  conversation.messages.push(createDMessageTextContent('system', 'You are a helpful assistant.')); // Analysis Test - seed1
  conversation.messages.push(createDMessageTextContent('user', 'Hello, who are you? (please expand...)')); // Analysis Test - seed2
  return conversation;
}

function initTestAnalysisStore(messages: DMessage[], analysisStore: AnalysisStoreApi): AnalysisStoreApi {
  // Get the default chat LLM ID to use as Merge Model
  const defaultLlmId = getChatLLMId();
  analysisStore.getState().open(messages, defaultLlmId, false, (content) => alert(content));
  return analysisStore;
}


export function AppAnalysis() {

  // state
  const [conversation] = React.useState<DConversation>(() => initTestConversation());
  const [analysisStoreApi] = React.useState(() => createAnalysisVanillaStore());


  // reinit the analysis store if the conversation changes
  React.useEffect(() => {
    initTestAnalysisStore(conversation.messages, analysisStoreApi);
  }, [analysisStoreApi, conversation]);


  // external state
  const isMobile = useIsMobile();
  const isOpen = useAnalysisStore(analysisStoreApi, useShallow(state => state.isOpen));


  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', position: 'relative' }}>
      {isOpen && (
        <AnalysisView
          analysisStore={analysisStoreApi}
          isMobile={isMobile}
        />
      )}
    </Box>
  );
}
