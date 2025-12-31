'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/joy';

import { AuthLoginButton } from './AuthLoginButton';
import { AuthUserMenu } from './AuthUserMenu';

interface AuthStatusProps {
  /** Callback when settings is clicked */
  onSettingsClick?: () => void;
  /** Size variant for login button */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Displays authentication status - login button when unauthenticated,
 * user menu when authenticated.
 */
export function AuthStatus({ onSettingsClick, size = 'md' }: AuthStatusProps) {
  const { status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
      <CircularProgress
        size="sm"
        sx={{
          '--CircularProgress-trackColor': '#333',
          '--CircularProgress-progressColor': '#00E676',
        }}
      />
    );
  }

  // Authenticated - show user menu
  if (status === 'authenticated') {
    return <AuthUserMenu onSettingsClick={onSettingsClick} />;
  }

  // Unauthenticated - show login button
  return <AuthLoginButton size={size} />;
}
