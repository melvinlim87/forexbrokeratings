export interface Broker {
  id: number;
  name: string;
  website: string;
  logo?: string;
  description?: string;
  rating?: string;
  year_published?: string;
  headquarters?: string;
  country?: string;
  regulators?: string[];
  licenses?: string[];
  is_regulated?: boolean;
  instruments?: string[];
  platforms?: string[];
  min_deposit?: string;
  min_withdrawl?: string;
  deposit_fees?: string;
  withdrawal_fees?: string;
  deposit_process_time?: string;
  withdrawal_process_time?: string;
  leverage_max?: string;
  spread_eur_usd?: string;
  pros?: string[];
  cons?: string[];
  environment: number;
  user_experience: number;
  sw: number;
  regulations: number;
  risk_control: number;
  promotions: number;
  email: string;
  phone_numbers: string[];
  channels: string[];
  availability: string;
  response_time: string;
  created_at: string;
  top_broker_sequence: number;
  account_types?: string[];
}

export const brokers: Broker[] = [
  {
    id: 1,
    name: "IC Markets",
    website: "https://www.icmarkets.com",
    logo: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: "4.8",
    year_published: "2007",
    headquarters: "Sydney, Australia",
    country: "Australia",
    regulators: ["ASIC", "CySEC", "FSA"],
    licenses: ["AFSL 335692", "364264", "SD060"],
    is_regulated: true,
    instruments: ["Forex", "Indices", "Commodities", "Stocks", "Bonds", "Cryptocurrencies"],
    platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader"],
    min_deposit: "200",
    min_withdrawl: "100",
    deposit_fees: "0",
    withdrawal_fees: "0",
    deposit_process_time: "Instant",
    withdrawal_process_time: "1-3 business days",
    leverage_max: "1:500",
    spread_eur_usd: "0.1",
    pros: ["Tight spreads", "Fast execution", "Good range of instruments"],
    cons: ["High minimum deposit", "Limited research tools"],
    environment: 9,
    user_experience: 8,
    sw: 8,
    regulations: 9,
    risk_control: 8,
    promotions: 7,
    email: "support@icmarkets.com",
    phone_numbers: ["+61280147131"],
    channels: ["Live Chat", "Email", "Phone"],
    availability: "24/5",
    response_time: "< 2 minutes",
    created_at: "2023-01-01T00:00:00Z",
    top_broker_sequence: 1,
    description: "Leading ECN broker with institutional-grade execution and tight spreads."
  },
  {
    id: 2,
    name: "Pepperstone",
    website: "https://pepperstone.com",
    logo: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: "4.7",
    year_published: "2010",
    headquarters: "Melbourne, Australia",
    country: "Australia",
    regulators: ["ASIC", "FCA", "DFSA", "BaFin", "SCB", "CMA", "CySEC"],
    licenses: ["AFSL 414530", "FRN 684312", "F003225", "DIFC F004885"],
    is_regulated: true,
    instruments: ["Forex", "Indices", "Commodities", "Cryptocurrencies", "Shares"],
    platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader", "TradingView"],
    min_deposit: "200",
    min_withdrawl: "50",
    deposit_fees: "0",
    withdrawal_fees: "0",
    deposit_process_time: "Instant",
    withdrawal_process_time: "1 business day",
    leverage_max: "1:400",
    spread_eur_usd: "0.0",
    pros: ["Tight spreads", "Fast execution", "Good range of platforms"],
    cons: ["Limited educational content"],
    environment: 9,
    user_experience: 9,
    sw: 9,
    regulations: 9,
    risk_control: 9,
    promotions: 7,
    email: "support@pepperstone.com",
    phone_numbers: ["+61390208040"],
    channels: ["Live Chat", "Email", "Phone"],
    availability: "24/5",
    response_time: "< 1 minute",
    created_at: "2023-01-02T00:00:00Z",
    top_broker_sequence: 2,
    description: "Award-winning broker with razor-sharp spreads and lightning execution."
  },
  {
    id: 3,
    name: "XM Group",
    website: "https://www.xm.com",
    logo: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    rating: "4.6",
    year_published: "2009",
    headquarters: "Limassol, Cyprus",
    country: "Cyprus",
    regulators: ["ASIC", "CySEC", "DFSA", "FSC"],
    licenses: ["AFSL 443670", "120/10", "F003221", "SD012"],
    is_regulated: true,
    instruments: ["Forex", "Stocks", "Commodities", "Equity Indices", "Precious Metals", "Energies"],
    platforms: ["MetaTrader 4", "MetaTrader 5", "XM WebTrader"],
    min_deposit: "5",
    min_withdrawl: "5",
    deposit_fees: "0",
    withdrawal_fees: "0",
    deposit_process_time: "Instant",
    withdrawal_process_time: "1 business day",
    leverage_max: "1:888",
    spread_eur_usd: "1.0",
    pros: ["Low minimum deposit", "Good educational resources", "Multiple account types"],
    cons: ["Higher spreads on some accounts"],
    environment: 8,
    user_experience: 8,
    sw: 8,
    regulations: 9,
    risk_control: 8,
    promotions: 8,
    email: "support@xm.com",
    phone_numbers: ["+35725029933"],
    channels: ["Live Chat", "Email", "Phone", "WhatsApp"],
    availability: "24/5",
    response_time: "< 2 minutes",
    created_at: "2023-01-03T00:00:00Z",
    top_broker_sequence: 3,
    description: "Global forex and CFD broker with flexible trading conditions."
  }
];

export const stats = {
  totalBrokers: brokers.length,
  avgRating: Number((brokers.reduce((sum, broker) => sum + Number(broker.rating), 0) / brokers.length).toFixed(1)),
  avgSpread: Number((brokers.reduce((sum, broker) => sum + Number(broker.spread_eur_usd), 0) / brokers.length).toFixed(1)),
  totalReviews: 15847
};