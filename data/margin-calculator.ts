// Options for the Margin Calculator UI
// Keep this file purely for option lists as requested.

export const CURRENCY_PAIRS = [
  'EURUSD',
  'USDJPY',
  'GBPUSD',
  'AUDUSD',
  'USDCHF',
  'USDCAD',
  'EURJPY',
  'EURGBP',
  'GBPJPY',
] as const;

export const ACCOUNT_CURRENCIES = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CHF', 'CAD'
] as const;

// Shown as labels like "100:1" but map to numeric leverage when used
export const MARGIN_RATIOS = [
  '1:1',
  '5:1',
  '10:1',
  '20:1',
  '30:1',
  '50:1',
  '100:1',
  '200:1',
  '500:1',
] as const;

export type CurrencyPair = typeof CURRENCY_PAIRS[number];
export type AccountCurrency = typeof ACCOUNT_CURRENCIES[number];
export type MarginRatioLabel = typeof MARGIN_RATIOS[number];
