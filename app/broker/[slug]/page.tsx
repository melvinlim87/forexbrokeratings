import BrokerProfile from '@/components/broker/broker-profile';
import { IPChecker } from '@/components/ip-checker';
import { fetchAllBrokerDetails, BrokerDetails } from '@/lib/supabase';

// Define the BrokerData interface to match the expected structure in BrokerProfile
interface BrokerData {
  id: number;
  created_at: string;
  name: string;
  source: string;
  website: string;
  logo: string;
  image: string | null;
  description: string;
  summary: string;
  rating: string;
  year_published: string;
  headquarters: string;
  country: string;
  offices: string[];
  employees: number | null;
  address: string;
  regulators: string[];
  licenses: string[];
  is_regulated: boolean;
  instruments: string[];
  spread_eur_usd: string;
  leverage_max: string;
  account_types: string[];
  base_currencies: string[];
  platforms: string[];
  deposit_methods: string[];
  withdraw_methods: string[];
  min_deposit: string;
  min_withdrawl: string;
  deposit_fees: string | null;
  withdrawal_fees: string | null;
  deposit_process_time: string;
  withdrawal_process_time: string;
  languages: string[];
  availability: string;
  channels: string[];
  phone_numbers: string[];
  email: string;
  response_time: string;
  pros: string[];
  cons: string[];
  fees: {
    trading: {
      spread: string;
      commission: string;
      overnight: string;
    };
    nonTrading: {
      deposit: string;
      withdrawal: string;
      inactivity: string;
      account: string;
    };
  };
  scores: {
    overall: number;
    tradingInstruments: number;
    platforms: number;
    fees: number;
    security: number;
    deposit: number;
    customerService: number;
  };
  sw: number;
  regulations: number;
  risk_control: number;
  promotions: number;
  user_experience: number;
  environment: number;
}

// Function to parse array fields that might be stored as strings in the database
const parseArrayField = (field: string[] | string | null | undefined): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field as string);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [String(field)];
  }
};

// Function to format broker data for the UI
function formatBrokerData(broker: BrokerDetails): BrokerData {
  if (!broker) {
    return getDefaultBroker('default');
  }

  return {
    id: broker.id || 0,
    name: broker.name,
    source: 'manual',
    website: broker.website || '#',
    logo: broker.logo || `https://via.placeholder.com/180x90?text=${encodeURIComponent(broker.name)}`,
    image: null,
    description: broker.description || `${broker.name} offers forex and CFD trading services.`,
    summary: broker.description || `${broker.name} offers forex and CFD trading services.`,
    rating: broker.rating || '3.5',
    year_published: broker.year_published || new Date().getFullYear().toString(),
    headquarters: broker.headquarters || 'Not specified',
    country: broker.country || 'International',
    offices: [],
    employees: null,
    address: broker.headquarters || 'Not specified',
    regulators: parseArrayField(broker.regulators),
    licenses: parseArrayField(broker.licenses),
    is_regulated: broker.is_regulated || false,
    instruments: parseArrayField(broker.instruments),
    spread_eur_usd: broker.spread_eur_usd || '1.5 pips',
    leverage_max: broker.leverage_max || '1:30',
    account_types: parseArrayField(broker.account_types) || ['Standard', 'Premium'],
    base_currencies: parseArrayField(broker.base_currencies) || ['USD', 'EUR', 'GBP'],
    platforms: parseArrayField(broker.platforms),
    deposit_methods: parseArrayField(broker.deposit_methods) || ['Bank Transfer', 'Credit Card', 'E-wallets'],
    withdraw_methods: parseArrayField(broker.withdraw_methods) || ['Bank Transfer', 'Credit Card', 'E-wallets'],
    min_deposit: broker.min_deposit?.toString() || '100',
    min_withdrawl: broker.min_withdrawl?.toString() || '50',
    deposit_fees: broker.deposit_fees || '0%',
    withdrawal_fees: broker.withdrawal_fees || '0%',
    deposit_process_time: broker.deposit_process_time || '1-3 business days',
    withdrawal_process_time: broker.withdrawal_process_time || '1-3 business days',
    languages: parseArrayField(broker.languages) || ['English'],
    availability: broker.availability || '24/5',
    channels: parseArrayField(broker.channels) || ['Email'],
    phone_numbers: parseArrayField(broker.phone_numbers) || [],
    email: broker.email || 'support@example.com',
    response_time: broker.response_time || '24 hours',
    pros: parseArrayField(broker.pros) || [],
    cons: parseArrayField(broker.cons) || [],
    environment: broker.environment || 4.0,
    user_experience: broker.user_experience || 4.0,
    sw: broker.sw || 4.0,
    regulations: broker.regulations || 4.0,
    risk_control: broker.risk_control || 4.0,
    promotions: broker.promotions || 4.0,
    fees: {
      trading: {
        spread: broker.spread_eur_usd || '1.5 pips',
        commission: 'Varies by account type',
        overnight: 'Varies by instrument'
      },
      nonTrading: {
        deposit: 'Free',
        withdrawal: 'Free (1 per month)',
        inactivity: 'After 6 months',
        account: 'No monthly fees'
      }
    },
    scores: {
      overall: 4.0,
      tradingInstruments: 4.0,
      platforms: 4.0,
      fees: 4.0,
      security: 4.0,
      deposit: 4.0,
      customerService: 4.0
    }
  };
}

function getDefaultBroker(slug: string): BrokerData {
  const name = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    id: 0,
    name,
    logo: `https://via.placeholder.com/180x90?text=${name}`,
    rating: '3.5',
    summary: `${name} offers forex and CFD trading services.`,
    description: `${name} offers forex and CFD trading services.`,
    headquarters: 'Not specified',
    country: 'International',
    regulators: [],
    licenses: [],
    is_regulated: false,
    instruments: ['Forex', 'Indices', 'Commodities'],
    platforms: ['MetaTrader 4', 'Web Platform'],
    min_deposit: '100',
    min_withdrawl: '50',
    deposit_fees: '0%',
    withdrawal_fees: '0%',
    deposit_process_time: '1-3 business days',
    withdrawal_process_time: '1-3 business days',
    leverage_max: '1:30',
    spread_eur_usd: '1.5 pips',
    pros: ['Competitive spreads', 'User-friendly platform'],
    cons: ['Limited educational resources'],
    created_at: new Date().toISOString(),
    source: 'manual',
    website: '#',
    image: null,
    year_published: '2023',
    offices: [],
    employees: null,
    address: 'Not specified',
    account_types: ['Standard', 'Premium'],
    base_currencies: ['USD', 'EUR', 'GBP'],
    deposit_methods: ['Bank Transfer', 'Credit Card', 'E-wallets'],
    withdraw_methods: ['Bank Transfer', 'Credit Card', 'E-wallets'],
    languages: ['English'],
    availability: '24/5',
    channels: ['Live Chat', 'Email'],
    phone_numbers: [],
    email: 'support@example.com',
    response_time: '24 hours',
    fees: {
      trading: {
        spread: '1.5 pips',
        commission: 'Varies by account type',
        overnight: 'Varies by instrument'
      },
      nonTrading: {
        deposit: 'Free',
        withdrawal: 'Free (1 per month)',
        inactivity: 'After 6 months',
        account: 'No monthly fees'
      }
    },
    scores: {
      overall: 3.5,
      tradingInstruments: 3.5,
      platforms: 3.5,
      fees: 3.5,
      security: 3.5,
      deposit: 3.5,
      customerService: 3.5
    }
  };
}

// Fallback data in case Supabase fetch fails
const brokersData: Record<string, BrokerData> = {
  xtb: {
    id: 5,
    name: 'XTB',
    logo: 'https://via.placeholder.com/180x90?text=XTB',
    rating: '4.5',
    min_deposit: '250',
    summary: 'XTB is a globally recognized broker offering trading in forex, indices, commodities, and stocks. Known for their proprietary xStation 5 platform and competitive pricing structure.',
    spread_eur_usd: 'From 0.1 pips',
    leverage_max: 'Up to 1:30 (EU), 1:500 (Non-EU)',
    platforms: ['xStation 5', 'MetaTrader 4', 'Mobile Apps'],
    instruments: ['Forex', 'Indices', 'Commodities', 'Stocks', 'ETFs', 'Cryptocurrencies'],
    account_types: ['Standard', 'Pro'],
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
    deposit_methods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
    withdraw_methods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
    deposit_fees: 'Free',
    withdrawal_fees: 'Free',
    deposit_process_time: 'Instant for most methods',
    withdrawal_process_time: '24-48 hours',
    base_currencies: ['USD', 'EUR', 'GBP', 'PLN'],
    regulators: ['FCA (UK Financial Conduct Authority)', 'KNF (Poland)', 'CySEC (Cyprus)', 'IFSC (Belize)'],
    languages: ['English', 'Polish', 'German', 'Spanish', 'Czech', 'French', 'Italian'],
    channels: ['24/5 Live Chat', 'Email', 'Phone', 'WhatsApp'],
    phone_numbers: ['+48 123 456 789', '+48 987 654 321'],
    email: 'support@xtb.com',
    response_time: 'Average response time under 30 seconds',
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
    environment: 4.5,
    user_experience: 4.7,
    sw: 3.9,
    regulations: 3.1,
    risk_control: 3.5,
    promotions: 4.4,
  }
};

export default async function BrokerProfilePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  try {
    // Try to fetch from Supabase first
    let brokerData: BrokerData;
    console.log('Fetching broker data for slug:', params.slug);
    try {
      console.log('Fetching all brokers from Supabase...');
      const brokers = await fetchAllBrokerDetails();
      console.log('Fetched brokers:', brokers?.length || 0);
      
      const broker = brokers?.find(b => {
        const slug = b.name.toLowerCase().replace(/\s+/g, '-');
        console.log(`Checking broker: ${b.name} (slug: ${slug})`);
        return slug === params.slug;
      });
      
      if (broker) {
        console.log('Found broker in database:', broker.name);
        console.log('Broker metrics:', {
          environment: broker.environment,
          user_experience: broker.user_experience,
          sw: broker.sw,
          regulations: broker.regulations,
          risk_control: broker.risk_control,
          promotions: broker.promotions
        });
        brokerData = formatBrokerData(broker);
      } else {
        console.log('Broker not found in database, falling back to static data');
        brokerData = brokersData[params.slug] || getDefaultBroker(params.slug);
      }
    } catch (error) {
      console.error('Error fetching broker data:', error);
      // Fall back to static data if there's an error
      brokerData = brokersData[params.slug] || getDefaultBroker(params.slug);
    }

    // Fetch related brokers - convert ID to string to match expected type
    const relatedBrokers = await fetchRelatedBrokers(brokerData.id.toString());

    return (
      <div className="container mx-auto px-4 py-8">
        <IPChecker />
        <BrokerProfile 
          brokerData={brokerData} 
          relatedBrokers={relatedBrokers} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error in BrokerProfilePage:', error);
    // Return a fallback UI if something goes wrong
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Broker Not Found</h1>
          <p className="text-gray-600">The broker you're looking for doesn't exist or an error occurred.</p>
        </div>
      </div>
    );
  }
}

// This is just for reference, the actual related brokers data is now fetched dynamically
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

