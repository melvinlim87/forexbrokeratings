import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// In production, these should be environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vsqwjqywvflfyumilhyx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcXdqcXl3dmZsZnl1bWlsaHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYxMjMxNiwiZXhwIjoyMDY1MTg4MzE2fQ.EhdZ_Nb0atRBib6DH9rjoHW5xT0wsFZAmTczZAdgsCQ';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for broker data
export type BrokerDetails = {
  id: string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  rating?: number;
  yearEstablished?: number;
  headquarters?: string;
  regulators?: string[];
  instruments?: string[];
  platforms?: string[];
  minDeposit?: number;
  leverage?: string;
  spreads?: string;
  pros?: string[];
  cons?: string[];
  created_at?: string;
  updated_at?: string;
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
