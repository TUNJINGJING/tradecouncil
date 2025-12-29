import type { SxProps } from '@mui/joy/styles/types';
import { Box, styled } from '@mui/joy';

import { animationShadowLimey } from '~/common/util/animUtils';

import { ANALYSIS_INVERT_BACKGROUND, ANALYSIS_PANE_ZINDEX } from './analysis.config';


export const analysisCardClasses = {
  fusionIdle: 'analysisCard-fusionIdle',
  errored: 'analysisCard-Errored',
  selectable: 'analysisCard-Selectable',
  attractive: 'analysisCard-Attractive',
  smashTop: 'analysisCard-SmashTop',
};

/**
 * Used for message-containing cards.
 * DESIGN.md: Vault/Cyber-Noir aesthetic
 * - Deep void background (#0a0a0a)
 * - Swiss grid borders (#222)
 * - Corner decorations
 */
export const AnalysisCard = styled(Box)(({ theme }) => ({
  '--Card-padding': '1rem',

  // DESIGN.md: Deep background with concrete texture feel
  backgroundColor: '#0e0e0e', // Surface color from DESIGN.md
  border: '1px solid #222',   // Swiss grid border
  borderRadius: '4px',        // Sharp corners for industrial feel

  padding: 'var(--Card-padding)',

  // DESIGN.md: Corner decoration effect (subtle)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '20px',
    height: '20px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
    pointerEvents: 'none',
  },

  [`&.${analysisCardClasses.fusionIdle}`]: {
    backgroundColor: '#111',
  },
  [`&.${analysisCardClasses.selectable}`]: {
    backgroundColor: '#0a0a0a', // DESIGN.md: --bg-deep
    borderColor: 'rgba(0, 230, 118, 0.2)', // Subtle green hint
  },
  [`&.${analysisCardClasses.errored}`]: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)', // DESIGN.md: danger red with opacity
    borderColor: '#FF1744',
  },
  [`&.${analysisCardClasses.attractive}`]: {
    animation: `${animationShadowLimey} 2s linear infinite`,
  },
  [`&.${analysisCardClasses.smashTop}`]: {
    borderTop: 'none',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  position: 'relative',

  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--Pad_2)',

  // DESIGN.md: Hover state
  transition: 'border-color 0.2s, transform 0.2s',
  '&:hover': {
    borderColor: '#333',
  },
}));
AnalysisCard.displayName = 'AnalysisCard'; // [shared] scatter/gather pane style


export const analysisCardMessageWrapperSx: SxProps = {
  minHeight: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  // uncomment the following to limit the message height
  // overflow: 'auto',
  // maxHeight: 'calc(0.8 * (100vh - 16rem))',
  // aspectRatio: 1,
};

export const analysisCardMessageSx: SxProps = {
  // style: to undo the style of ChatMessage
  backgroundColor: 'none',
  border: 'none',
  mx: -1.5, // compensates for the marging (e.g. RenderChatText, )
  my: 0,
  px: 0,
  py: 0,
};

export const analysisCardMessageScrollingSx: SxProps = {
  ...analysisCardMessageSx,
  overflow: 'auto',
  maxHeight: 'max(18rem, calc(50lvh - 16rem))',
};


/**
 * Props for the two panes.
 * DESIGN.md: Vault/Cyber-Noir aesthetic
 */
export const analysisPaneSx: SxProps = {
  // DESIGN.md: Deep background
  backgroundColor: '#0a0a0a',
  borderBottom: '1px solid #222',

  // style
  p: 'var(--Pad)',
  py: 'calc(3 * var(--Pad) / 4)',
  zIndex: ANALYSIS_PANE_ZINDEX, // cast shadow on the rays/fusion, and be on top of the overlay pane

  // layout
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--Pad_2)',
};