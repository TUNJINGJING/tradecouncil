import type { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { createOrUpdateUser, getUserByEmail } from '~/server/supabase/client';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      tier: 'OBSERVER' | 'TRADER' | 'ARCHITECT' | 'ARCHITECT_PRO';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    tier?: 'OBSERVER' | 'TRADER' | 'ARCHITECT' | 'ARCHITECT_PRO';
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) {
        console.error('Sign in failed: missing account or email');
        return false;
      }

      try {
        // Create or update user in Supabase
        const dbUser = await createOrUpdateUser({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
        });

        if (!dbUser) {
          console.error('Failed to create/update user in database');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // On initial sign in, fetch user data from database
      if (account && user?.email) {
        try {
          const dbUser = await getUserByEmail(user.email);
          if (dbUser) {
            token.userId = dbUser.id;
            token.tier = dbUser.tier;
          }
        } catch (error) {
          console.error('Error fetching user data for JWT:', error);
        }
      }
      return token;
    },

    async session({ session, token }): Promise<Session> {
      // Add user ID and tier to session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.tier = (token.tier as 'OBSERVER' | 'TRADER' | 'ARCHITECT' | 'ARCHITECT_PRO') || 'OBSERVER';
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development',
};
