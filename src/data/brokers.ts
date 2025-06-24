export type Broker = {
  name: string;
  tier: '1' | '2' | '3' | 'Unregulated';
  regulation: string[];           // key watchdog codes
  avgSpread: number;              // EUR/USD pips
  platforms: string[];
  minDeposit: number;             // USD
  execution: string;              // ECN, STP, MM
  promotion: string;              // brief text
  sources: string[];              // reference URLs
};

export const brokers: Broker[] = [
  {
    name: 'FP Markets',
    tier: '1',
    regulation: ['ASIC', 'CySEC'],
    avgSpread: 0.3,
    platforms: ['MT4', 'MT5', 'cTrader'],
    minDeposit: 100,
    execution: 'ECN',
    promotion: 'Rebate up to $2/lot',
    sources: ['https://www.fpmarkets.com/forex-spreads/']
  },
  {
    name: 'FXCM',
    tier: '1',
    regulation: ['FCA', 'ASIC'],
    avgSpread: 0.7,
    platforms: ['Trading Station', 'MT4'],
    minDeposit: 50,
    execution: 'STP',
    promotion: 'Referral bonus $25',
    sources: ['https://brokerchooser.com/...']
  },
  {
    name: 'IG',
    tier: '1',
    regulation: ['FCA', 'BaFin', 'ASIC'],
    avgSpread: 0.86,
    platforms: ['MT4', 'ProRealTime', 'IG Web'],
    minDeposit: 0,
    execution: 'Market Maker',
    promotion: 'Zero fees on FX deposits',
    sources: ['https://www.ig.com/...']
  },
  {
    name: 'XM',
    tier: '1',
    regulation: ['CySEC', 'ASIC'],
    avgSpread: 0.3,
    platforms: ['MT4', 'MT5', 'XM App'],
    minDeposit: 5,
    execution: 'STP/ECN',
    promotion: 'No-deposit bonus $30',
    sources: ['https://www.xm.com/...']
  },
  {
    name: 'IC Markets Global',
    tier: '3',
    regulation: ['FSA Seychelles'],
    avgSpread: 0.1,
    platforms: ['MT4', 'MT5', 'cTrader'],
    minDeposit: 200,
    execution: 'ECN',
    promotion: 'Free VPS over 15 lots',
    sources: ['https://www.icmarkets.com/...']
  },
  {
    name: 'AvaTrade',
    tier: '1',
    regulation: ['CBI', 'ASIC', 'JFSA', 'ADGM'],
    avgSpread: 0.9,
    platforms: ['MT4', 'MT5', 'AvaTradeGO'],
    minDeposit: 100,
    execution: 'MM/STP',
    promotion: '20 % deposit bonus',
    sources: ['https://www.avatrade.com/...']
  },
  {
    name: 'STARTRADER',
    tier: '2',
    regulation: ['FSCA'],
    avgSpread: 1.3,
    platforms: ['MT4', 'MT5', 'Mobile'],
    minDeposit: 50,
    execution: 'STP',
    promotion: '100 % credit bonus',
    sources: ['https://www.startrader.com/...']
  },
  { name: 'RS Finance', tier: 'Unregulated', regulation: [], avgSpread: 0.8, platforms: ['RS Trade Web'], minDeposit: 100, execution: 'ECN', promotion: 'Free challenge account', sources: [] },
  { name: 'AIMS', tier: '3', regulation: ['FSA Seychelles'], avgSpread: 1.4, platforms: ['MT4'], minDeposit: 100, execution: 'STP', promotion: 'Rebate $5/lot', sources: [] },
  { name: 'Trade Nation', tier: '1', regulation: ['FCA', 'ASIC'], avgSpread: 0.8, platforms: ['Trade Nation Web', 'MT4'], minDeposit: 0, execution: 'MM', promotion: 'Fixed spread model', sources: [] }
];
