import * as React from 'react';
import { useRouter } from 'next/router';

import { Box, Button, Typography } from '@mui/joy';
import { keyframes } from '@emotion/react';

// CSS Variables matching DESIGN.md
const cssVars = {
  bgDeep: '#0a0a0a',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  textDim: '#666',
  primary: '#ffffff',
  accent: '#00E676',
  danger: '#FF1744',
};

// Keyframes
const scanAnimation = keyframes`
  0% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const tickerAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Noise texture SVG
const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;


// ============================================
// NAVBAR
// ============================================
function Navbar() {
  const router = useRouter();

  return (
    <Box component="nav" sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr auto', md: '200px 1fr 200px' },
      alignItems: 'center',
      padding: { xs: '12px 20px', md: '15px 40px' },
      position: 'fixed',
      top: { xs: '10px', md: '20px' },
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      maxWidth: '1600px',
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${cssVars.glassBorder}`,
      borderRadius: '100px',
      zIndex: 1000,
    }}>
      {/* Logo */}
      <Box sx={{
        fontWeight: 900,
        letterSpacing: '-1px',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: cssVars.primary,
      }}>
        <Box component="span" sx={{
          width: '10px',
          height: '10px',
          background: cssVars.accent,
          borderRadius: '50%',
          boxShadow: `0 0 10px ${cssVars.accent}`,
        }} />
        TRADE COUNCIL
      </Box>

      {/* Nav Center - Hidden on mobile */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        gap: '40px',
      }}>
        {['ENGINE', 'FEATURES', 'PRICING', 'FAQ'].map((item) => (
          <Box
            key={item}
            component="a"
            href={item === 'PRICING' ? '/pricing' : `#${item.toLowerCase()}`}
            sx={{
              color: '#888',
              fontSize: '0.9rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textDecoration: 'none',
              transition: '0.3s',
              '&:hover': {
                color: '#fff',
                textShadow: '0 0 10px rgba(255,255,255,0.5)',
              },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>

      {/* Nav Right */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '20px',
      }}>
        <Button
          onClick={() => router.push('/chat')}
          sx={{
            background: '#fff',
            color: '#000',
            padding: '8px 20px',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
            '&:hover': {
              background: cssVars.accent,
              boxShadow: `0 0 15px ${cssVars.accent}`,
            },
          }}
        >
          LAUNCH APP
        </Button>
      </Box>
    </Box>
  );
}


// ============================================
// HERO
// ============================================
function HeroSection() {
  const router = useRouter();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      paddingTop: '100px',
      px: 2,
    }}>
      {/* Spotlight */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Main Headline */}
      <Typography
        component="h1"
        sx={{
          fontSize: 'clamp(3rem, 5.5vw, 6rem)',
          lineHeight: 0.9,
          fontWeight: 800,
          letterSpacing: '-3px',
          background: 'linear-gradient(180deg, #fff 0%, #666 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: '20px',
          position: 'relative',
          zIndex: 2,
          textTransform: 'uppercase',
        }}
      >
        Don&apos;t Trust a<br />Single AI.
      </Typography>

      {/* Subheadline */}
      <Typography sx={{
        fontSize: '1.5rem',
        color: '#fff',
        fontWeight: 300,
        mb: '20px',
      }}>
        Let the Trade Council Decide.
      </Typography>

      {/* Description */}
      <Typography sx={{
        color: '#888',
        fontSize: { xs: '1rem', md: '1.25rem' },
        maxWidth: '800px',
        mx: 'auto',
        mb: '50px',
        lineHeight: 1.6,
      }}>
        Upload any chart, earnings report, or news snippet. Instantly get a consensus analysis from GPT-4o, Claude 3.5, Gemini Pro, and DeepSeek — identifying risks and opportunities you might miss.
      </Typography>

      {/* Vault Interface */}
      <Box sx={{
        width: '100%',
        maxWidth: '700px',
        aspectRatio: '16/9',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${cssVars.glassBorder}`,
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        mb: '30px',
        '&:hover': {
          transform: 'scale(1.02)',
          borderColor: 'rgba(255,255,255,0.2)',
        },
      }}>
        {/* Scan Line */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #fff, transparent)',
          opacity: 0,
          animation: `${scanAnimation} 3s infinite ease-in-out`,
        }} />

        <Button
          onClick={() => router.push('/chat')}
          sx={{
            background: '#fff',
            color: '#000',
            padding: '15px 40px',
            borderRadius: '50px',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(255,255,255,0.2)',
            transition: '0.3s',
            zIndex: 5,
            fontSize: '1.1rem',
            '&:hover': {
              background: '#ccc',
              boxShadow: '0 0 40px rgba(255,255,255,0.4)',
            },
          }}
        >
          ANALYZE MY TRADE NOW
        </Button>

        <Typography sx={{
          mt: '20px',
          fontSize: '0.8rem',
          color: '#555',
        }}>
          Drag & Drop Chart Image or Paste Text
        </Typography>
      </Box>

      {/* Social Proof */}
      <Typography sx={{
        fontFamily: '"Courier New", monospace',
        fontSize: '0.75rem',
        color: '#444',
        letterSpacing: '1px',
        mt: '20px',
        textTransform: 'uppercase',
      }}>
        Powered by the world&apos;s best intelligence: OpenAI // Anthropic // Google DeepMind
      </Typography>
    </Box>
  );
}


// ============================================
// PROTOCOL (HOW TO WORK)
// ============================================
function ProtocolSection() {
  const steps = [
    {
      num: '01',
      title: 'Ingest',
      desc: 'Upload chart screenshots, paste earnings calls, or link news. Our system vectorizes the data for multi-modal analysis.',
    },
    {
      num: '02',
      title: 'Debate',
      desc: 'Selected AI models analyze data independently. We enable "Adversarial Mode" where they challenge each other\'s conclusions.',
    },
    {
      num: '03',
      title: 'Execute',
      desc: 'Receive a finalized "Trade Council Report" with actionable probabilities, entry points, and risk invalidation levels.',
    },
  ];

  return (
    <Box sx={{
      padding: '80px 0',
      borderTop: '1px solid #111',
      borderBottom: '1px solid #111',
      background: '#0e0e0e',
    }}>
      <Typography sx={{
        textAlign: 'center',
        mb: '40px',
        color: '#444',
        fontFamily: '"Courier New", monospace',
        letterSpacing: '2px',
      }}>
        HOW TO WORK
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: '1px',
        maxWidth: '1400px',
        mx: 'auto',
        width: '90%',
        background: '#222',
        border: '1px solid #222',
      }}>
        {steps.map((step) => (
          <Box key={step.num} sx={{
            background: '#0a0a0a',
            padding: '40px',
            position: 'relative',
          }}>
            <Typography sx={{
              fontFamily: '"Courier New", monospace',
              color: cssVars.accent,
              mb: '15px',
              display: 'block',
              fontSize: '0.8rem',
            }}>
              STEP {step.num}
            </Typography>
            <Typography component="h3" sx={{
              fontSize: '1.5rem',
              mb: '10px',
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
              {step.title}
            </Typography>
            <Typography sx={{
              color: '#666',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}>
              {step.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


// ============================================
// ENGINE (BEAM)
// ============================================
function EngineSection() {
  return (
    <Box
      id="engine"
      sx={{
        padding: { xs: '80px 20px', md: '150px 0' },
        maxWidth: '1400px',
        width: '90%',
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
        gap: { xs: '40px', md: '80px' },
        alignItems: 'center',
      }}
    >
      {/* Beam Visual Container */}
      <Box sx={{
        background: '#0e0e0e',
        border: '1px solid #222',
        borderRadius: '12px',
        aspectRatio: '16/10',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.5)',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <Box sx={{
            height: '40px',
            borderBottom: '1px solid #333',
            background: '#111',
            display: 'flex',
            alignItems: 'center',
            padding: '0 15px',
            gap: '10px',
          }}>
            <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: cssVars.accent, boxShadow: `0 0 10px ${cssVars.accent}` }} />
            <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', background: '#333' }} />
            <Typography sx={{ fontFamily: 'monospace', color: '#444', fontSize: '10px', ml: '10px' }}>
              TRADE_COUNCIL_ACTIVE
            </Typography>
          </Box>

          {/* Split View */}
          <Box sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: '1px',
            background: '#333',
          }}>
            {[
              { model: 'GPT-4o', text: '...Identifying Head & Shoulders pattern on 4H...' },
              { model: 'CLAUDE 3.5', text: '...Volume divergence detected. Risk level elevated...' },
              { model: 'GEMINI PRO', text: '...Correlating with macro news event...' },
            ].map((col) => (
              <Box key={col.model} sx={{
                background: '#050505',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#666',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: cssVars.accent,
                  opacity: 0.5,
                },
              }}>
                [{col.model}]<br />{col.text}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Text Content */}
      <Box>
        <Typography sx={{
          color: cssVars.accent,
          fontFamily: '"Courier New", monospace',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
          mb: '10px',
          display: 'block',
        }}>
          CORE TECHNOLOGY
        </Typography>

        <Typography component="h2" sx={{
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          lineHeight: 1,
          mb: '30px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff 50%, #666 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The Consensus<br />Engine.
        </Typography>

        <Box sx={{
          borderLeft: '2px solid #333',
          paddingLeft: '30px',
          mb: '30px',
        }}>
          <Typography sx={{ fontSize: '1.2rem', color: '#bbb', lineHeight: 1.6, mb: '20px' }}>
            Why rely on one analyst when you can have a team? TradeCouncil runs your data through multiple reasoning engines simultaneously.
          </Typography>
          <Typography sx={{ color: '#888', lineHeight: 1.6 }}>
            Disagreement is good. See where the models diverge to understand the volatility; see where they agree to find your conviction.
          </Typography>
        </Box>

        <Box
          component="a"
          href="#features"
          sx={{
            borderBottom: '1px solid #fff',
            paddingBottom: '5px',
            fontSize: '0.9rem',
            color: '#fff',
            textDecoration: 'none',
            '&:hover': { color: cssVars.accent, borderColor: cssVars.accent },
          }}
        >
          See how Trade Council works →
        </Box>
      </Box>
    </Box>
  );
}


// ============================================
// FEATURE SLABS
// ============================================
function FeaturesSection() {
  const features = [
    {
      index: '01 // VISION',
      title: 'Eliminate\nBlind Spots.',
      desc: 'Scanning 100+ technical indicators instantly. Our optical engine sees the chart like a human expert—but with pixel-perfect precision. It identifies hidden divergences and liquidity zones you missed.',
      visual: 'UI: CHART PATTERN RECOGNITION',
    },
    {
      index: '02 // DISCIPLINE',
      title: 'Emotional\nDiscipline.',
      desc: 'Pure logic. Zero FOMO. Enable "Adversarial Mode" where a dedicated AI agent acts as the Risk Manager, actively trying to debunk your trade thesis to save your capital.',
      visual: 'UI: SPLIT-SCREEN DEBATE',
    },
  ];

  return (
    <Box
      id="features"
      sx={{
        padding: '100px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '150px',
        mb: 0,
      }}
    >
      {features.map((feature) => (
        <Box
          key={feature.index}
          sx={{
            width: '85%',
            maxWidth: '1400px',
            background: '#111',
            border: '1px solid #222',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              borderColor: '#333',
            },
          }}
        >
          {/* Corner Deco */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.05) 50%)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }} />

          {/* Content */}
          <Box sx={{ padding: { xs: '40px 30px', md: '80px 60px' }, position: 'relative', zIndex: 2 }}>
            <Typography sx={{
              fontFamily: '"Courier New", monospace',
              fontSize: '14px',
              color: cssVars.accent,
              border: `1px solid ${cssVars.accent}`,
              padding: '4px 8px',
              display: 'inline-block',
              mb: '30px',
              letterSpacing: '2px',
            }}>
              {feature.index}
            </Typography>

            <Typography sx={{
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              fontWeight: 800,
              lineHeight: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              mb: '30px',
              background: 'linear-gradient(135deg, #fff 50%, #444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'pre-line',
            }}>
              {feature.title}
            </Typography>

            <Typography sx={{
              fontSize: '1.2rem',
              color: '#888',
              maxWidth: '600px',
              lineHeight: 1.6,
              mt: '10px',
              borderLeft: '2px solid #333',
              paddingLeft: '20px',
            }}>
              {feature.desc}
            </Typography>
          </Box>

          {/* Visual */}
          <Box sx={{
            width: '100%',
            height: { xs: '300px', md: '500px' },
            background: '#0e0e0e',
            borderTop: '1px solid #222',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}>
            <Typography sx={{
              fontFamily: 'monospace',
              color: '#333',
              fontSize: '1.5rem',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              border: '1px dashed #333',
              padding: '20px 40px',
            }}>
              {feature.visual}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}


// ============================================
// PRIVACY SECTION
// ============================================
function PrivacySection() {
  return (
    <Box sx={{
      padding: 0,
      borderTop: '1px solid #222',
      borderBottom: '1px solid #222',
      background: '#080808',
      mt: '50px',
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%',
      }}>
        {/* Visual */}
        <Box sx={{
          padding: { xs: '60px', md: '100px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          borderRight: { xs: 'none', md: '1px solid #222' },
          borderBottom: { xs: '1px solid #222', md: 'none' },
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(#222 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          },
        }}>
          {/* Lock Art */}
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '50px',
              border: '2px solid #666',
              borderBottom: 'none',
              borderRadius: '50px 50px 0 0',
            }} />
            <Box sx={{
              width: '80px',
              height: '100px',
              border: '2px solid #fff',
              borderRadius: '10px',
              position: 'relative',
            }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '10px',
                height: '10px',
                background: '#fff',
                borderRadius: '50%',
              }} />
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                width: '2px',
                height: '20px',
                background: '#fff',
              }} />
            </Box>
          </Box>
          <Typography sx={{
            mt: '40px',
            fontFamily: '"Courier New", monospace',
            color: '#444',
            zIndex: 2,
          }}>
            {'// SECURE_ENCLAVE_ACTIVE'}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{
          padding: { xs: '60px', md: '100px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Typography sx={{
            fontFamily: '"Courier New", monospace',
            fontSize: '0.9rem',
            color: cssVars.accent,
            mb: '20px',
            letterSpacing: '2px',
          }}>
            PRIVACY MANIFESTO
          </Typography>
          <Typography component="h2" sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 800,
            lineHeight: 1,
            mb: '30px',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            Your Alpha<br />Stays Yours.
          </Typography>
          <Typography sx={{ color: '#666', fontSize: '1rem', lineHeight: 1.6 }}>
            We believe financial data is sacred. TradeCouncil uses ephemeral processing instances. Once the consensus report is generated, the raw data is cryptographically shredded.
            <br /><br />
            <Box component="strong" sx={{ color: '#fff' }}>No Logs. No Training. No Leaks.</Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}


// ============================================
// PRICING SECTION
// ============================================
function PricingSection() {
  const router = useRouter();

  const tiers = [
    {
      name: 'OBSERVER',
      price: '$0',
      tagline: 'Trial & Taste',
      highlight: 'Free models + 3 premium trials/mo',
      accentColor: '#888',
    },
    {
      name: 'TRADER',
      price: '$39',
      tagline: 'Daily Analysis',
      highlight: '500 credits/mo, mainstream models',
      accentColor: cssVars.accent,
      isPopular: true,
    },
    {
      name: 'ARCHITECT',
      price: '$99',
      tagline: 'Expert Consensus',
      highlight: '1500 credits/mo, all top models',
      accentColor: '#FFC107',
    },
  ];

  return (
    <Box id="pricing" sx={{
      padding: { xs: '80px 0', md: '150px 0' },
      background: '#080808',
      borderTop: '1px solid #222',
    }}>
      <Box sx={{ textAlign: 'center', mb: { xs: '40px', md: '80px' }, px: 2 }}>
        <Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: '10px', fontWeight: 200, color: '#fff' }}>
          Access the Vault.
        </Typography>
        <Typography sx={{ color: '#888' }}>One subscription. All major AI models. No API keys needed.</Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: '20px', md: '30px' },
        width: '90%',
        maxWidth: '1000px',
        mx: 'auto',
        mb: 6,
      }}>
        {tiers.map((tier) => (
          <Box
            key={tier.name}
            sx={{
              background: tier.isPopular
                ? 'linear-gradient(180deg, rgba(0, 230, 118, 0.08) 0%, #111 40%)'
                : '#111',
              border: `1px solid ${tier.isPopular ? cssVars.accent : '#333'}`,
              padding: { xs: '30px', md: '40px' },
              position: 'relative',
              textAlign: 'center',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            {tier.isPopular && (
              <Box sx={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#000',
                color: cssVars.accent,
                border: `1px solid ${cssVars.accent}`,
                padding: '4px 12px',
                fontSize: '11px',
                letterSpacing: '2px',
              }}>
                POPULAR
              </Box>
            )}

            <Typography sx={{ color: tier.accentColor, letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 600 }}>
              {tier.name}
            </Typography>
            <Typography sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, fontWeight: 800, my: 2, color: '#fff' }}>
              {tier.price}<Box component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: '#666' }}>/mo</Box>
            </Typography>
            <Typography sx={{ color: '#666', fontSize: '0.85rem', mb: 1 }}>{tier.tagline}</Typography>
            <Typography sx={{ color: '#999', fontSize: '0.8rem', fontFamily: '"Courier New", monospace' }}>
              {tier.highlight}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={() => router.push('/pricing')}
          sx={{
            padding: '16px 48px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.9rem',
            border: `1px solid ${cssVars.accent}`,
            background: cssVars.accent,
            color: '#000',
            fontWeight: 'bold',
            transition: '0.2s',
            '&:hover': {
              background: '#fff',
              color: '#000',
              borderColor: '#fff',
            },
          }}
        >
          View Full Pricing &amp; Features
        </Button>
      </Box>
    </Box>
  );
}


// ============================================
// FAQ SECTION
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I trust the AI\'s prediction?',
      a: 'TradeCouncil is a decision-support tool, not a crystal ball. By aggregating multiple top-tier models, we reduce the hallucination rate significantly compared to using a single AI. We provide the consensus logic, but the final trade decision is always yours.',
    },
    {
      q: 'Do I need to pay for GPT-4 or Claude separately?',
      a: 'No. Your TradeCouncil subscription includes access to all top-tier models (GPT-4o, Claude 3.5, Gemini Pro, etc.) in one simple interface without needing separate API keys.',
    },
    {
      q: 'Is my financial data safe?',
      a: 'Absolutely. We are privacy-first. Your charts and documents are processed in an ephemeral environment and are strictly prohibited from being used to train any AI models.',
    },
    {
      q: 'Is this for crypto or stocks?',
      a: 'Both. The Council is trained to analyze candlestick patterns, technical indicators, and financial news, making it effective for Crypto, Equities, Forex, and Commodities.',
    },
  ];

  return (
    <Box id="faq" sx={{
      padding: '100px 0',
      width: '85%',
      maxWidth: '1000px',
      mx: 'auto',
    }}>
      <Typography component="h2" sx={{
        mb: '60px',
        fontSize: '2rem',
        fontWeight: 300,
        borderLeft: `4px solid ${cssVars.accent}`,
        paddingLeft: '20px',
        color: '#fff',
      }}>
        FAQ
      </Typography>

      {faqs.map((faq, index) => (
        <Box
          key={index}
          sx={{
            borderBottom: '1px solid #222',
            padding: '20px 0',
            cursor: 'pointer',
            transition: 'all 0.3s',
            ...(openIndex === index && {
              background: 'rgba(255,255,255,0.02)',
              padding: '20px',
            }),
          }}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        >
          <Box sx={{
            fontSize: '1.2rem',
            fontWeight: 500,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
          }}>
            {faq.q}
            <Box component="span" sx={{
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              color: openIndex === index ? cssVars.accent : '#666',
            }}>
              {openIndex === index ? '-' : '+'}
            </Box>
          </Box>
          {openIndex === index && (
            <Typography sx={{
              mt: '20px',
              color: '#888',
              lineHeight: 1.6,
              maxWidth: '90%',
            }}>
              {faq.a}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}


// ============================================
// FINAL CTA
// ============================================
function FinalCTASection() {
  const router = useRouter();

  return (
    <Box sx={{
      padding: '120px 0',
      textAlign: 'center',
      background: 'linear-gradient(to top, #000, #0a0a0a)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Typography sx={{
        fontSize: 'clamp(3rem, 8vw, 8rem)',
        fontWeight: 900,
        color: '#1a1a1a',
        WebkitTextStroke: '1px #333',
        mb: '-40px',
        position: 'relative',
        zIndex: 1,
      }}>
        EXECUTE
      </Typography>

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography component="h3" sx={{
          fontSize: '2rem',
          mb: '30px',
          color: '#fff',
        }}>
          Ready to decode the market?
        </Typography>

        <Button
          onClick={() => router.push('/chat')}
          sx={{
            fontSize: '1.5rem',
            padding: '25px 60px',
            background: '#fff',
            color: '#000',
            borderRadius: '100px',
            fontWeight: 900,
            boxShadow: '0 0 40px rgba(255,255,255,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '15px',
            '&:hover': {
              transform: 'scale(1.05)',
              background: cssVars.accent,
            },
          }}
        >
          Start Your Council Session <span style={{ fontSize: '1rem' }}>→</span>
        </Button>
      </Box>
    </Box>
  );
}


// ============================================
// TICKER
// ============================================
function Ticker() {
  const items = [
    { name: 'GPT-4o', status: 'CONNECTED' },
    { name: 'CLAUDE 3.5 SONNET', status: 'CONNECTED' },
    { name: 'GEMINI 1.5 PRO', status: 'CONNECTED' },
    { name: 'DEEPSEEK V3', status: 'CONNECTED' },
    { name: 'SEARCH_WEB', status: 'ACTIVE' },
  ];

  return (
    <Box sx={{
      width: '100%',
      overflow: 'hidden',
      background: '#000',
      borderTop: '1px solid #222',
      borderBottom: '1px solid #222',
      padding: '15px 0',
      display: 'flex',
    }}>
      <Box sx={{
        display: 'flex',
        animation: `${tickerAnimation} 20s linear infinite`,
        whiteSpace: 'nowrap',
      }}>
        {[...items, ...items].map((item, index) => (
          <Box
            key={index}
            sx={{
              padding: '0 40px',
              color: '#444',
              fontSize: '0.8rem',
              fontFamily: '"Courier New", monospace',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Box sx={{
              width: '6px',
              height: '6px',
              background: cssVars.accent,
              borderRadius: '50%',
              boxShadow: `0 0 5px ${cssVars.accent}`,
            }} />
            {item.name} [{item.status}]
          </Box>
        ))}
      </Box>
    </Box>
  );
}


// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <Box component="footer" sx={{
      padding: '100px 0',
      textAlign: 'center',
      borderTop: '1px solid #222',
      background: '#050505',
    }}>
      <Typography sx={{
        mb: '20px',
        fontWeight: 900,
        fontSize: '1.5rem',
        color: '#fff',
      }}>
        TRADE COUNCIL
      </Typography>

      <Typography sx={{
        mb: '40px',
        color: '#888',
        fontSize: '1.1rem',
        maxWidth: '600px',
        mx: 'auto',
        px: 2,
      }}>
        Stop Guessing. Let 5 Top AIs (GPT-4o, Claude 3.5, Gemini Pro) analyze your next trade to identify risks and opportunities you might miss.
      </Typography>

      <Box sx={{ mt: '40px' }}>
        {['Privacy', 'Terms', 'Twitter'].map((link) => (
          <Box
            key={link}
            component="a"
            href="#"
            sx={{
              color: '#666',
              mx: '15px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              '&:hover': { color: '#fff' },
            }}
          >
            {link}
          </Box>
        ))}
      </Box>

      <Typography sx={{
        mt: '20px',
        fontSize: '0.7rem',
        color: '#333',
      }}>
        &copy; 2024 TRADECOUNCIL. NOT FINANCIAL ADVICE.
      </Typography>
    </Box>
  );
}


// ============================================
// MAIN LANDING PAGE
// ============================================
export function LandingPage() {
  return (
    <Box sx={{
      backgroundColor: cssVars.bgDeep,
      backgroundImage: noiseTexture,
      color: cssVars.primary,
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      overflowX: 'hidden',
      minHeight: '100vh',
    }}>
      <Navbar />
      <HeroSection />
      <ProtocolSection />
      <EngineSection />
      <FeaturesSection />
      <PrivacySection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Ticker />
      <Footer />
    </Box>
  );
}
