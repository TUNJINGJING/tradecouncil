import * as React from 'react';

import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, FormLabel, Grid, IconButton, LinearProgress, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';

import { LLMChainStep, useLLMChain } from '~/modules/aifn/useLLMChain';
import { ScaledTextBlockRenderer } from '~/modules/blocks/ScaledTextBlockRenderer';

import type { ContentScaling } from '~/common/app.theme';
import { GoodTooltip } from '~/common/components/GoodTooltip';
import { agiUuid } from '~/common/util/idUtils';
import { copyToClipboard } from '~/common/util/clipboardUtils';
import { useFormEditTextArray } from '~/common/components/forms/useFormEditTextArray';
import { useLLMSelect, useLLMSelectLocalState } from '~/common/components/forms/useLLMSelect';
import { useToggleableBoolean } from '~/common/util/hooks/useToggleableBoolean';
import { useUIContentScaling } from '~/common/stores/store-ui';

import { FromText } from './FromText';
import { FromYouTube } from './FromYouTube';
import { prependSimplePersona, SimplePersonaProvenance } from '../store-app-strategies';
import { CustomStrategyEditor } from '../CustomStrategyEditor';


// delay to start a new chain after the previous one finishes
const CONTINUE_DELAY: number | false = false;


const Prompts: string[] = [
  'You are a quantitative analyst and trading system architect. You excel at extracting trading rules, entry/exit logic, and risk management principles from various sources including trading books, research papers, video tutorials, and market analysis. Be precise, systematic, and focus on actionable trading parameters.',
  'Extract the core trading logic from the provided content. Identify and document:\n\n1. TRADING PHILOSOPHY: Core beliefs, market approach, preferred conditions\n2. ENTRY RULES: Specific triggers, confirmation signals, timing filters\n3. EXIT RULES: Stop loss methodology, take profit targets, trailing stops\n4. RISK MANAGEMENT: Position sizing, maximum risk per trade, portfolio exposure\n5. TIMEFRAMES: Preferred chart intervals, holding periods\n6. ASSET CLASSES: Which markets/instruments this strategy applies to\n\nYour output should be a comprehensive extraction of all trading rules mentioned.',
  'Transform the extracted trading logic into a structured strategy framework:\n\n**STRATEGY NAME**: [Descriptive name]\n**CATEGORY**: [Scalping/Day Trading/Swing Trading/Investing]\n**ASSET CLASS**: [Stocks/Forex/Crypto/Futures/etc.]\n\n**ENTRY LOGIC**:\n- Trigger: [Primary entry condition]\n- Confirmation: [Secondary signals required]\n- Timing: [When to execute]\n\n**EXIT LOGIC**:\n- Stop Loss: [Specific rule]\n- Take Profit: [Targets]\n- Trail: [Trailing stop method]\n\n**RISK MANAGEMENT**:\n- Risk per Trade: [Percentage]\n- Position Sizing: [Formula or method]\n- Max Positions: [Limit]\n\nMake the framework specific and actionable with concrete parameters.',
  'Generate a production-ready System Prompt for an AI trading analyst. The prompt should:\n\n1. Begin with "You are a [Strategy Name] specialist/analyst..."\n2. Include the ANALYSIS FRAMEWORK section with numbered steps\n3. Define clear ENTRY LOGIC with trigger, confirmation, and timing\n4. Define clear EXIT LOGIC with stop loss and take profit rules\n5. Include RISK MANAGEMENT parameters\n6. End with a structured OUTPUT format that includes:\n   - Trend assessment\n   - Trade signal (Entry/Wait/Exit)\n   - Specific price levels (Entry, Stop Loss, Take Profit)\n   - Risk/Reward ratio\n   - Detailed reasoning\n\nThe final output should be a complete, self-contained system prompt that an AI can use to analyze charts and provide trading recommendations according to this specific strategy.',
];

const getTitlesForTab = (selectedTab: number): string[] => {
  const analyzeSubject: string = selectedTab ? 'trading material' : 'video content';
  return [
    'Common: Strategy Architect System Prompt',
    `Extract trading logic from ${analyzeSubject}`,
    'Define strategy framework',
    'Generate system prompt',
  ];
};

// chain to convert a text input string (e.g. trading video/book) into a strategy system prompt
function createChain(instructions: string[], titles: string[]): LLMChainStep[] {
  return [
    {
      name: titles[1],
      setSystem: instructions[0],
      addUserChainInput: true,
      addUserText: instructions[1],
    },
    {
      name: titles[2],
      addModelPrevOutput: true,
      addUserText: instructions[2],
    },
    {
      name: titles[3],
      addModelPrevOutput: true,
      addUserText: instructions[3],
    },
  ];
}


export const StrategyPromptCard = (props: {
  content: string,
  contentScaling: ContentScaling,
}) =>
  <Card sx={{ boxShadow: 'md', mt: 3 }}>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography level='title-lg' color='success' startDecorator={<SettingsAccessibilityIcon color='success' />}>
        Strategy System Prompt
      </Typography>
      <GoodTooltip title='Copy system prompt'>
        <Button color='success' onClick={() => copyToClipboard(props.content, 'Strategy prompt')} endDecorator={<ContentCopyIcon />} sx={{ minWidth: 120 }}>
          Copy
        </Button>
      </GoodTooltip>
    </Box>

    <CardContent>
      <Alert variant='soft' color='success' sx={{ mb: 1 }}>
        Your trading strategy is ready! Copy the text below and use it as a Custom Strategy prompt.
      </Alert>
      <ScaledTextBlockRenderer
        text={props.content}
        contentScaling={props.contentScaling}
        textRenderVariant='markdown'
      />
    </CardContent>
  </Card>;


export function Creator(props: { display: boolean }) {

  // state
  const advanced = useToggleableBoolean();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [chainInputText, setChainInputText] = React.useState<string | null>(null);
  const [inputProvenance, setInputProvenance] = React.useState<SimplePersonaProvenance | null>(null);
  const [showIntermediates, setShowIntermediates] = React.useState(false);

  // external state
  const contentScaling = useUIContentScaling();
  const [strategyLlmId, setStrategyLlmId] = useLLMSelectLocalState(true);
  const [strategyLlm, llmComponent] = useLLMSelect(strategyLlmId, setStrategyLlmId, { label: 'Strategy Creation Model', larger: true });


  // editable prompts
  const promptTitles = React.useMemo(() => getTitlesForTab(selectedTab), [selectedTab]);

  const {
    strings: editedInstructions, stringEditors: instructionEditors,
  } = useFormEditTextArray(Prompts, promptTitles);

  const { steps: creationChainSteps, id: chainId } = React.useMemo(() => {
    return {
      steps: createChain(editedInstructions, promptTitles),
      id: agiUuid('persona-creator-chain'),
    };
  }, [editedInstructions, promptTitles]);

  const llmLabel = strategyLlm?.label || undefined;
  const saveStrategy = React.useCallback((strategyPrompt: string, inputText: string) => {
    prependSimplePersona(strategyPrompt, inputText, inputProvenance ?? undefined, llmLabel);
  }, [inputProvenance, llmLabel]);

  const {
    // isFinished,
    isTransforming,
    chainProgress,
    chainIntermediates,
    chainStepName,
    chainStepInterimChars,
    chainOutputText,
    chainErrorMessage,
    userCancelChain,
    restartChain,
  } = useLLMChain(
    creationChainSteps,
    strategyLlm?.id,
    chainInputText ?? undefined,
    'persona-extract',
    chainId,
    saveStrategy,
  );


  // Reset the relevant state when the selected tab changes
  React.useEffect(() => {
    setChainInputText(null);
  }, [selectedTab]);


  // [debug] Restart the chain when complete after a delay
  const debugRestart = !!CONTINUE_DELAY && !isTransforming && (chainProgress === 1 || !!chainErrorMessage);
  React.useEffect(() => {
    if (debugRestart) {
      const timeout = setTimeout(restartChain, CONTINUE_DELAY);
      return () => clearTimeout(timeout);
    }
  }, [debugRestart, restartChain]);


  const handleCreate = React.useCallback((text: string, provenance: SimplePersonaProvenance) => {
    setChainInputText(text);
    setInputProvenance(provenance);
  }, []);

  const handleCancel = React.useCallback(() => {
    setChainInputText(null);
    setInputProvenance(null);
    userCancelChain();
  }, [userCancelChain]);


  // Hide the GFX, but not the logic (hooks)
  if (!props.display)
    return null;

  return <>

    <Typography level='title-sm' mb={3}>
      Create a <em>Trading Strategy System Prompt</em> from YouTube trading videos or text from trading books.
    </Typography>


    {/* Inputs */}
    <Tabs
      variant='outlined'
      defaultValue={0}
      value={selectedTab}
      onChange={(_event, newValue) => setSelectedTab(newValue as number)}
      sx={{
        // boxShadow: 'sm',
        borderRadius: 'md',
        // overflow: 'hidden',
        display: isTransforming ? 'none' : undefined,
      }}
    >
      <TabList
        sx={{
          minHeight: '3rem',
          [`& .${tabClasses.root}[aria-selected="true"]`]: {
            // color: 'primary.softColor',
            bgcolor: 'background.popup',
            boxShadow: 'sm',
            fontWeight: 'lg',
          },
          // first element
          '& > *:first-of-type': { borderTopLeftRadius: '0.5rem' },
        }}
      >
        <Tab>From Trading Video</Tab>
        <Tab>From Trading Book</Tab>
        <Tab>Custom Strategy</Tab>
      </TabList>
      <TabPanel keepMounted value={0} sx={{ p: 3 }}>
        <FromYouTube isTransforming={isTransforming} onCreate={handleCreate} />
      </TabPanel>
      <TabPanel keepMounted value={1} sx={{ p: 3 }}>
        <FromText isCreating={isTransforming} onCreate={handleCreate} />
      </TabPanel>
      <TabPanel keepMounted value={2} sx={{ p: 3 }}>
        <CustomStrategyEditor />
      </TabPanel>

      {/* LLM Options - only for tabs 0 and 1 */}
      {selectedTab < 2 && <>
        <Divider orientation='horizontal' />

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {llmComponent}

          {advanced.on && (
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {instructionEditors}
            </Box>
          )}

          <FormLabel onClick={advanced.toggle} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
            {advanced.on ? 'Hide Advanced' : 'Advanced: Prompts'}
          </FormLabel>
        </Box>
      </>}
    </Tabs>


    {/* Strategy Creation Progress */}
    {/* <GoodModal open> */}
    {isTransforming && <Card><CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
        <CircularProgress color='primary' value={Math.max(10, 100 * chainProgress)} />
      </Box>
      <Box>
        <Typography color='success' level='title-lg'>
          Creating Trading Strategy ...
        </Typography>
        <Typography level='title-sm' sx={{ mt: 1 }}>
          Using: {strategyLlm?.label}
        </Typography>
      </Box>
      <Box>
        <Typography color='success' level='title-sm' sx={{ fontWeight: 'lg' }}>
          {chainStepName}
        </Typography>
        <LinearProgress color='success' determinate value={Math.max(10, 100 * chainProgress)} sx={{ mt: 1.5 }} />
        <Typography level='body-sm' sx={{ mt: 1 }}>
          {chainStepInterimChars === null ? 'Loading ...' : `Generating (${chainStepInterimChars.toLocaleString()} bytes) ...`}
        </Typography>
      </Box>
      <Typography level='title-sm'>
        This may take 1-2 minutes.
        Larger models will produce higher quality strategy prompts.
        If you experience any errors (e.g. LLM timeouts, or context overflows for larger content)
        please try again with faster/smaller models.
      </Typography>
      <Button variant='soft' color='neutral' onClick={handleCancel} sx={{ ml: 'auto', minWidth: 100, mt: 3 }}>
        Cancel
      </Button>
    </CardContent></Card>}


    {/* Errors */}
    {!!chainErrorMessage && (
      <Alert color='warning' sx={{ mt: 1 }}>
        <Typography component='div'>{chainErrorMessage}</Typography>
      </Alert>
    )}

    {/* The Strategy (Output) */}
    {chainOutputText && <>
      <StrategyPromptCard
        content={chainOutputText}
        contentScaling={contentScaling}
      />
    </>}


    {/* Input + Intermediate outputs (with expander) */}
    {(isTransforming || chainIntermediates?.length > 0) && <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3, mb: 0.5, mx: 1 }}>
        <Typography level='title-lg'>
          {isTransforming ? 'Working ...' : 'Intermediate Work'}
        </Typography>
        <IconButton size='sm' variant={showIntermediates ? 'solid' : 'outlined'} onClick={() => setShowIntermediates(s => !s)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid xs={12} md={showIntermediates ? 12 : 6}>
          <Card sx={{ height: '100%', overflow: 'hidden' }}>
            <CardContent>
              <Typography color='success' level='title-sm' sx={{ mb: 1 }}>
                Input Text
              </Typography>
              <Typography level='body-sm'>
                {showIntermediates ? chainInputText : (chainInputText?.slice(0, 280) + '...')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {chainIntermediates.map((intermediate, i) =>
          <Grid xs={12} md={showIntermediates ? 12 : 6} key={i}>
            <Card sx={{ height: '100%', overflow: 'hidden' }}>
              <CardContent>
                <Typography color='success' level='title-sm' sx={{ mb: 1 }}>
                  {i + 1}. {intermediate.name}
                </Typography>
                <Typography level='body-sm'>
                  {showIntermediates ? intermediate.output : (intermediate.output?.slice(0, 280) + '...')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>,
        )}
      </Grid>
    </>}

  </>;
}