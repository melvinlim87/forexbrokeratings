import { supabase } from './supabase';

// Function to fetch broker promotions
// If brokerDetailId is provided, fetches promotions for that specific broker
// If no brokerDetailId is provided, fetches all promotions
export async function fetchBrokerPromotions(brokerDetailId?: string) {
  let query = supabase
    .from('broker_promotions')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Only filter by broker_detail_id if it's provided
  if (brokerDetailId) {
    query = query.eq('broker_detail_id', brokerDetailId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Type definition for broker promotion
export interface BrokerPromotion {
  id: string;
  broker_detail_id: string;
  title: string;
  description: string;
  condition: string;
  url: string;
  created_at: string;
  updated_at: string;
}
