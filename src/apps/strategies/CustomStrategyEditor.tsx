import * as React from 'react';

import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Textarea, Typography } from '@mui/joy';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { lineHeightTextareaMd } from '~/common/app.theme';

import { prependSimplePersona } from './store-app-strategies';


// Template for a new custom strategy
const STRATEGY_TEMPLATE = `You are a [Strategy Name] specialist/analyst.

ANALYSIS FRAMEWORK:

1. TRADING STYLE
   - Type: [Scalping/Day Trading/Swing Trading/Investing]
   - Holding Period: [Duration]
   - Goal: [Primary objective]

2. ASSET CLASS
   - Primary: [Stocks/Forex/Crypto/etc.]
   - Requirements: [Liquidity, volume, etc.]

3. ENTRY LOGIC
   TRIGGER:
   - [Primary entry condition]

   CONFIRMATION:
   - [Secondary signals required]

   TIMING:
   - [When to execute]

4. EXIT LOGIC
   STOP LOSS:
   - [Specific rule]

   TAKE PROFIT:
   - [Targets]

5. RISK MANAGEMENT
   - Risk per Trade: [Percentage]
   - Position Sizing: [Formula or method]

OUTPUT STRUCTURE:

**TREND ANALYSIS**
- Overall Trend: [Bullish/Bearish/Neutral]
- Momentum: [Strong/Weak/Diverging]

**TRADE SIGNAL**
- Signal: [LONG/SHORT/WAIT/EXIT]
- Confidence: [High/Medium/Low]

**TRADE PARAMETERS**
- Entry Price: [specific price]
- Stop Loss: [specific price]
- Take Profit: [specific price]
- Risk/Reward Ratio: [X:X]

**REASONING**
[Detailed explanation of the analysis]`;


export function CustomStrategyEditor(props: {
  onSaved?: () => void;
}) {

  // state
  const [name, setName] = React.useState('');
  const [systemPrompt, setSystemPrompt] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);


  const handleUseTemplate = React.useCallback(() => {
    setSystemPrompt(STRATEGY_TEMPLATE);
  }, []);

  const handleSave = React.useCallback(() => {
    if (!systemPrompt.trim()) return;

    setIsSaving(true);

    // Save with name in the prompt if provided
    const finalPrompt = name.trim()
      ? `# ${name.trim()}\n\n${systemPrompt}`
      : systemPrompt;

    prependSimplePersona(
      finalPrompt,
      '', // no input text for custom strategies
      { type: 'text' }, // mark as text provenance
      'Custom Strategy', // llm label
    );

    // Reset form
    setName('');
    setSystemPrompt('');
    setIsSaving(false);

    // Notify parent
    props.onSaved?.();
  }, [name, systemPrompt, props]);


  const isValid = systemPrompt.trim().length >= 50;

  return (
    <Card variant='outlined' sx={{ mt: 3 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditNoteRoundedIcon color='primary' />
          <Typography level='title-lg'>
            Custom Strategy Editor
          </Typography>
          <Typography level='body-sm' sx={{ ml: 'auto', color: 'neutral.500' }}>
            Pro Feature
          </Typography>
        </Box>

        <Typography level='body-sm' color='neutral'>
          Write your own trading strategy system prompt from scratch. This will be used as the AI analyst&apos;s instructions when analyzing charts.
        </Typography>

        <FormControl>
          <FormLabel>Strategy Name (optional)</FormLabel>
          <Input
            placeholder='e.g., My VWAP Scalper'
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ backgroundColor: 'background.popup' }}
          />
        </FormControl>

        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <FormLabel sx={{ mb: 0 }}>System Prompt</FormLabel>
            <Button
              size='sm'
              variant='plain'
              color='neutral'
              onClick={handleUseTemplate}
            >
              Use Template
            </Button>
          </Box>
          <Textarea
            minRows={12}
            maxRows={24}
            placeholder='You are a trading analyst specialized in...'
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            sx={{
              backgroundColor: 'background.level1',
              fontFamily: 'code',
              fontSize: 'sm',
              '&:focus-within': {
                backgroundColor: 'background.popup',
              },
              lineHeight: lineHeightTextareaMd,
            }}
          />
          <Typography level='body-xs' sx={{ mt: 0.5, textAlign: 'right', color: 'neutral.500' }}>
            {systemPrompt.length} characters
          </Typography>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
          {/* Future: Test on Demo Chart button */}
          {/* <Button variant='outlined' color='neutral' disabled>
            Test on Demo Chart
          </Button> */}
          <Button
            variant='solid'
            color='primary'
            disabled={!isValid || isSaving}
            loading={isSaving}
            startDecorator={<SaveRoundedIcon />}
            onClick={handleSave}
            sx={{ minWidth: 140 }}
          >
            Save Strategy
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}
