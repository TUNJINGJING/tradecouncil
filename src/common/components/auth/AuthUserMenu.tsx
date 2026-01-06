'use client';

import * as React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import DiamondIcon from '@mui/icons-material/Diamond';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BoltIcon from '@mui/icons-material/Bolt';

import { apiAsyncNode } from '~/common/util/trpc.client';
import type { UserCreditBalance } from '~/server/credits';

// Tier display configuration
const TIER_CONFIG = {
  OBSERVER: {
    label: 'OBSERVER',
    color: '#666',
    bgColor: 'transparent',
    borderColor: '#333',
  },
  TRADER: {
    label: 'TRADER',
    color: '#00E676',
    bgColor: 'rgba(0, 230, 118, 0.1)',
    borderColor: '#00E676',
  },
  ARCHITECT: {
    label: 'ARCHITECT',
    color: '#FFD700',
    bgColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: '#FFD700',
  },
  ARCHITECT_PRO: {
    label: 'ARCHITECT PRO',
    color: '#FF1744',
    bgColor: 'rgba(255, 23, 68, 0.1)',
    borderColor: '#FF1744',
  },
} as const;

interface AuthUserMenuProps {
  /** Callback when settings is clicked */
  onSettingsClick?: () => void;
  /** Callback when profile is clicked */
  onProfileClick?: () => void;
}

/**
 * User menu dropdown showing avatar, tier, and account options
 * Styled to match TradeCouncil cyber-noir aesthetic
 */
export function AuthUserMenu({ onSettingsClick, onProfileClick }: AuthUserMenuProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = React.useState<UserCreditBalance | null>(null);

  // Fetch credits when authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      apiAsyncNode.credits.getBalance.query()
        .then(setCredits)
        .catch((err) => console.error('Failed to fetch credits:', err));
    }
  }, [status]);

  // Don't render if not authenticated
  if (status !== 'authenticated' || !session?.user) {
    return null;
  }

  const user = session.user;
  const tier = user.tier || 'OBSERVER';
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.OBSERVER;
  const totalCredits = credits ? credits.subscriptionRemaining + credits.addonBalance : null;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            variant: 'plain',
            color: 'neutral',
            sx: {
              borderRadius: '50%',
              p: 0.5,
            },
          },
        }}
      >
        <Avatar
          src={user.image || undefined}
          alt={user.name || user.email}
          size="sm"
          sx={{
            border: `2px solid ${tierConfig.borderColor}`,
            boxShadow: tier !== 'OBSERVER' ? `0 0 8px ${tierConfig.color}` : 'none',
          }}
        >
          {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
        </Avatar>
      </MenuButton>

      <Menu
        placement="bottom-end"
        sx={{
          minWidth: 220,
          bgcolor: '#111',
          border: '1px solid #333',
          borderRadius: '8px',
          p: 0.5,
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography level="title-sm" sx={{ color: '#fff' }}>
            {user.name || 'User'}
          </Typography>
          <Typography level="body-xs" sx={{ color: '#666' }}>
            {user.email}
          </Typography>

          {/* Tier Badge */}
          <Chip
            size="sm"
            variant="outlined"
            startDecorator={tier !== 'OBSERVER' ? <DiamondIcon sx={{ fontSize: 12 }} /> : undefined}
            sx={{
              mt: 1,
              color: tierConfig.color,
              bgcolor: tierConfig.bgColor,
              borderColor: tierConfig.borderColor,
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              letterSpacing: '1px',
            }}
          >
            {tierConfig.label}
          </Chip>
        </Box>

        {/* Credits Display */}
        {totalCredits !== null && (
          <Box sx={{
            mx: 1.5,
            mb: 1,
            p: 1.5,
            bgcolor: '#0a0a0a',
            borderRadius: '6px',
            border: '1px solid #222',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BoltIcon sx={{ fontSize: 16, color: '#00E676' }} />
                <Typography level="body-xs" sx={{ color: '#888' }}>
                  Credits
                </Typography>
              </Box>
              <Typography level="title-sm" sx={{ color: '#00E676', fontFamily: 'monospace' }}>
                {totalCredits}
              </Typography>
            </Box>
            {credits && credits.subscriptionAllowance > 0 && (
              <Box sx={{
                mt: 1,
                height: 3,
                background: '#222',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <Box sx={{
                  height: '100%',
                  width: `${Math.round((credits.subscriptionRemaining / credits.subscriptionAllowance) * 100)}%`,
                  background: '#00E676',
                }} />
              </Box>
            )}
          </Box>
        )}

        <ListDivider sx={{ my: 0.5 }} />

        {/* Dashboard Link */}
        <MenuItem onClick={handleDashboard} sx={{ color: '#ccc' }}>
          <DashboardIcon sx={{ mr: 1, fontSize: 18, color: '#666' }} />
          Dashboard
        </MenuItem>

        {/* Profile Option */}
        {onProfileClick && (
          <MenuItem onClick={onProfileClick} sx={{ color: '#ccc' }}>
            <PersonIcon sx={{ mr: 1, fontSize: 18, color: '#666' }} />
            Profile
          </MenuItem>
        )}

        {/* Settings Option */}
        {onSettingsClick && (
          <MenuItem onClick={onSettingsClick} sx={{ color: '#ccc' }}>
            <SettingsIcon sx={{ mr: 1, fontSize: 18, color: '#666' }} />
            Settings
          </MenuItem>
        )}

        <ListDivider sx={{ my: 0.5 }} />

        {/* Sign Out */}
        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: '#FF1744',
            '&:hover': {
              bgcolor: 'rgba(255, 23, 68, 0.1)',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
          Sign Out
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
