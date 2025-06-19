export interface Broker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  minSpread: number;
  maxLeverage: string;
  minDeposit: number;
  regulatedBy: string[];
  tradingPlatforms: string[];
  accountTypes: string[];
  perks: string[];
  description: string;
  established: number;
  headquarters: string;
  assets: number;
}

export const brokers: Broker[] = [
  {
    id: "ic-markets",
    name: "IC Markets",
    logo: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 9.6,
    minSpread: 0.0,
    maxLeverage: "1:500",
    minDeposit: 200,
    regulatedBy: ["ASIC", "CySEC", "FSA"],
    tradingPlatforms: ["MetaTrader 4", "MetaTrader 5", "cTrader"],
    accountTypes: ["Raw Spread", "Standard", "cTrader"],
    perks: ["Zero Spreads", "Ultra-fast Execution", "Deep Liquidity"],
    description: "Leading ECN broker with institutional-grade execution and tight spreads.",
    established: 2007,
    headquarters: "Sydney, Australia",
    assets: 232
  },
  {
    id: "fp-markets",
    name: "FP Markets",
    logo: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 9.4,
    minSpread: 0.1,
    maxLeverage: "1:500",
    minDeposit: 100,
    regulatedBy: ["ASIC", "CySEC"],
    tradingPlatforms: ["MetaTrader 4", "MetaTrader 5", "IRESS"],
    accountTypes: ["Raw", "Standard", "ECN"],
    perks: ["Award-Winning", "24/7 Support", "Copy Trading"],
    description: "Multi-regulated broker offering competitive spreads and professional trading tools.",
    established: 2005,
    headquarters: "Sydney, Australia",
    assets: 10000
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    logo: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 9.2,
    minSpread: 0.0,
    maxLeverage: "1:400",
    minDeposit: 0,
    regulatedBy: ["ASIC", "FCA", "CySEC", "BaFin"],
    tradingPlatforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"],
    accountTypes: ["Razor", "Standard"],
    perks: ["No Minimum Deposit", "Smart Trader Tools", "Social Trading"],
    description: "Global forex and CFD broker with cutting-edge technology and tight spreads.",
    established: 2010,
    headquarters: "Melbourne, Australia",
    assets: 1200
  },
  {
    id: "xm-group",
    name: "XM Group",
    logo: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 9.0,
    minSpread: 1.0,
    maxLeverage: "1:888",
    minDeposit: 5,
    regulatedBy: ["CySEC", "IFSC", "ASIC"],
    tradingPlatforms: ["MetaTrader 4", "MetaTrader 5"],
    accountTypes: ["Micro", "Standard", "XM Zero"],
    perks: ["$5 Min Deposit", "Bonus Programs", "Education"],
    description: "Trusted global brand serving millions of clients with flexible trading conditions.",
    established: 2009,
    headquarters: "Limassol, Cyprus",
    assets: 1000
  },
  {
    id: "oanda",
    name: "OANDA",
    logo: "https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 8.8,
    minSpread: 0.8,
    maxLeverage: "1:50",
    minDeposit: 0,
    regulatedBy: ["CFTC", "NFA", "FCA", "ASIC"],
    tradingPlatforms: ["OANDA Trade", "MetaTrader 4", "TradingView"],
    accountTypes: ["Core", "Core Plus"],
    perks: ["Fractional Units", "Advanced Charts", "API Access"],
    description: "Established broker known for transparency, innovation, and reliable execution.",
    established: 1996,
    headquarters: "Toronto, Canada",
    assets: 68
  },
  {
    id: "forex-com",
    name: "Forex.com",
    logo: "https://images.pexels.com/photos/7413892/pexels-photo-7413892.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 8.6,
    minSpread: 0.8,
    maxLeverage: "1:50",
    minDeposit: 100,
    regulatedBy: ["CFTC", "NFA", "FCA"],
    tradingPlatforms: ["FOREXTrader", "MetaTrader 4", "TradingView"],
    accountTypes: ["Standard", "Commission"],
    perks: ["DMA Pricing", "Advanced Platform", "Research Tools"],
    description: "Leading US forex broker with institutional-quality trading infrastructure.",
    established: 2001,
    headquarters: "New York, USA",
    assets: 80
  },
  {
    id: "ig-group",
    name: "IG Group",
    logo: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 8.4,
    minSpread: 0.6,
    maxLeverage: "1:30",
    minDeposit: 250,
    regulatedBy: ["FCA", "ASIC", "MAS"],
    tradingPlatforms: ["IG Trading Platform", "MetaTrader 4", "ProRealTime"],
    accountTypes: ["Standard", "Professional"],
    perks: ["17,000+ Markets", "Advanced Charting", "Risk Management"],
    description: "FTSE 250 listed broker with 50+ years of experience and global reach.",
    established: 1974,
    headquarters: "London, UK",
    assets: 17000
  },
  {
    id: "plus500",
    name: "Plus500",
    logo: "https://images.pexels.com/photos/8370733/pexels-photo-8370733.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 8.2,
    minSpread: 0.7,
    maxLeverage: "1:30",
    minDeposit: 100,
    regulatedBy: ["FCA", "CySEC", "ASIC", "MAS"],
    tradingPlatforms: ["Plus500 WebTrader", "Plus500 Mobile"],
    accountTypes: ["Standard", "Professional"],
    perks: ["User-Friendly", "No Commission", "Risk Management"],
    description: "Simple and intuitive CFD trading platform with competitive spreads.",
    established: 2008,
    headquarters: "Haifa, Israel",
    assets: 2800
  },
  {
    id: "etoro",
    name: "eToro",
    logo: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 8.0,
    minSpread: 1.0,
    maxLeverage: "1:30",
    minDeposit: 50,
    regulatedBy: ["CySEC", "FCA", "ASIC"],
    tradingPlatforms: ["eToro Platform", "eToro Mobile"],
    accountTypes: ["Standard", "Professional", "Islamic"],
    perks: ["Social Trading", "Copy Trading", "Crypto Trading"],
    description: "Pioneer in social trading with millions of users worldwide.",
    established: 2007,
    headquarters: "Tel Aviv, Israel",
    assets: 3000
  },
  {
    id: "avatrade",
    name: "AvaTrade",
    logo: "https://images.pexels.com/photos/8370421/pexels-photo-8370421.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: 7.8,
    minSpread: 0.9,
    maxLeverage: "1:400",
    minDeposit: 100,
    regulatedBy: ["CBI", "ASIC", "FSA", "FSCA"],
    tradingPlatforms: ["MetaTrader 4", "MetaTrader 5", "AvaTradeGO"],
    accountTypes: ["Standard", "Professional", "Islamic"],
    perks: ["Multi-Regulated", "Educational Resources", "Trading Central"],
    description: "Global broker with comprehensive trading education and analysis tools.",
    established: 2006,
    headquarters: "Dublin, Ireland",
    assets: 1250
  }
];

export const stats = {
  totalBrokers: brokers.length,
  avgRating: Number((brokers.reduce((sum, broker) => sum + broker.rating, 0) / brokers.length).toFixed(1)),
  avgSpread: Number((brokers.reduce((sum, broker) => sum + broker.minSpread, 0) / brokers.length).toFixed(1)),
  totalReviews: 15847
};