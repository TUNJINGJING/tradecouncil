import * as React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Box, Typography, Link } from '@mui/joy';

// CSS Variables matching DESIGN.md
const cssVars = {
  bgDeep: '#0a0a0a',
  textDim: '#666',
  primary: '#ffffff',
  accent: '#00E676',
};

function PrivacyPolicy() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy - TradeCouncil</title>
        <meta name="description" content="TradeCouncil Privacy Policy - How we collect, use, and protect your data." />
      </Head>

      <Box sx={{
        minHeight: '100vh',
        background: cssVars.bgDeep,
        color: cssVars.primary,
        padding: { xs: '80px 20px', md: '120px 40px' },
      }}>
        {/* Header */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* Back button */}
          <Link
            onClick={() => router.back()}
            sx={{
              color: '#666',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              mb: 4,
              '&:hover': { color: '#fff' },
            }}
          >
            &larr; Back
          </Link>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Privacy Policy
          </Typography>

          <Typography sx={{ color: '#666', mb: 6 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          {/* Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Introduction */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                01. Introduction
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                TradeCouncil (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered trading analysis platform.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                By using TradeCouncil, you agree to the terms of this policy. If you do not agree, please do not use our service.
              </Typography>
            </section>

            {/* Information We Collect */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                02. Information We Collect
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Account Information</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                When you create an account, we collect your email address, name, and profile picture through Google OAuth. We use this information to provide and maintain your account.
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Usage Data</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                We collect information about your use of the service, including:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>Credit consumption and analysis history (without chat content)</li>
                <li>Subscription tier and billing information</li>
                <li>System interactions and feature usage</li>
              </Box>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Analytics Data (Optional)</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We use Google Analytics 4 and Microsoft Clarity to understand how you use our service. You can opt-out of analytics tracking in your browser settings.
              </Typography>
            </section>

            {/* Chat Data Storage */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                03. Chat Data Storage
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1, fontSize: '1.2rem' }}>
                Your Chats Stay in Your Browser
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                TradeCouncil is designed with privacy-first architecture. Your chat conversations are stored <strong>locally in your browser</strong> using IndexedDB and localStorage. We do not store your chat content on our servers.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                This means:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>Your chat content never leaves your browser (except when sent to AI providers for analysis)</li>
                <li>We cannot access, read, or share your chat conversations</li>
                <li>Clearing your browser data will delete your chats</li>
                <li>You can export your chats at any time using the Export feature</li>
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.9rem', fontFamily: '"Courier New", monospace' }}>
                // NO_LOGS: We do not log your chat content for training or any other purpose.
              </Typography>
            </section>

            {/* Third-Party Services */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                04. Third-Party Services
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>AI Providers</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                When you use our analysis features, your input is sent to AI providers (OpenAI, Anthropic, Google, DeepSeek, and others) to generate responses. These providers have their own privacy policies:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li><Link href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>OpenAI Privacy Policy</Link></li>
                <li><Link href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>Anthropic Privacy Policy</Link></li>
                <li><Link href="https://policies.google.com/privacy" target="_blank" rel="noopener" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>Google Privacy Policy</Link></li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                We do not share your data with these providers for training purposes. Data is sent only to fulfill your analysis requests.
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Authentication</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                We use Google OAuth for authentication. Google may share your email address and basic profile information with us.
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Payment Processing</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We use Stripe to process payments. Your payment information is handled directly by Stripe and is never stored on our servers. See the <Link href="https://stripe.com/privacy" target="_blank" rel="noopener" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>Stripe Privacy Policy</Link>.
              </Typography>
            </section>

            {/* Data Security */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                05. Data Security
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                We implement industry-standard security measures to protect your information:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>HTTPS/TLS encryption for all data in transit</li>
                <li>Secure authentication sessions via NextAuth (30-day expiration)</li>
                <li>Supabase for secure server-side data storage</li>
                <li>Regular security audits and updates</li>
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.9rem', fontFamily: '"Courier New", monospace' }}>
                // SECURE_ENCLAVE: Your financial analysis data remains yours.
              </Typography>
            </section>

            {/* Your Rights */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                06. Your Rights
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                You have the following rights regarding your data:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li><strong>Access:</strong> Export your chats at any time using the Export feature</li>
                <li><strong>Delete:</strong> Delete individual chats or clear all data from your browser</li>
                <li><strong>Opt-out:</strong> Disable analytics tracking in your browser settings</li>
                <li><strong>Account Deletion:</strong> Contact us at <Link href="mailto:support@tradecouncil.app" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>support@tradecouncil.app</Link> to delete your account</li>
              </Box>
            </section>

            {/* Children's Privacy */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                07. Children&apos;s Privacy
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </Typography>
            </section>

            {/* Changes to This Policy */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                08. Changes to This Policy
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of the service after changes constitutes acceptance of the new policy.
              </Typography>
            </section>

            {/* Contact Us */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                09. Contact Us
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </Typography>
              <Box sx={{ fontFamily: '"Courier New", monospace', color: '#888', mt: 2 }}>
                Email: <Link href="mailto:support@tradecouncil.app" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>support@tradecouncil.app</Link>
              </Box>
            </section>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default PrivacyPolicy;
