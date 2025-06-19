import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// In production, these should be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vsqwjqywvflfyumilhyx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcXdqcXl3dmZsZnl1bWlsaHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYxMjMxNiwiZXhwIjoyMDY1MTg4MzE2fQ.EhdZ_Nb0atRBib6DH9rjoHW5xT0wsFZAmTczZAdgsCQ';

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
  created_at: string;
  top_broker_sequence: number;

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
    .select('*');
  
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

// Type for joined broker_promotions with selected broker_details fields
export type BrokerPromotionWithBrokerDetails = {
  id: number;
  broker_detail_id: number;
  title: string;
  description: string;
  condition: string;
  link: string;
  is_featured: boolean;
  created_at: string;
  broker_details: {
    name: string;
    website: string;
    logo?: string;
    rating?: string;
  };
};

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
      link,
      is_featured,
      created_at,
      broker_details (name, website, logo, rating)
    `);

  if (error) {
    throw new Error(error.message);
  }
  return data as BrokerPromotionWithBrokerDetails[];
}

// Function to top broker
export async function fetchTopBroker() {
    const { data, error } = await supabase
      .from('broker_details')
      .select('*')
      .not('top_broker_sequence', 'is', null)
      .order('top_broker_sequence', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
}