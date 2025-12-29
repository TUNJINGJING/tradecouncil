import * as React from 'react';

import { Box, Card, CardContent, Chip, Container, Grid, ListDivider, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from '@mui/joy';

import { OptimaDrawerIn } from '~/common/layout/optima/portals/OptimaPortalsIn';
import { StrategyCategory, StrategyData, StrategyPresetId, TradingStrategyPresets } from '../../data-strategies';

import { Creator } from './creator/Creator';
import { CreatorDrawer } from './creator/CreatorDrawer';
import { Viewer } from './creator/Viewer';


// Category colors
const categoryColors: Record<StrategyCategory, 'warning' | 'primary' | 'success' | 'neutral'> = {
  'Scalping': 'warning',
  'Day Trading': 'primary',
  'Swing Trading': 'success',
  'Investing': 'neutral',
};

// Category order for tabs
const categoryOrder: StrategyCategory[] = ['Scalping', 'Day Trading', 'Swing Trading', 'Investing'];


function StrategyCard(props: {
  strategyId: StrategyPresetId,
  isSelected: boolean,
  onClick: () => void,
}) {
  const strategy = TradingStrategyPresets[props.strategyId];
  if (!strategy || props.strategyId === 'Custom') return null;

  return (
    <Card
      variant={props.isSelected ? 'solid' : 'outlined'}
      color={props.isSelected ? categoryColors[strategy.category] : undefined}
      onClick={props.onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: `${categoryColors[strategy.category]}.500`,
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography level='h2' sx={{ fontSize: '1.75rem' }}>
            {strategy.symbol}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography level='title-md' sx={{ fontWeight: 'lg' }}>
              {strategy.title}
            </Typography>
            <Chip
              size='sm'
              variant='soft'
              color={categoryColors[strategy.category]}
              sx={{ mt: 0.5 }}
            >
              {strategy.category}
            </Chip>
          </Box>
        </Box>
        <Typography level='body-sm' sx={{ color: props.isSelected ? 'inherit' : 'text.secondary' }}>
          {strategy.description}
        </Typography>
      </CardContent>
    </Card>
  );
}


function PresetStrategiesGrid(props: {
  category: StrategyCategory | 'all',
  selectedStrategyId: StrategyPresetId | null,
  onSelectStrategy: (id: StrategyPresetId) => void,
}) {
  const strategies = (Object.entries(TradingStrategyPresets) as [StrategyPresetId, StrategyData][])
    .filter(([id, data]) =>
      id !== 'Custom' &&
      (props.category === 'all' || data.category === props.category),
    );

  return (
    <Grid container spacing={2}>
      {strategies.map(([id]) => (
        <Grid key={id} xs={12} sm={6}>
          <StrategyCard
            strategyId={id}
            isSelected={props.selectedStrategyId === id}
            onClick={() => props.onSelectStrategy(id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}


export function AppStrategies() {

  // state
  const [selectedSimpleStrategyId, setSelectedSimpleStrategyId] = React.useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = React.useState<StrategyPresetId | null>(null);
  const [viewMode, setViewMode] = React.useState<'presets' | 'create'>('presets');
  const [categoryTab, setCategoryTab] = React.useState(0);

  // handlers
  const handleSelectPreset = React.useCallback((id: StrategyPresetId) => {
    setSelectedPresetId((prev: StrategyPresetId | null) => prev === id ? null : id);
  }, []);

  const selectedPreset = selectedPresetId ? TradingStrategyPresets[selectedPresetId] : null;

  return <>

    {/* -> Drawer */}
    <OptimaDrawerIn>
      <CreatorDrawer
        selectedSimplePersonaId={selectedSimpleStrategyId}
        setSelectedSimplePersonaId={setSelectedSimpleStrategyId}
      />
    </OptimaDrawerIn>

    <Box sx={{
      flexGrow: 1,
      overflowY: 'auto',
      p: { xs: 3, md: 6 },
    }}>

      <Container disableGutters maxWidth='lg' sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        <Typography level='h3' sx={{ textAlign: 'center' }}>
          Trading Strategies
        </Typography>
        <Typography level='body-md' sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
          Select a preset strategy or create your own custom trading system
        </Typography>

        {/* Main Tabs: Presets vs Create */}
        <Tabs
          value={viewMode}
          onChange={(_, newValue) => setViewMode(newValue as 'presets' | 'create')}
          sx={{ mb: 3 }}
        >
          <TabList
            sx={{
              justifyContent: 'center',
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                bgcolor: 'background.surface',
                fontWeight: 'lg',
              },
            }}
          >
            <Tab value='presets'>Preset Strategies (8)</Tab>
            <Tab value='create'>Create Custom</Tab>
          </TabList>

          {/* Preset Strategies Panel */}
          <TabPanel value='presets' sx={{ p: 0, pt: 3 }}>
            {/* Category Filter Tabs */}
            <Tabs
              value={categoryTab}
              onChange={(_, newValue) => setCategoryTab(newValue as number)}
              sx={{ mb: 3 }}
            >
              <TabList variant='soft' sx={{ borderRadius: 'lg' }}>
                <Tab>All</Tab>
                {categoryOrder.map((cat) => (
                  <Tab key={cat}>{cat}</Tab>
                ))}
              </TabList>
            </Tabs>

            {/* Strategies Grid */}
            <PresetStrategiesGrid
              category={categoryTab === 0 ? 'all' : categoryOrder[categoryTab - 1]}
              selectedStrategyId={selectedPresetId}
              onSelectStrategy={handleSelectPreset}
            />

            {/* Selected Strategy Details */}
            {selectedPreset && (
              <Card variant='soft' color={categoryColors[selectedPreset.category]} sx={{ mt: 3 }}>
                <CardContent>
                  <Typography level='title-lg' sx={{ mb: 1 }}>
                    {selectedPreset.symbol} {selectedPreset.title}
                  </Typography>
                  <Typography level='body-sm' sx={{ mb: 2 }}>
                    {selectedPreset.description}
                  </Typography>

                  {selectedPreset.examples && selectedPreset.examples.length > 0 && (
                    <>
                      <Typography level='title-sm' sx={{ mb: 1 }}>
                        Example Prompts:
                      </Typography>
                      <Box component='ul' sx={{ m: 0, pl: 2 }}>
                        {selectedPreset.examples.slice(0, 3).map((example, idx: number) => (
                          <li key={idx}>
                            <Typography level='body-sm'>
                              {typeof example === 'string' ? example : example.prompt}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </>
                  )}

                  <Typography level='body-xs' sx={{ mt: 2, fontStyle: 'italic' }}>
                    Use this strategy in Chat by selecting it from the Strategy selector.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </TabPanel>

          {/* Create Custom Panel */}
          <TabPanel value='create' sx={{ p: 0, pt: 3 }}>
            <ListDivider sx={{ my: 2 }} />

            {!!selectedSimpleStrategyId && <Viewer selectedSimplePersonaId={selectedSimpleStrategyId} />}

            <Creator display={!selectedSimpleStrategyId} />
          </TabPanel>
        </Tabs>

      </Container>

    </Box>
  </>;
}