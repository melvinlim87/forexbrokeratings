import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// In production, these should be environment variables
const supabaseUrl = 'https://vsqwjqywvflfyumilhyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcXdqcXl3dmZsZnl1bWlsaHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYxMjMxNiwiZXhwIjoyMDY1MTg4MzE2fQ.EhdZ_Nb0atRBib6DH9rjoHW5xT0wsFZAmTczZAdgsCQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for broker data
export type BrokerDetails = {
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
  account_types: string[];
  base_currencies: string[];
  deposit_methods: string[];
  withdraw_methods: string[];
  languages: string[];
  summary: string;
  badges: string[];
  promotion_details: BrokerPromotionWithBrokerDetails[];
};

// Type for joined broker_promotions with selected broker_details fields
export type BrokerPromotionWithBrokerDetails = {
  id: number;
  broker_detail_id: number;
  title: string;
  description: string;
  condition: string;
  conditions: string[];
  link: string;
  category: string;
  categories: string[];
  summary: string;
  images: string[];
  country: string;
  valid_till: string;
  is_featured: boolean;
  status: boolean;
  created_at: string;
  broker_details: {
    name: string;
    website: string;
    logo?: string;
    rating?: string;
    leverage_max?: string;
    min_deposit?: string;
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
  };
};


// Function to fetch broker websites
export async function fetchBrokerWebsites() {
  const { data, error } = await supabase
    .from('broker_websites')
    .select('*');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch all broker details
export async function fetchAllBrokerDetails() {
  const { data, error } = await supabase
    .from('broker_details')
    .select('*')
    .order('rating', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Function to fetch broker details by ID
export async function fetchBrokerDetailsById(id: string) {
  const { data, error } = await supabase
    .from('broker_details')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch broker website content
export async function fetchBrokerContent() {
  const { data, error } = await supabase
    .from('broker_website_contents')
    .select('*');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to save broker website content
export async function saveBrokerContent(content: {
  name: string;
  url: string;
  title: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('broker_website_contents')
    .insert([content]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch broker promotions joined with broker_details fields
export async function fetchBrokerPromotionsWithDetails(): Promise<BrokerPromotionWithBrokerDetails[]> {
  const { data, error } = await supabase
    .from('broker_promotions')
    .select(`
      id,
      broker_detail_id,
      title,
      description,
      condition,
      conditions,
      link,
      category,
      categories,
      summary,
      images,
      country,
      valid_till,
      is_featured,
      status,
      created_at,
      broker_details (name, website, logo, rating)
    `)
    .eq('status', true);

  if (error) {
    throw new Error(error.message);
  }
  return data as BrokerPromotionWithBrokerDetails[];
}

// Function to get unique promotions
export async function fetchUniquePromotions() {
  const { data, error } = await supabase
  .from('broker_promotions')
  .select(`
    id,
    broker_detail_id,
    title,
    description,
    condition,
    link,
    category,
    is_featured,
    created_at,
    broker_details (name, website, logo, rating, leverage_max, min_deposit, pros)
  `)
  .order('created_at', { ascending: false });

  const uniquePromotions = Array.from(
    new Map(data?.map(item => [item.broker_detail_id, item])).values()
  );
  
  if (error) {
    throw new Error(error.message);
  }

  return uniquePromotions as BrokerPromotionWithBrokerDetails[];
}

// Function to fetch all brokers with their related broker_promotions and a promotion_categories array
export async function fetchAllBrokersWithPromotionCategories() {
  const { data, error } = await supabase
    .from('broker_details')
    .select(`*, broker_promotions(category)`);

  if (error) {
    throw new Error(error.message);
  }

  // Add promotion_categories array to each broker
  const brokersWithCategories = (data || []).map((broker: any) => ({
    ...broker,
    promotion_categories: Array.isArray(broker.broker_promotions)
      ? broker.broker_promotions.map((promo: any) => promo.category).filter(Boolean)
      : []
  }));

  return brokersWithCategories;
}

// Function to fetch broker promotions by broker id
export async function fetchPromotionsByBrokerId(brokerId: string): Promise<BrokerPromotionWithBrokerDetails[]> {
  const { data, error } = await supabase
    .from('broker_promotions')
    .select(`
      id,
      broker_detail_id,
      title,
      description,
      condition,
      conditions,
      link,
      category,
      categories,
      summary,
      images,
      country,
      valid_till,
      is_featured,
      status,
      created_at,
      broker_details (name, website, logo, rating)
    `)
    .eq('broker_detail_id', brokerId)
    .eq('status', true);

  if (error) {
    throw new Error(error.message);
  }
  return data as BrokerPromotionWithBrokerDetails[];
}
