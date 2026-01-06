'use client';

import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { Box, Button, Typography, CircularProgress, Table, Chip, Skeleton } from '@mui/joy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { apiAsyncNode } from '~/common/util/trpc.client';
import type { UserCreditBalance } from '~/server/credits';

// CSS Variables - cyber-noir design
const cssVars = {
  bgDeep: '#0a0a0a',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  textDim: '#666',
  primary: '#ffffff',
  accent: '#00E676',
  warning: '#FFC107',
};

// Tier colors
const tierColors: Record<string, string> = {
  OBSERVER: '#888',
  TRADER: cssVars.accent,
  ARCHITECT: cssVars.warning,
  ARCHITECT_PRO: '#FF6B35',
};

interface UsageHistoryItem {
  id: string;
  analysisType: string;
  modelsUsed: string[];
  modelCount: number;
  strategyId?: string;
  creditsCost: number;
  creditSource: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

function CreditCard({ balance, tier, isLoading }: {
  balance: UserCreditBalance | null;
  tier: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Box sx={{
        background: '#111',
        border: '1px solid #333',
        p: 4,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gap: 3,
      }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i}>
            <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={60} height={40} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!balance) {
    return (
      <Box sx={{
        background: '#111',
        border: '1px solid #333',
        p: 4,
        textAlign: 'center',
      }}>
        <Typography sx={{ color: '#666' }}>
          Credit information unavailable. Please try again later.
        </Typography>
      </Box>
    );
  }

  const totalCredits = balance.subscriptionRemaining + balance.addonBalance;
  const usagePercent = balance.subscriptionAllowance > 0
    ? Math.round((balance.subscriptionUsed / balance.subscriptionAllowance) * 100)
    : 0;

  return (
    <Box sx={{
      background: 'linear-gradient(180deg, rgba(0, 230, 118, 0.05) 0%, #111 40%)',
      border: `1px solid ${tierColors[tier] || '#333'}`,
      p: 4,
    }}>
      {/* Main Stats Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: { xs: 3, md: 4 },
        mb: 3,
      }}>
        {/* Available Credits */}
        <Box>
          <Typography sx={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', mb: 1 }}>
            AVAILABLE CREDITS
          </Typography>
          <Typography sx={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: cssVars.accent,
            lineHeight: 1,
          }}>
            {totalCredits}
          </Typography>
        </Box>

        {/* Subscription Credits */}
        <Box>
          <Typography sx={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', mb: 1 }}>
            SUBSCRIPTION
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
            {balance.subscriptionRemaining}
            <Box component="span" sx={{ color: '#444', fontSize: '0.9rem' }}>
              /{balance.subscriptionAllowance}
            </Box>
          </Typography>
          <Box sx={{
            mt: 1,
            height: 4,
            background: '#222',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <Box sx={{
              height: '100%',
              width: `${100 - usagePercent}%`,
              background: usagePercent > 80 ? '#FF6B35' : cssVars.accent,
              transition: 'width 0.3s',
            }} />
          </Box>
        </Box>

        {/* Add-on Credits */}
        <Box>
          <Typography sx={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', mb: 1 }}>
            ADD-ON CREDITS
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
            {balance.addonBalance}
          </Typography>
          <Typography sx={{ color: '#444', fontSize: '0.75rem', mt: 1 }}>
            Never expire
          </Typography>
        </Box>

        {/* Reset Date */}
        <Box>
          <Typography sx={{ color: '#666', fontSize: '0.75rem', letterSpacing: '1px', mb: 1 }}>
            RESETS ON
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#fff' }}>
            {new Date(balance.subscriptionResetAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
          <Typography sx={{ color: '#444', fontSize: '0.75rem', mt: 1 }}>
            {Math.ceil((new Date(balance.subscriptionResetAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
          </Typography>
        </Box>
      </Box>

      {/* Observer-specific info */}
      {tier === 'OBSERVER' && (
        <Box sx={{
          display: 'flex',
          gap: 4,
          pt: 3,
          borderTop: '1px solid #222',
        }}>
          <Box>
            <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
              FREE DAILY: {balance.freeDailyCount}/{balance.freeDailyLimit} used
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
              PREMIUM TRIALS: {balance.premiumTrialCount}/{balance.premiumTrialLimit} used
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function UsageHistory({ history, isLoading }: {
  history: UsageHistoryItem[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Box sx={{ background: '#111', border: '1px solid #333', p: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ py: 2, borderBottom: '1px solid #1a1a1a' }}>
            <Skeleton variant="text" width="100%" height={24} />
          </Box>
        ))}
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box sx={{
        background: '#111',
        border: '1px solid #333',
        p: 4,
        textAlign: 'center',
      }}>
        <Typography sx={{ color: '#666' }}>
          No analysis history yet. Start a chat to see your usage here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      background: '#111',
      border: '1px solid #333',
      overflow: 'hidden',
    }}>
      <Table sx={{
        '--TableCell-headBackground': '#0a0a0a',
        '--TableCell-paddingY': '12px',
        '--TableCell-paddingX': '16px',
        '& th': { color: '#666', fontSize: '0.75rem', letterSpacing: '1px' },
        '& td': { color: '#ccc', fontSize: '0.85rem', borderBottom: '1px solid #1a1a1a' },
      }}>
        <thead>
          <tr>
            <th>DATE</th>
            <th>TYPE</th>
            <th>MODELS</th>
            <th style={{ textAlign: 'right' }}>CREDITS</th>
            <th style={{ textAlign: 'center' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td style={{ textTransform: 'capitalize' }}>{item.analysisType}</td>
              <td>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {item.modelsUsed.slice(0, 2).map((model, idx) => (
                    <Chip
                      key={idx}
                      size="sm"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        borderColor: '#333',
                        color: '#888',
                      }}
                    >
                      {model.split('/').pop()?.split(':')[0] || model}
                    </Chip>
                  ))}
                  {item.modelsUsed.length > 2 && (
                    <Chip
                      size="sm"
                      variant="soft"
                      sx={{ fontSize: '0.7rem', background: '#222', color: '#666' }}
                    >
                      +{item.modelsUsed.length - 2}
                    </Chip>
                  )}
                </Box>
              </td>
              <td style={{ textAlign: 'right' }}>
                <Typography sx={{
                  color: item.creditsCost === 0 ? '#666' : cssVars.accent,
                  fontFamily: '"Courier New", monospace',
                }}>
                  {item.creditsCost === 0 ? 'FREE' : `-${item.creditsCost}`}
                </Typography>
              </td>
              <td style={{ textAlign: 'center' }}>
                <Chip
                  size="sm"
                  variant="soft"
                  sx={{
                    fontSize: '0.7rem',
                    background: item.status === 'completed' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                    color: item.status === 'completed' ? cssVars.accent : '#FF1744',
                  }}
                >
                  {item.status}
                </Chip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [balance, setBalance] = React.useState<UserCreditBalance | null>(null);
  const [history, setHistory] = React.useState<UsageHistoryItem[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = React.useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);

  const user = session?.user as any;
  const tier = user?.tier || 'OBSERVER';

  // Fetch data on mount
  React.useEffect(() => {
    if (authStatus === 'authenticated') {
      // Fetch balance
      apiAsyncNode.credits.getBalance.query()
        .then((data) => {
          setBalance(data);
          setIsLoadingBalance(false);
        })
        .catch((err) => {
          console.error('Failed to fetch balance:', err);
          setIsLoadingBalance(false);
        });

      // Fetch history
      apiAsyncNode.credits.getUsageHistory.query({ limit: 20 })
        .then((data) => {
          setHistory(data.items as UsageHistoryItem[]);
          setIsLoadingHistory(false);
        })
        .catch((err) => {
          console.error('Failed to fetch history:', err);
          setIsLoadingHistory(false);
        });
    }
  }, [authStatus]);

  // Redirect if not authenticated
  if (authStatus === 'loading') {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: cssVars.bgDeep,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress
          sx={{
            '--CircularProgress-trackColor': '#333',
            '--CircularProgress-progressColor': cssVars.accent,
          }}
        />
      </Box>
    );
  }

  if (authStatus === 'unauthenticated') {
    router.push('/pricing');
    return null;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: cssVars.bgDeep,
      color: cssVars.primary,
    }}>
      {/* Header */}
      <Box sx={{
        pt: { xs: 4, md: 6 },
        pb: { xs: 3, md: 4 },
        px: 3,
        maxWidth: 1200,
        mx: 'auto',
      }}>
        {/* Navigation */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}>
          <Button
            variant="plain"
            onClick={() => router.push('/chat')}
            sx={{ color: '#666', '&:hover': { color: '#fff' } }}
          >
            &larr; Back to Chat
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/pricing')}
            sx={{
              borderColor: tierColors[tier] || '#333',
              color: tierColors[tier] || '#fff',
              '&:hover': {
                borderColor: '#fff',
                background: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            {tier === 'OBSERVER' ? 'Upgrade Plan' : 'Manage Plan'}
          </Button>
        </Box>

        {/* User Info */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}>
          {user?.image ? (
            <Box
              component="img"
              src={user.image}
              alt={user.name || 'User'}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${tierColors[tier] || '#333'}`,
              }}
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 48, color: '#444' }} />
          )}
          <Box>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
              {user?.name || 'User'}
            </Typography>
            <Chip
              size="sm"
              sx={{
                background: 'transparent',
                border: `1px solid ${tierColors[tier] || '#333'}`,
                color: tierColors[tier] || '#888',
                fontSize: '0.7rem',
                letterSpacing: '2px',
              }}
            >
              {tier}
            </Chip>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 3, pb: 6, maxWidth: 1200, mx: 'auto' }}>
        {/* Credits Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BoltIcon sx={{ color: cssVars.accent }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>Credits Balance</Typography>
          </Box>
          <CreditCard balance={balance} tier={tier} isLoading={isLoadingBalance} />
        </Box>

        {/* Quick Actions */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 4,
        }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/chat')}
            sx={{
              py: 2,
              borderColor: '#333',
              color: '#ccc',
              justifyContent: 'flex-start',
              gap: 1,
              '&:hover': { borderColor: cssVars.accent, color: cssVars.accent },
            }}
          >
            <TrendingUpIcon /> New Analysis
          </Button>
          {(tier === 'TRADER' || tier === 'ARCHITECT' || tier === 'ARCHITECT_PRO') && (
            <Button
              variant="outlined"
              onClick={() => router.push('/pricing#addons')}
              sx={{
                py: 2,
                borderColor: '#333',
                color: '#ccc',
                justifyContent: 'flex-start',
                gap: 1,
                '&:hover': { borderColor: cssVars.accent, color: cssVars.accent },
              }}
            >
              <BoltIcon /> Buy Credits
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => router.push('/pricing')}
            sx={{
              py: 2,
              borderColor: '#333',
              color: '#ccc',
              justifyContent: 'flex-start',
              gap: 1,
              '&:hover': { borderColor: cssVars.accent, color: cssVars.accent },
            }}
          >
            <AccountCircleIcon /> {tier === 'OBSERVER' ? 'Upgrade' : 'Plans'}
          </Button>
        </Box>

        {/* Usage History */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <HistoryIcon sx={{ color: '#666' }} />
            <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>Recent Usage</Typography>
          </Box>
          <UsageHistory history={history} isLoading={isLoadingHistory} />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        py: 3,
        textAlign: 'center',
        borderTop: '1px solid #1a1a1a',
      }}>
        <Typography sx={{ color: '#444', fontSize: '0.8rem' }}>
          Questions about your credits? Contact support@tradecouncil.ai
        </Typography>
      </Box>
    </Box>
  );
}
