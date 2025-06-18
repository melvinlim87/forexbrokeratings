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
