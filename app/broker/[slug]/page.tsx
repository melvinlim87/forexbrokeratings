import { BrokerProfile } from '@/components/broker/broker-profile';

// Sample data - would come from API in real implementation
const brokerData = {
  id: 1,
  name: 'IronFX',
  logo: 'https://via.placeholder.com/180x90?text=IronFX',
  rating: 4.2,
  minDeposit: 100,
  summary: 'IronFX offers forex and CFD trading on multiple platforms with a wide range of account types to suit different trading styles. They provide access to a good selection of markets with competitive spreads and solid customer support.',
  tradingInfo: {
    spreads: 'From 0.7 pips',
    leverage: 'Up to 1:500',
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'IronFX WebTrader'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'Futures', 'Metals'],
    accountTypes: ['Micro', 'Premium', 'VIP', 'Zero Spread'],
    minTrade: '0.01 lots'
  },
  tradingFeatures: {
    executionSpeed: 'Average 0.128 seconds',
    orderTypes: ['Market', 'Limit', 'Stop', 'OCO', 'Trailing Stop'],
    hedging: true,
    scalping: true,
    expertAdvisors: true,
    api: false,
    demoAccount: true
  },
  scores: {
    overall: 4.2,
    tradingInstruments: 3.4,
    platforms: 4.4,
    fees: 3.8,
    security: 4.4,
    deposit: 3.4,
    customerService: 4.6
  },
  fees: {
    trading: {
      spread: 'Variable, from 0.7 pips',
      commission: 'Varies by account type',
      overnight: 'Varies by instrument'
    },
    nonTrading: {
      deposit: 'Free',
      withdrawal: 'Free (1 per month), $50 after',
      inactivity: '$50 after 6 months',
      account: 'No monthly fees'
    }
  },
  depositWithdrawal: {
    methods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'UnionPay'],
    depositTime: 'Instant (cards & e-wallets), 3-5 days (bank transfer)',
    withdrawalTime: '1-3 business days (e-wallets), 5-7 days (cards & bank)',
    baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD']
  },
  regulation: {
    primary: 'CySEC (Cyprus Securities and Exchange Commission)',
    additional: ['FCA (UK)', 'ASIC (Australia)', 'FSCA (South Africa)'],
    clientFunds: 'Segregated accounts in tier-1 banks',
    negativeBalanceProtection: true,
    investorCompensation: 'Up to €20,000 under CySEC',
    riskDisclosure: 'Full risk disclosure provided'
  },
  customerSupport: {
    channels: ['Live Chat', 'Email', 'Phone', 'Callback Request'],
    hours: '24/5',
    languages: ['English', 'Spanish', 'German', 'French', 'Italian', 'Arabic', 'Chinese'],
    quality: 'Responsive and knowledgeable',
    responseTime: 'Chat: < 1 minute, Email: < 24 hours'
  },
  education: {
    materials: ['Trading Guides', 'Video Tutorials', 'Webinars', 'eBooks', 'Glossary'],
    marketAnalysis: 'Daily market updates and technical analysis',
    demo: 'Unlimited demo account'
  },
  pros: [
    'Multiple regulation from top-tier authorities',
    'Wide range of trading platforms',
    'Extensive language support',
    'Competitive spreads on premium accounts',
    'Fast withdrawal processing'
  ],
  cons: [
    'Higher spreads on standard accounts',
    'Inactivity fee after 6 months',
    'Limited cryptocurrency offerings',
    'Advanced platforms not available on all account types'
  ],
  historicalData: [
    { month: 'Jan', spread: 1.2, execution: 0.18 },
    { month: 'Feb', spread: 1.1, execution: 0.15 },
    { month: 'Mar', spread: 0.9, execution: 0.14 },
    { month: 'Apr', spread: 0.8, execution: 0.13 },
    { month: 'May', spread: 0.7, execution: 0.12 },
    { month: 'Jun', spread: 0.8, execution: 0.13 },
  ],
  radarData: [
    { subject: 'Trading Tools', A: 85 },
    { subject: 'Research', A: 70 },
    { subject: 'Mobile App', A: 80 },
    { subject: 'Fees', A: 65 },
    { subject: 'Customer Service', A: 90 },
    { subject: 'Ease of Use', A: 75 },
  ]
};

const relatedBrokers = [
  {
    id: 2,
    name: 'FXTM',
    logo: 'https://via.placeholder.com/120x60?text=FXTM',
    rating: 4.7,
    minDeposit: 50,
    slug: 'fxtm'
  },
  {
    id: 3,
    name: 'XM',
    logo: 'https://via.placeholder.com/120x60?text=XM',
    rating: 4.5,
    minDeposit: 5,
    slug: 'xm'
  },
  {
    id: 4,
    name: 'Pepperstone',
    logo: 'https://via.placeholder.com/120x60?text=Pepperstone',
    rating: 4.9,
    minDeposit: 200,
    slug: 'pepperstone'
  }
];

// Add generateStaticParams function for static site generation
export async function generateStaticParams() {
  // Include all broker slugs that should be pre-rendered
  return [
    { slug: 'ironfx' },
    { slug: 'fxtm' },
    { slug: 'xm' },
    { slug: 'pepperstone' }
  ];
}

export default function BrokerProfilePage({ params }: { params: { slug: string } }) {
  return <BrokerProfile brokerData={brokerData} relatedBrokers={relatedBrokers} />;
}