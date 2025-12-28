import * as React from 'react';

import { Box, Container, ListDivider, Typography } from '@mui/joy';

import { OptimaDrawerIn } from '~/common/layout/optima/portals/OptimaPortalsIn';

import { Creator } from './creator/Creator';
import { CreatorDrawer } from './creator/CreatorDrawer';
import { Viewer } from './creator/Viewer';


export function AppStrategies() {

  // state
  const [selectedSimpleStrategyId, setSelectedSimpleStrategyId] = React.useState<string | null>(null);

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

      <Container disableGutters maxWidth='md' sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        <Typography level='title-lg' sx={{ textAlign: 'center' }}>
          Trading Strategies Creator
        </Typography>

        <ListDivider sx={{ my: 2 }} />

        {!!selectedSimpleStrategyId && <Viewer selectedSimplePersonaId={selectedSimpleStrategyId} />}

        <Creator display={!selectedSimpleStrategyId} />

      </Container>

    </Box>
  </>;
}