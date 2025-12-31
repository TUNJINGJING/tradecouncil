import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, Button, Chip, Typography } from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';

import { TooltipOutlined } from '~/common/components/TooltipOutlined';
import { useTierPermissions } from '~/common/hooks/useTierPermissions';

import type { AnalysisStoreApi } from '../store-analysis.hooks';
import { ANALYSIS_BTN_SX, SCATTER_COLOR } from '../analysis.config';
import { AnalysisScatterDropdown } from './AnalysisScatterDropdown';
import { analysisPaneSx } from '../AnalysisCard';


const scatterPaneSx: SxProps = {
  ...analysisPaneSx,
  backgroundColor: 'background.popup',

  // col gap is pad/2 (8px), row is double (1rem)
  rowGap: 'var(--Pad)',

  // [desktop] scatter: primary-chan shadow
  // boxShadow: '0px 6px 12px -8px rgb(var(--joy-palette-primary-darkChannel) / 35%)',
  // boxShadow: '0px 16px 16px -24px rgb(var(--joy-palette-primary-darkChannel) / 35%)',
  boxShadow: '0px 6px 16px -12px rgb(var(--joy-palette-primary-darkChannel) / 50%)',
  // boxShadow: '0px 8px 20px -16px rgb(var(--joy-palette-primary-darkChannel) / 30%)',
};

const mobileScatterPaneSx: SxProps = scatterPaneSx;

const desktopScatterPaneSx: SxProps = {
  ...scatterPaneSx,

  // the fact that this works, means we got the CSS and layout right
  position: 'sticky',
  top: 0,
};

const _styles = {

  icon: {
    fontSize: '1rem',
    mr: 0.625,
  } as const,

  iconActive: {
    fontSize: '1rem',
    mr: 0.625,
    // NOTE: no reason to animate the color here, it's just a waste of power...
    // animation: `${animationColorBeamScatter} 2s linear infinite`,
    // ...and so we just fallback to the first color of the animation
    color: 'rgb(85, 140, 47)',
  } as const,

} as const;


export function AnalysisScatterPane(props: {
  analysisStore: AnalysisStoreApi,
  isMobile: boolean,
  rayCount: number,
  startEnabled: boolean,
  startBusy: boolean,
  startRestart: boolean,
  onStart: (restart: boolean) => void,
  onStop: () => void,
  onExplainerShow: () => any,
}) {

  // [TradeCouncil] Get tier-based Council limit
  const { councilLimit, tier } = useTierPermissions();

  const dropdownMemo = React.useMemo(() => (
    <AnalysisScatterDropdown
      analysisStore={props.analysisStore}
      onExplainerShow={props.onExplainerShow}
    />
  ), [props.analysisStore, props.onExplainerShow]);

  const { onStart, startRestart } = props;

  const handleStartClicked = React.useCallback((event: React.MouseEvent) => {
    onStart(!startRestart ? false : event.shiftKey);
  }, [onStart, startRestart]);

  return (
    <Box sx={props.isMobile ? mobileScatterPaneSx : desktopScatterPaneSx}>

      {/* Title */}
      <Box>
        <Typography
          level='h4' component='h3'
          endDecorator={dropdownMemo}
        >
          {props.startBusy
            ? <AutoAwesomeIcon sx={_styles.iconActive} />
            : <AutoAwesomeOutlinedIcon sx={_styles.icon} />}
          Analysis
        </Typography>
        <Typography level='body-sm' sx={{ whiteSpace: 'nowrap' }}>
          Explore different analyses
        </Typography>
      </Box>

      {/* Expert count display - shows current count and tier limit */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          variant='soft'
          color={SCATTER_COLOR}
          startDecorator={<GroupsIcon sx={{ fontSize: 'lg' }} />}
          sx={{ fontWeight: 'lg' }}
        >
          {props.rayCount} Expert{props.rayCount !== 1 ? 's' : ''}
        </Chip>
        <Typography level='body-xs' sx={{ color: 'text.tertiary' }}>
          {tier} · max {councilLimit}
        </Typography>
      </Box>

      {/* Start / Stop buttons */}
      {!props.startBusy ? (
        <TooltipOutlined slowEnter title={startRestart ? 'Shift + Click to re-run active Analyses' : null} placement='top-end'>
          <Button
            // key='scatter-start' // used for animation triggering, which we don't have now
            variant='solid' color={SCATTER_COLOR}
            disabled={!props.startEnabled || props.startBusy} loading={props.startBusy}
            endDecorator={<PlayArrowRoundedIcon />}
            onClick={handleStartClicked}
            sx={ANALYSIS_BTN_SX}
          >
            Start
          </Button>
        </TooltipOutlined>
      ) : (
        <Button
          // key='scatter-stop'
          variant='solid' color='danger'
          endDecorator={<StopRoundedIcon />}
          onClick={props.onStop}
          sx={ANALYSIS_BTN_SX}
        >
          Stop
          {/*{props.rayCount > props.raysReady && ` (${props.rayCount - props.raysReady})`}*/}
        </Button>
      )}

    </Box>
  );
}