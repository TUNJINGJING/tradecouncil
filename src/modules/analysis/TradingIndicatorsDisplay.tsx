import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { Box, Typography } from '@mui/joy';

import type { TradingIndicators } from './trading-indicators';
import { getSignalColor } from './trading-indicators';


// DESIGN.md: Vault/Cyber-Noir aesthetic
// Colors: #0a0a0a bg, #00E676 green accent, #FF1744 red, monospace fonts

const containerSx: SxProps = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.75,
  py: 0.75,
  px: 0,
  mb: 0.5,
  borderBottom: '1px solid',
  borderColor: 'rgba(255, 255, 255, 0.08)', // DESIGN.md: --glass-border
  fontFamily: '"Courier New", monospace', // DESIGN.md: Data font
};

const indicatorSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  fontSize: '0.7rem',
  letterSpacing: '0.5px',
  fontFamily: '"Courier New", monospace',
};

const labelSx: SxProps = {
  color: 'rgba(255, 255, 255, 0.4)', // DESIGN.md: --text-dim (#666)
  textTransform: 'uppercase',
  fontSize: '0.65rem',
  letterSpacing: '1px',
};

const valueSx: SxProps = {
  fontWeight: 600,
  fontSize: '0.7rem',
};

// Status dot like DESIGN.md
const StatusDot = ({ color }: { color: 'success' | 'danger' | 'warning' | 'neutral' }) => {
  const colorMap = {
    success: '#00E676', // DESIGN.md: --accent green
    danger: '#FF1744',  // DESIGN.md: --danger red
    warning: '#FFD600',
    neutral: '#666',
  };

  return (
    <Box
      component="span"
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: colorMap[color],
        boxShadow: color !== 'neutral' ? `0 0 6px ${colorMap[color]}` : undefined,
        display: 'inline-block',
        mr: 0.5,
      }}
    />
  );
};

export function TradingIndicatorsDisplay(props: {
  indicators: TradingIndicators | null,
}) {
  const { indicators } = props;

  if (!indicators) return null;

  const signalColor = indicators.signal ? getSignalColor(indicators.signal) : 'neutral';

  return (
    <Box sx={containerSx}>
      {/* Signal with status dot */}
      {indicators.signal && (
        <Box sx={indicatorSx}>
          <StatusDot color={signalColor} />
          <Typography
            component="span"
            sx={{
              ...valueSx,
              color: signalColor === 'success' ? '#00E676'
                : signalColor === 'danger' ? '#FF1744'
                : signalColor === 'warning' ? '#FFD600'
                : '#fff',
            }}
          >
            {indicators.signal}
          </Typography>
        </Box>
      )}

      {/* Trend */}
      {indicators.trend && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>TREND</Typography>
          <Typography
            component="span"
            sx={{
              ...valueSx,
              color: indicators.trend === 'Bullish' ? '#00E676'
                : indicators.trend === 'Bearish' ? '#FF1744'
                : '#888',
            }}
          >
            {indicators.trend}
          </Typography>
        </Box>
      )}

      {/* Entry */}
      {indicators.entry && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>ENTRY</Typography>
          <Typography component="span" sx={{ ...valueSx, color: '#fff' }}>
            {indicators.entry}
          </Typography>
        </Box>
      )}

      {/* Stop Loss */}
      {indicators.stopLoss && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>SL</Typography>
          <Typography component="span" sx={{ ...valueSx, color: '#FF1744' }}>
            {indicators.stopLoss}
          </Typography>
        </Box>
      )}

      {/* Take Profit */}
      {indicators.takeProfit && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>TP</Typography>
          <Typography component="span" sx={{ ...valueSx, color: '#00E676' }}>
            {indicators.takeProfit}
          </Typography>
        </Box>
      )}

      {/* Risk/Reward */}
      {indicators.riskReward && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>R:R</Typography>
          <Typography component="span" sx={{ ...valueSx, color: '#fff' }}>
            {indicators.riskReward}
          </Typography>
        </Box>
      )}

      {/* Confidence */}
      {indicators.confidence && (
        <Box sx={indicatorSx}>
          <Typography component="span" sx={labelSx}>CONF</Typography>
          <Typography
            component="span"
            sx={{
              ...valueSx,
              color: indicators.confidence === 'High' ? '#00E676'
                : indicators.confidence === 'Low' ? '#FF1744'
                : '#FFD600',
            }}
          >
            {indicators.confidence}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
