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
  danger: '#FF1744',
};

function TermsOfService() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms of Service - TradeCouncil</title>
        <meta name="description" content="TradeCouncil Terms of Service - Rules and guidelines for using our platform." />
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
            Terms of Service
          </Typography>

          <Typography sx={{ color: '#666', mb: 6 }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          {/* Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Acceptance */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                01. Acceptance of Terms
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                By accessing or using TradeCouncil (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated &quot;Last updated&quot; date.
              </Typography>
            </section>

            {/* Disclaimer */}
            <section>
              <Typography sx={{ color: cssVars.danger, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                02. Important Disclaimer
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 2, fontSize: '1.2rem' }}>
                NOT FINANCIAL OR INVESTMENT ADVICE
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                TradeCouncil is an AI-powered <strong>decision-support tool</strong>, not a financial advisory service. The analysis provided by our AI models is for informational purposes only and does not constitute financial, investment, trading, or any other form of advice.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                You acknowledge that:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>AI models can be wrong, biased, or incomplete</li>
                <li>Market conditions change rapidly and unpredictably</li>
                <li>Trading carries significant risk, including the risk of total loss</li>
                <li>You are solely responsible for your trading decisions</li>
                <li>Past performance does not guarantee future results</li>
              </Box>
              <Typography sx={{ color: cssVars.danger, fontWeight: 600, fontSize: '1.1rem' }}>
                NEVER TRADE WITH MONEY YOU CANNOT AFFORD TO LOSE.
              </Typography>
            </section>

            {/* Service Description */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                03. Service Description
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                TradeCouncil provides AI-powered trading analysis through multiple AI models working in consensus. Our Service includes:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>Multi-model AI analysis (GPT-4o, Claude 3.5, Gemini Pro, DeepSeek, and others)</li>
                <li>Chart and document analysis through vision capabilities</li>
                <li>Strategy presets and customizable analysis parameters</li>
                <li>Chat history and organization tools</li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
              </Typography>
            </section>

            {/* User Responsibilities */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                04. User Responsibilities
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                As a condition of using the Service, you agree to:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to circumvent usage limits or credit systems</li>
                <li>Not share your account credentials with others</li>
                <li>Not reverse-engineer or attempt to extract our AI models</li>
                <li>Not use automated scripts to abuse the Service</li>
                <li>Take full responsibility for your trading decisions</li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We reserve the right to suspend or terminate accounts that violate these terms.
              </Typography>
            </section>

            {/* Subscription & Payments */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                05. Subscription &amp; Payments
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Subscription Tiers</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                We offer three subscription tiers:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li><strong>OBSERVER (Free):</strong> Access to free models, 3 analyses/day</li>
                <li><strong>TRADER ($39/month):</strong> 500 credits/month, access to mainstream models</li>
                <li><strong>ARCHITECT ($99/month):</strong> 1,500 credits/month, access to all models including premium</li>
              </Box>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Billing</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                Paid subscriptions are billed monthly or yearly through Stripe. You authorize us to charge your payment method for the selected subscription period. Subscriptions automatically renew unless cancelled.
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Refunds</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                Due to the nature of AI service costs (incurred per analysis), we do not offer refunds for unused credits or partial months. You may cancel your subscription at any time, and you will retain access until the end of your current billing period.
              </Typography>

              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>Price Changes</Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                We may change our pricing at any time with 30 days notice to existing subscribers. You will have the opportunity to cancel before the price change takes effect.
              </Typography>
            </section>

            {/* Credit System */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                06. Credit System
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                Credits are consumed when you use AI models. Credit costs vary by model:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li><strong>Free models:</strong> 1 credit per analysis</li>
                <li><strong>Mainstream models:</strong> 5-10 credits per analysis</li>
                <li><strong>Premium models:</strong> 20-50 credits per analysis</li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                Add-on credits can be purchased and never expire. Subscription credits reset each billing period.
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.9rem', fontFamily: '"Courier New", monospace' }}>
                // Credits are non-transferable and have no cash value.
              </Typography>
            </section>

            {/* Intellectual Property */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                07. Intellectual Property
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                TradeCouncil and its original content, features, and functionality are owned by TradeCouncil and are protected by international copyright, trademark, and other intellectual property laws.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                You retain ownership of:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>Your chat conversations and analysis results</li>
                <li>Any custom strategies you create</li>
                <li>Your uploaded documents and charts</li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                You grant us a license to use your data solely to provide the Service to you. We do not claim ownership of your content.
              </Typography>
            </section>

            {/* Termination */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                08. Termination
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                You may terminate your account at any time by contacting <Link href="mailto:support@tradecouncil.app" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>support@tradecouncil.app</Link>.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                We may suspend or terminate your account if:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>You violate these Terms</li>
                <li>You abuse the Service or credit system</li>
                <li>You engage in fraudulent activity</li>
                <li>We discontinue the Service</li>
              </Box>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                Upon termination, your right to use the Service ceases immediately. We will delete your account data within 30 days of termination.
              </Typography>
            </section>

            {/* Limitation of Liability */}
            <section>
              <Typography sx={{ color: cssVars.danger, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                09. Limitation of Liability
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 3 }}>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </Typography>
              <Box component="ul" sx={{ color: '#bbb', ml: 4, mb: 3, lineHeight: 1.8 }}>
                <li>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND</li>
                <li>WE ARE NOT LIABLE FOR TRADING LOSSES RESULTING FROM USE OF THE SERVICE</li>
                <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE PAST 12 MONTHS</li>
                <li>WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.9rem', fontFamily: '"Courier New", monospace' }}>
                // USE AT YOUR OWN RISK. YOU BEAR ALL RESPONSIBILITY FOR YOUR TRADING DECISIONS.
              </Typography>
            </section>

            {/* Dispute Resolution */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                10. Dispute Resolution
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                Any disputes arising from these Terms shall be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                You waive any right to a jury trial or to participate in a class action lawsuit.
              </Typography>
            </section>

            {/* Governing Law */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                11. Governing Law
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8 }}>
                These Terms are governed by the laws of the jurisdiction in which TradeCouncil is established. Any legal action must be filed in that jurisdiction.
              </Typography>
            </section>

            {/* Contact */}
            <section>
              <Typography sx={{ color: cssVars.accent, fontFamily: '"Courier New", monospace', mb: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                12. Contact Us
              </Typography>
              <Typography sx={{ color: '#bbb', lineHeight: 1.8, mb: 2 }}>
                For questions about these Terms, please contact us:
              </Typography>
              <Box sx={{ fontFamily: '"Courier New", monospace", color: '#888', mt: 2 }}>
                Email: <Link href="mailto:support@tradecouncil.app" sx={{ color: cssVars.accent, '&:hover': { textDecoration: 'underline' } }}>support@tradecouncil.app</Link>
              </Box>
            </section>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default TermsOfService;
