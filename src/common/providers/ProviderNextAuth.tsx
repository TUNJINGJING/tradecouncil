'use client';

import * as React from 'react';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

/**
 * NextAuth SessionProvider wrapper
 * Provides authentication state to the entire application
 */
export function ProviderNextAuth({ children }: Props) {
  return (
    <SessionProvider
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetch when window is focused
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
