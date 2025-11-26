export const revalidate = 0;
import BrokerProfile from '@/components/broker/broker-profile';
import { LoginModalProvider } from '@/components/broker/LoginModalContext';
import { fetchAllBrokerDetails, fetchPromotionsByBrokerId, fetchReviewsByBrokerId, fetchBrokerLicensesByBrokerId, BrokerDetails } from '@/lib/supabase';
import Script from 'next/script';
 

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
async function formatBrokerData(broker: BrokerDetails): Promise<BrokerDetails> {
  if (!broker) {
    return getDefaultBroker('default');
  }

  const reviews = await fetchReviewsByBrokerId(broker.id.toString());
  const broker_licenses = await fetchBrokerLicensesByBrokerId(broker.id.toString())
  return {
    id: broker.id || 0,
    name: broker.name,
    slug: broker.slug || 'default',
    website: broker.website || '#',
    logo: broker.logo || `https://via.placeholder.com/180x90?text=${encodeURIComponent(broker.name)}`,
    description: broker.description || `${broker.name} offers forex and CFD trading services.`,
    summary: broker.description || `${broker.name} offers forex and CFD trading services.`,
    rating: broker.rating || '3.5',
    year_published: broker.year_published || new Date().getFullYear().toString(),
    headquarters: broker.headquarters || 'Not specified',
    country: broker.country || 'International',
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
    badges: parseArrayField(broker.badges) || [],
    promotion_details: broker.promotion_details || [],
    promotions: broker.promotions || 0,
    environment: broker.environment || 0,
    user_experience: broker.user_experience || 0,
    user_traffic: broker.user_traffic || 0,
    sw: broker.sw || 0,
    regulations: broker.regulations || 0,
    risk_control: broker.risk_control || 0,
    reviews: reviews || [],
    parent_company: broker.parent_company || '',
    has_api: broker.has_api || false,
    has_mobile_trading: broker.has_mobile_trading || false,
    has_web_based_trading: broker.has_web_based_trading || false,
    min_lot: broker.min_lot || '0.1',
    max_lot: broker.max_lot || '1000',
    has_demo_account: broker.has_demo_account || false,
    parent_companies: broker.parent_companies || [],
    broker_licenses: broker_licenses || [],
    status: true,
    affiliate_link: broker.affiliate_link || ''
  };
}

function getDefaultBroker(slug: string): BrokerDetails {
  const name = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    id: 0,
    name,
    slug,
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
    website: '#',
    year_published: '2023',
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
    badges: [],
    promotion_details: [],
    promotions: 0,
    environment: 0,
    user_experience: 0,
    user_traffic: 0,
    sw: 0,
    regulations: 0,
    risk_control: 0,
    reviews: [],
    parent_company: '',
    has_api: false,
    has_mobile_trading: false,
    has_web_based_trading: false,
    min_lot: '0.1',
    max_lot: '1000',
    has_demo_account: false,
    parent_companies: [],
    broker_licenses: [],
    status: true
  };
}

export default async function BrokerProfilePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Only fetch from Supabase, no static fallback
  try {
    const data = await fetchAllBrokerDetails();
    
    // console.log(data)
    const broker = data.find(b => {
      const slug = b.name.toLowerCase().replace(/\s+/g, '-');
      return slug === params.slug;
    });
    // console.log(broker)
    if (!broker) {
      // If not found in Supabase, show not found UI
      return (
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Broker Not Found</h1>
            <p className="text-gray-600">The broker you're looking for doesn't exist in our database.</p>
          </div>
        </div>
      );
    }

    // --- SKELETON LOADER ---
    if (!broker) {
      const BrokerProfileSkeleton = (await import('@/components/broker/BrokerProfileSkeleton')).default;
      return <BrokerProfileSkeleton />;
    }
    // Fetch promotions for the selected broker
    const promotion_details = await fetchPromotionsByBrokerId(broker.id.toString());
    broker.promotion_details = promotion_details;
    const brokerData = await formatBrokerData(broker);
    // Fetch related brokers - convert ID to string to match expected type
    const relatedBrokers = await fetchRelatedBrokers(broker.id.toString());
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* JSON-LD Breadcrumbs for Broker */}
        <Script id="broker-breadcrumb-jsonld" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://forexbrokeratings.com/' },
                { '@type': 'ListItem', position: 2, name: 'Brokers', item: 'https://forexbrokeratings.com/brokers' },
                { '@type': 'ListItem', position: 3, name: brokerData.name, item: `https://forexbrokeratings.com/broker/${brokerData.slug || brokerData.name.toLowerCase().replace(/\\s+/g, '-')}` }
              ]
            })
          }}
        />
        {/* JSON-LD AggregateRating for Broker (shown only when data available) */}
        {(() => {
          const rating = typeof brokerData.rating === 'string' ? parseFloat(brokerData.rating) : Number(brokerData.rating || 0);
          const reviewCount = Array.isArray(brokerData.reviews) ? brokerData.reviews.length : 0;
          if (!rating || rating <= 0 || reviewCount <= 0) return null;
          const slug = brokerData.slug || brokerData.name.toLowerCase().replace(/\s+/g, '-');
          const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: brokerData.name,
            url: `https://forexbrokeratings.com/broker/${slug}`,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: rating,
              reviewCount: reviewCount,
            },
          } as const;
          return (
            <Script id="broker-aggregate-jsonld" type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          );
        })()}
        
         {/* <IPChecker /> */}
         <LoginModalProvider>
           <BrokerProfile 
             brokerData={brokerData} 
             relatedBrokers={relatedBrokers} 
           />
         </LoginModalProvider>
       </div>
    );
  } catch (error) {
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
      .filter(broker => broker.id != currentBrokerId)
      .slice(0, 5);
  } catch (error) {
    return []; // Return empty array as fallback
  }
}
