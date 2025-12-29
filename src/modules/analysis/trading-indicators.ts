/**
 * Trading Indicator Extraction Utility
 * Parses AI response text to extract key trading metrics
 */

export interface TradingIndicators {
  signal?: 'BUY' | 'SELL' | 'WAIT' | 'HOLD' | 'LONG' | 'SHORT' | 'NO TRADE';
  entry?: string;
  stopLoss?: string;
  takeProfit?: string;
  riskReward?: string;
  confidence?: 'High' | 'Medium' | 'Low';
  trend?: 'Bullish' | 'Bearish' | 'Neutral' | 'Ranging';
}

/**
 * Extract trading indicators from AI response text
 */
export function extractTradingIndicators(text: string): TradingIndicators | null {
  if (!text || text.length < 50) return null;

  const indicators: TradingIndicators = {};
  const upperText = text.toUpperCase();

  // Extract Signal (BUY/SELL/WAIT/HOLD/LONG/SHORT)
  const signalPatterns = [
    /signal[:\s]*\*?\*?\s*(BUY|SELL|WAIT|HOLD|LONG|SHORT|NO TRADE)/i,
    /recommendation[:\s]*\*?\*?\s*(BUY|SELL|WAIT|HOLD|LONG|SHORT|NO TRADE)/i,
    /\*\*(BUY|SELL|LONG|SHORT)\*\*/i,
    /action[:\s]*\*?\*?\s*(BUY|SELL|WAIT|HOLD|LONG|SHORT)/i,
  ];
  for (const pattern of signalPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.signal = match[1].toUpperCase().trim() as TradingIndicators['signal'];
      break;
    }
  }

  // Extract Entry Price
  const entryPatterns = [
    /entry[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /entry\s*(?:price|zone)?[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /enter\s*(?:at|around)?[:\s]*\$?([\d,]+\.?\d*)/i,
  ];
  for (const pattern of entryPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.entry = match[1].replace(/,/g, '');
      break;
    }
  }

  // Extract Stop Loss
  const slPatterns = [
    /stop\s*loss[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /sl[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /stop[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
  ];
  for (const pattern of slPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.stopLoss = match[1].replace(/,/g, '');
      break;
    }
  }

  // Extract Take Profit (first target)
  const tpPatterns = [
    /take\s*profit[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /tp[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /target\s*1?[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
    /target[:\s]*\*?\*?\s*\$?([\d,]+\.?\d*)/i,
  ];
  for (const pattern of tpPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.takeProfit = match[1].replace(/,/g, '');
      break;
    }
  }

  // Extract Risk/Reward
  const rrPatterns = [
    /risk[\/\s]*reward[:\s]*\*?\*?\s*([\d.]+[:\s]*[\d.]+)/i,
    /r[:\s]*r[:\s]*\*?\*?\s*([\d.]+[:\s]*[\d.]+)/i,
    /r\/r[:\s]*\*?\*?\s*([\d.]+[:\s]*[\d.]+)/i,
  ];
  for (const pattern of rrPatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.riskReward = match[1].replace(/\s/g, '');
      break;
    }
  }

  // Extract Confidence
  const confidencePatterns = [
    /confidence[:\s]*\*?\*?\s*(High|Medium|Low)/i,
    /conviction[:\s]*\*?\*?\s*(High|Medium|Low)/i,
  ];
  for (const pattern of confidencePatterns) {
    const match = text.match(pattern);
    if (match) {
      indicators.confidence = match[1] as TradingIndicators['confidence'];
      break;
    }
  }

  // Extract Trend
  const trendPatterns = [
    /trend[:\s]*\*?\*?\s*(Bullish|Bearish|Neutral|Ranging|Uptrend|Downtrend|Sideways)/i,
    /(?:current|primary)\s*trend[:\s]*\*?\*?\s*(Bullish|Bearish|Neutral|Ranging|Uptrend|Downtrend|Sideways)/i,
  ];
  for (const pattern of trendPatterns) {
    const match = text.match(pattern);
    if (match) {
      const trend = match[1];
      if (trend.toLowerCase() === 'uptrend') indicators.trend = 'Bullish';
      else if (trend.toLowerCase() === 'downtrend') indicators.trend = 'Bearish';
      else if (trend.toLowerCase() === 'sideways') indicators.trend = 'Ranging';
      else indicators.trend = trend as TradingIndicators['trend'];
      break;
    }
  }

  // Only return if we found at least one meaningful indicator
  const hasData = indicators.signal || indicators.entry || indicators.stopLoss ||
                  indicators.takeProfit || indicators.riskReward;

  return hasData ? indicators : null;
}

/**
 * Get signal color based on signal type
 */
export function getSignalColor(signal: TradingIndicators['signal']): 'success' | 'danger' | 'warning' | 'neutral' {
  switch (signal) {
    case 'BUY':
    case 'LONG':
      return 'success';
    case 'SELL':
    case 'SHORT':
      return 'danger';
    case 'WAIT':
    case 'HOLD':
    case 'NO TRADE':
      return 'warning';
    default:
      return 'neutral';
  }
}
