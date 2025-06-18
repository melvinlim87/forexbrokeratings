import { supabase } from './supabase';

// Function to fetch broker promotions by broker_detail_id
export async function fetchBrokerPromotions(brokerDetailId: string) {
  const { data, error } = await supabase
    .from('broker_promotions')
    .select('*')
    .eq('broker_detail_id', brokerDetailId)
    .order('created_at', { ascending: false });
  
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
