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
  logo: string;
  maxLeverage: string;
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
    sources: ['https://www.fpmarkets.com/forex-spreads/'],
    logo: 'https://brokerchooser.com/storage/2499/fp-markets-review.png',
    maxLeverage: '1:500'
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
    sources: ['https://brokerchooser.com/...'],
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPB42vKLYegAXxmks6FqD_T9Do7Oduo9E4cw&s',
    maxLeverage: '1:400'
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
    sources: ['https://www.ig.com/...'],
    logo: 'https://brokerchooser.com/storage/2513/ig-review.png',
    maxLeverage: '1:200'
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
    sources: ['https://www.xm.com/...'],
    logo: 'https://cdn-1.webcatalog.io/catalog/xm/xm-icon-filled-256.png?v=1714779653506',
    maxLeverage: '1:1000'
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
    sources: ['https://www.icmarkets.com/...'],
    logo: 'https://yt3.googleusercontent.com/ev9ErfMxixhnw6cuhoBKSYKIyF-I2JIwTjsFhWUWT03i7hmGSJm3zJw0tVLkFo026b3VANUD=s900-c-k-c0x00ffffff-no-rj',
    maxLeverage: '1:500'
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
    sources: ['https://www.avatrade.com/...'],
    logo: 'https://yt3.googleusercontent.com/JgXtM0EWTKMaxx_vtoO-rzcDxtlzbpMzLzWrofuiFTZCF9OpoUz5ODO3JQxTLct-0w4I7vyIPQ=s900-c-k-c0x00ffffff-no-rj',
    maxLeverage: '1:400'
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
    sources: ['https://www.startrader.com/...'],
    logo: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/64f07c73d79983d2c4f69d14/0x0.png',
    maxLeverage: '1:500'
  },
  { 
    name: 'RS Finance', 
    tier: 'Unregulated', 
    regulation: [], 
    avgSpread: 0.8, 
    platforms: ['RS Trade Web'], 
    minDeposit: 100, 
    execution: 'ECN', 
    promotion: 'Free challenge account', 
    sources: [],
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKY0m8gYlDnOFL0wpr6-8PKdUJGt_QXY_bA&s',
    maxLeverage: '1:500'
  },
  { 
    name: 'AIMS', 
    tier: '3', 
    regulation: ['FSA Seychelles'], 
    avgSpread: 1.4, 
    platforms: ['MT4'], 
    minDeposit: 100, 
    execution: 'STP', 
    promotion: 'Rebate $5/lot', 
    sources: [],
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEERZAf_n3TQMnI0zN7frt32flSBjhw6X4Tw&s',
    maxLeverage: '1:500'
  },
  { 
    name: 'Trade Nation', 
    tier: '1', 
    regulation: ['FCA', 'ASIC'], 
    avgSpread: 0.8, 
    platforms: ['Trade Nation Web', 'MT4'], 
    minDeposit: 0, 
    execution: 'MM', 
    promotion: 'Fixed spread model', 
    sources: [],
    logo: 'https://play-lh.googleusercontent.com/tMUkez_SBwjBJve6iNZA_X6lVw0TI88chxP97Ms407NxueP8Xs7dG8YR4DMHWv0zt8E',
    maxLeverage: '1:500'
  }
];
