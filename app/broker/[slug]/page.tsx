import BrokerProfile from '@/components/broker/broker-profile';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IPChecker } from '@/components/ip-checker';
import { fetchAllBrokerDetails, BrokerDetails } from '@/lib/supabase';

// Fallback data in case Supabase fetch fails
const brokersData = {
  ironfx: {
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
  },
  xtb: {
    id: 5,
    name: 'XTB',
    logo: 'https://via.placeholder.com/180x90?text=XTB',
    rating: 4.5,
    minDeposit: 250,
    summary: 'XTB is a globally recognized broker offering trading in forex, indices, commodities, and stocks. Known for their proprietary xStation 5 platform and competitive pricing structure.',
    tradingInfo: {
      spreads: 'From 0.1 pips',
      leverage: 'Up to 1:30 (EU), 1:500 (Non-EU)',
      platforms: ['xStation 5', 'MetaTrader 4', 'Mobile Apps'],
      instruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'ETFs', 'Cryptocurrencies'],
      accountTypes: ['Standard', 'Pro'],
      minTrade: '0.01 lots'
    },
    tradingFeatures: {
      executionSpeed: 'Average 0.1 seconds',
      orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
      hedging: true,
      scalping: true,
      expertAdvisors: true,
      api: true,
      demoAccount: true
    },
    scores: {
      overall: 4.5,
      tradingInstruments: 4.2,
      platforms: 4.6,
      fees: 4.3,
      security: 4.7,
      deposit: 4.4,
      customerService: 4.5
    },
    fees: {
      trading: {
        spread: 'From 0.1 pips (Pro account)',
        commission: 'Commission-free standard account',
        overnight: 'Varies by instrument'
      },
      nonTrading: {
        deposit: 'Free',
        withdrawal: 'Free',
        inactivity: 'No inactivity fee',
        account: 'No monthly fees'
      }
    },
    depositWithdrawal: {
      methods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
      depositTime: 'Instant for most methods',
      withdrawalTime: '24-48 hours',
      baseCurrencies: ['USD', 'EUR', 'GBP', 'PLN']
    },
    regulation: {
      primary: 'FCA (UK Financial Conduct Authority)',
      additional: ['KNF (Poland)', 'CySEC (Cyprus)', 'IFSC (Belize)'],
      clientFunds: 'Segregated accounts',
      negativeBalanceProtection: true,
      investorCompensation: 'Up to £85,000 under FCA',
      riskDisclosure: 'Comprehensive risk disclosure'
    },
    customerSupport: {
      channels: ['24/5 Live Chat', 'Email', 'Phone', 'WhatsApp'],
      hours: '24/5',
      languages: ['English', 'Polish', 'German', 'Spanish', 'Czech', 'French', 'Italian'],
      quality: 'Award-winning support team',
      responseTime: 'Average response time under 30 seconds'
    },
    education: {
      materials: ['Trading Academy', 'Video Courses', 'Webinars', 'Market Analysis', 'Economic Calendar'],
      marketAnalysis: 'Daily market insights and technical analysis',
      demo: 'Unlimited demo account access'
    },
    pros: [
      'Award-winning proprietary platform',
      'Competitive spreads and commission-free trading',
      'Excellent educational resources',
      'Strong regulatory oversight',
      'No deposit or withdrawal fees'
    ],
    cons: [
      'Limited cryptocurrency offerings',
      'Higher minimum deposit than some competitors',
      'No US clients accepted',
      'Limited fundamental analysis tools'
    ],
    historicalData: [
      { month: 'Jan', spread: 0.9, execution: 0.12 },
      { month: 'Feb', spread: 0.8, execution: 0.11 },
      { month: 'Mar', spread: 0.7, execution: 0.10 },
      { month: 'Apr', spread: 0.6, execution: 0.09 },
      { month: 'May', spread: 0.5, execution: 0.08 },
      { month: 'Jun', spread: 0.6, execution: 0.09 },
    ],
    radarData: [
      { subject: 'Trading Tools', A: 90 },
      { subject: 'Research', A: 85 },
      { subject: 'Mobile App', A: 95 },
      { subject: 'Fees', A: 88 },
      { subject: 'Customer Service', A: 92 },
      { subject: 'Ease of Use', A: 89 },
    ]
  }
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

export async function generateStaticParams() {
  // Fetch all broker details from Supabase
  try {
    const brokers = await fetchAllBrokerDetails();
    // Map the brokers to slug params
    return brokers.map(broker => ({
      slug: broker.name.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    // Fallback to static list if Supabase fetch fails
    return [
      { slug: 'ironfx' },
      { slug: 'fxtm' },
      { slug: 'xm' },
      { slug: 'pepperstone' },
      { slug: 'xtb' },
      { slug: 'oanda' },
    ];
  }
}

// Function to check if the user's IP is from Singapore
function checkSingaporeIP(ip: string): boolean {
  // This is a placeholder implementation
  // In a real application, you would use a proper IP geolocation service
  // For example, you could use a library like 'geoip-lite' or an API like ipinfo.io
  
  // For now, we'll just check if the IP starts with specific ranges commonly used in Singapore
  // This is NOT accurate and is just for demonstration purposes
  const sgIPRanges = ['8.128.', '8.129.', '45.126.', '116.12.', '116.13.', '165.21.', '203.116.'];
  
  // If IP is from Singapore, return true
  // In a real implementation, you would use proper IP geolocation
  return sgIPRanges.some(range => ip.startsWith(range));
}

// Function to convert Supabase broker data to the format expected by BrokerProfile component
function formatBrokerData(broker: BrokerDetails) {
  // Safety check - if broker is null or undefined, return a default object
  if (!broker) {
    return brokersData.xtb; // Return a default broker from static data
  }
  
  // Handle arrays that might be stored as strings in Supabase
  const parseArrayField = (field: string[] | string | null | undefined) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      // Try to parse as JSON if it's a string
      return JSON.parse(field as string);
    } catch (e) {
        // If parsing fails, return as single item array
      return [field];
    }
  };

  // Format the broker data to match the expected structure
  return {
    id: broker.id,
    name: broker.name,
    logo: broker.logo || `https://via.placeholder.com/180x90?text=${broker.name}`,
    rating: broker.rating || 4.0,
    minDeposit: broker.minDeposit || 100,
    summary: broker.description || `${broker.name} offers forex and CFD trading services.`,
    tradingInfo: {
      spreads: broker.spreads || 'Variable',
      leverage: broker.leverage || 'Up to 1:30',
      platforms: parseArrayField(broker.platforms),
      instruments: parseArrayField(broker.instruments),
      accountTypes: ['Standard', 'Premium'],
      minTrade: '0.01 lots'
    },
    tradingFeatures: {
      executionSpeed: 'Average 0.2 seconds',
      orderTypes: ['Market', 'Limit', 'Stop'],
      hedging: true,
      scalping: true,
      expertAdvisors: true,
      api: false,
      demoAccount: true
    },
    scores: {
      overall: broker.rating || 4.0,
      tradingInstruments: 4.0,
      platforms: 4.0,
      fees: 4.0,
      security: 4.0,
      deposit: 4.0,
      customerService: 4.0
    },
    fees: {
      trading: {
        spread: broker.spreads || 'Variable',
        commission: 'Varies by account type',
        overnight: 'Varies by instrument'
      },
      nonTrading: {
        deposit: 'Free',
        withdrawal: 'Free',
        inactivity: 'Varies',
        account: 'No monthly fees'
      }
    },
    depositWithdrawal: {
      methods: ['Credit/Debit Card', 'Bank Transfer', 'E-wallets'],
      depositTime: 'Instant for most methods',
      withdrawalTime: '1-3 business days',
      baseCurrencies: ['USD', 'EUR', 'GBP']
    },
    regulation: {
      primary: parseArrayField(broker.regulators)[0] || 'Regulated',
      additional: parseArrayField(broker.regulators).slice(1),
      clientFunds: 'Segregated accounts',
      negativeBalanceProtection: true,
      investorCompensation: 'Varies by regulator',
      riskDisclosure: 'Full risk disclosure provided'
    },
    customerSupport: {
      channels: ['Live Chat', 'Email', 'Phone'],
      hours: '24/5',
      languages: ['English', 'Other languages vary'],
      quality: 'Professional support team',
      responseTime: 'Varies'
    },
    education: {
      materials: ['Trading Guides', 'Video Tutorials', 'Webinars'],
      marketAnalysis: 'Market analysis and news',
      demo: 'Demo account available'
    },
    pros: parseArrayField(broker.pros),
    cons: parseArrayField(broker.cons),
    historicalData: [
      { month: 'Jan', spread: 1.0, execution: 0.2 },
      { month: 'Feb', spread: 1.0, execution: 0.2 },
      { month: 'Mar', spread: 1.0, execution: 0.2 },
      { month: 'Apr', spread: 1.0, execution: 0.2 },
      { month: 'May', spread: 1.0, execution: 0.2 },
      { month: 'Jun', spread: 1.0, execution: 0.2 },
    ],
    radarData: [
      { subject: 'Trading Tools', A: 80 },
      { subject: 'Research', A: 75 },
      { subject: 'Mobile App', A: 85 },
      { subject: 'Fees', A: 70 },
      { subject: 'Customer Service', A: 80 },
      { subject: 'Ease of Use', A: 75 },
    ]
  };
}

// Function to fetch related brokers
async function fetchRelatedBrokers(currentBrokerId: string): Promise<BrokerDetails[]> {
  try {
    // Fetch all brokers and filter out the current one
    const brokers = await fetchAllBrokerDetails();
    if (!brokers) return [];
    
    // Filter out the current broker and take up to 5 others
    return brokers
      .filter(broker => broker.id !== currentBrokerId)
      .slice(0, 5);
  } catch (error) {
    return []; // Return empty array as fallback
  }
}

// Function to get a default broker when none is found
function getDefaultBroker(slug: string) {
  return {
    id: 'default',
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    logo: 'https://via.placeholder.com/180x90?text=Broker',
    rating: 4.0,
    minDeposit: 100,
    summary: 'This broker information is not available at the moment. Please check back later or contact support for more information.',
    tradingInfo: {
      spreads: 'N/A',
      leverage: 'N/A',
      platforms: ['N/A'],
      instruments: ['N/A'],
      accountTypes: ['N/A'],
      minTrade: 'N/A'
    },
    tradingFeatures: {
      executionSpeed: 'N/A',
      orderTypes: ['N/A'],
      hedging: false,
      scalping: false,
      expertAdvisors: false,
      api: false,
      demoAccount: false
    },
    scores: {
      overall: 4.0,
      tradingInstruments: 4.0,
      platforms: 4.0,
      fees: 4.0,
      security: 4.0,
      deposit: 4.0,
      customerService: 4.0
    },
    fees: {
      trading: {
        spread: 'N/A',
        commission: 'N/A',
        overnight: 'N/A'
      },
      nonTrading: {
        deposit: 'N/A',
        withdrawal: 'N/A',
        inactivity: 'N/A',
        account: 'N/A'
      }
    },
    depositWithdrawal: {
      methods: ['N/A'],
      depositTime: 'N/A',
      withdrawalTime: 'N/A',
      baseCurrencies: ['N/A']
    },
    regulation: {
      primary: 'N/A',
      additional: ['N/A'],
      clientFunds: 'N/A',
      negativeBalanceProtection: false,
      investorCompensation: 'N/A',
      riskDisclosure: 'N/A'
    },
    customerSupport: {
      channels: ['N/A'],
      hours: 'N/A',
      languages: ['N/A'],
      quality: 'N/A',
      responseTime: 'N/A'
    },
    education: {
      materials: ['N/A'],
      marketAnalysis: 'N/A',
      demo: 'N/A'
    },
    pros: ['N/A'],
    cons: ['N/A']
  };
}

export default async function BrokerProfilePage({ params }: { params: { slug: string } }) {
  try {
    const staticBroker = brokersData[params.slug as keyof typeof brokersData] || getDefaultBroker(params.slug);
    
    // Try to fetch from Supabase
    let broker: BrokerDetails | null = null;
    try {
      // Fetch all brokers from Supabase
      const brokers = await fetchAllBrokerDetails();
      
      if (brokers && brokers.length > 0) {
        // Find the broker with matching slug
        const normalizedSlug = params.slug.toLowerCase();
        broker = brokers.find(b => {
          if (!b || !b.name) return false;
          return b.name.toLowerCase().replace(/\s+/g, '-') === normalizedSlug;
        }) || null;
      }
    } catch (supabaseError) {

      // Continue with static data if available
    }
    
    // If we found a broker in Supabase, format and use it
    if (broker) {
      
      try {
        const formattedBroker = formatBrokerData(broker);
        const related = await fetchRelatedBrokers(broker.id.toString());
        
        return (
          <>
            <IPChecker />
            <BrokerProfile 
              brokerData={formattedBroker} 
              relatedBrokers={related.length > 0 ? related : relatedBrokers} 
            />
          </>
        );
      } catch (formatError) {
        console.error('Error formatting broker data:', formatError);
        // Fall through to use static data or default
      }
    }
    
    // If no broker found in Supabase but we have static data, use that

    return (
      <>
        <IPChecker />
        <BrokerProfile 
          brokerData={staticBroker} 
          relatedBrokers={relatedBrokers} 
        />
      </>
    );
  } catch (error) {
    // If we have an error, use the default broker data
    const defaultBroker = getDefaultBroker(params.slug);
    return (
      <>
        <IPChecker />
        <BrokerProfile 
          brokerData={defaultBroker} 
          relatedBrokers={[]} 
        />
      </>
    );
  }
}