import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  const errorMessage = `Missing Supabase environment variables.\n\n` +
    `Please check your .env.local file and ensure the following variables are set:\n` +
    `- NEXT_PUBLIC_SUPABASE_URL\n` +
    `- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n` +
    `Current values:\n` +
    `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}\n` +
    `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'Set' : 'Missing'}`;
  
  throw new Error('Configuration error: Missing required environment variables');
}

// Create a single supabase client for interacting with your database
let supabaseClient;

try {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  throw new Error('Failed to initialize Supabase client. Please check your configuration.');
}

export const supabase = supabaseClient;

// Type definitions for broker data
export type BrokerDetails = {
  id: number;
  name: string;
  slug: string;
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
  user_traffic: number;
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
  reviews: BrokerReviews[];
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


// Type for joined broker reviews with selected broker_details fields
export type BrokerReviews = {
  id?: number;
  broker_details_id: number;
  user_id: number;
  name: string;
  rating: string;
  title: string;
  content: string;
  status: boolean;
  is_featured: boolean;
  created_at: string;
  comment_at: string;
};

// Type definitions for Blog data
export type BlogContents = {
  id: number;
  title: string;
  slug: string;
  url: string;
  content: string;
  images: string[];
  metas: string[];
  keywords: string[];
  status: boolean
  created_at: string;
};

// Type definitions for Regulators
export type Regulators = {
  id: number;
  name: string;
  slug: string;
  tier: string;
  code: string;
  leverage_cap: string;
  jurisdiction: string[];
  image: string;
  published_year: string;
  notes: string;
  source: string;
  created_at: string;
};

// Type definitions for News
export type News = {
  id: string;
  headline: string;
  slug: string;
  summary: string;
  category: string;
  source: string;
  tags: string[];
  created_at: string;
};

// Type definitions for Subscribers
export type Subscribers = {
  id: number;
  name: string;
  email: string;
  country_code: string;
  mobileno: string;
  created_at: string;
};

// Type definitions for Users
export type Users = {
  id: number;
  name: string;
  email: string;
  country_code: string;
  mobileno: string;
  role: string;
  created_at: string;
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
      broker_details (
        name,
        website,
        logo,
        rating,
        leverage_max,
        min_deposit,
        pros,
        cons,
        environment,
        user_experience,
        sw,
        user_traffic,
        regulations,
        risk_control,
        promotions,
        email,
        phone_numbers,
        channels,
        availability,
        response_time
      )
    `)
    .eq('status', true)
    .eq('is_featured', false)
    ;

  if (error) {
    throw new Error(error.message);
  }

  const fixedData = (data || []).map((item: any) => ({
    ...item,
    broker_details: Array.isArray(item.broker_details) ? item.broker_details[0] : item.broker_details,
  })) as BrokerPromotionWithBrokerDetails[];
  return fixedData;
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
  .order('created_at', { ascending: false })
  .eq('status', true);

  const uniquePromotions = Array.from(
    new Map(data?.map(item => [item.broker_detail_id, item])).values()
  );
  
  if (error) {
    throw new Error(error.message);
  }

  const fixedData = (uniquePromotions || []).map((item: any) => ({
    ...item,
    broker_details: Array.isArray(item.broker_details) ? item.broker_details[0] : item.broker_details,
  })) as BrokerPromotionWithBrokerDetails[];
  return fixedData;
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

  const fixedData = (data || []).map((item: any) => ({
    ...item,
    broker_details: Array.isArray(item.broker_details) ? item.broker_details[0] : item.broker_details,
  })) as BrokerPromotionWithBrokerDetails[];
  return fixedData;
}

// Function to fetch featured promotion according to country
export async function fetchFeaturedPromotion(country: string): Promise<BrokerPromotionWithBrokerDetails[]> {
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
    .eq('status', true)
    .eq('is_featured', true)
    .like('country', `%${country}%`)

  if (error) {
    throw new Error(error.message);
  }

  const fixedData = (data || []).map((item: any) => ({
    ...item,
    broker_details: Array.isArray(item.broker_details) ? item.broker_details[0] : item.broker_details,
  })) as BrokerPromotionWithBrokerDetails[];
  return fixedData;
}

// Function to fetch broker reviews by broker id
export async function fetchReviewsByBrokerId(brokerId: string): Promise<BrokerReviews[]> {
  const { data, error } = await supabase
    .from('broker_reviews')
    .select(`*`)
    .eq('broker_details_id', brokerId)
    .eq('status', true);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as BrokerReviews[];
}

// Function to fetch broker reviews by user id
export async function fetchReviewsByUserId(userId: string): Promise<BrokerReviews[]> {
  const { data, error } = await supabase
    .from('broker_reviews')
    .select(`*`)
    .eq('user_id', userId)
    .eq('status', true);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as BrokerReviews[];
}

// Function to save broker reviews
export async function saveBrokerReviews(review: BrokerReviews) {
  const { data, error } = await supabase
    .from('broker_reviews')
    .insert([
      {
        broker_details_id: review.broker_details_id,
        user_id: review.user_id,
        name: review.name,
        rating: review.rating,
        title: review.title,
        content: review.content,
        status: review.status,
        is_featured: review.is_featured,
        created_at: review.created_at,
        comment_at: review.comment_at,
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


// Function to fetch blog contents
export async function fetchBlogContents() {
  const { data, error } = await supabase
    .from('broker_website_contents')
    .select('*')
    .eq('status', true);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch blog contents by id
export async function fetchBlogContentsById(id: string) {
  const { data, error } = await supabase
    .from('broker_website_contents')
    .select('*')
    .eq('status', true)
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch blog contents by slug
export async function fetchBlogContentsBySlug(slug: string) {
  const { data, error } = await supabase
    .from('broker_website_contents')
    .select('*')
    .eq('status', true)
    .eq('slug', slug)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Function to fetch regulators
export async function fetchRegulators() {
  const { data, error } = await supabase
    .from('regulators')
    .select('*')
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Type for join table (optional, for clarity)
export type BrokerDetailRegulatorJoin = {
  id: number;
  broker_detail_id: number;
  regulator_id: number;
};

// Fetch all regulators for a broker_detail_id via join table
export async function fetchRegulatorsById(broker_detail_id: number): Promise<Regulators[]> {
  // Get all regulator_ids for this broker_detail_id
  const { data: joins, error: joinError } = await supabase
    .from('broker_detail_regulators')
    .select('regulator_id')
    .eq('broker_detail_id', broker_detail_id);

  if (joinError) {
    throw new Error(joinError.message);
  }
  if (!joins || joins.length === 0) return [];

  const regulatorIds = joins.map((j: { regulator_id: number }) => j.regulator_id);

  // Fetch all regulators with those ids
  const { data: regulators, error: regError } = await supabase
    .from('regulators')
    .select('*')
    .in('id', regulatorIds);

  if (regError) {
    throw new Error(regError.message);
  }
  return regulators || [];
}

// Function to fetch news
export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to save subscribers
export async function saveSubscribers(subscriber: Subscribers) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{
      name: subscriber.name,
      email: subscriber.email,
      country_code: subscriber.country_code,
      mobileno: subscriber.mobileno,
      created_at: subscriber.created_at,
    }]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch users
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('name, email, country_code, mobileno, role, created_at')
    .eq('status', true);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to fetch user by id
export async function fetchUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('name, email, country_code, mobileno, role, created_at')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

// Function to login user with email
export async function loginUserWithCredential(email: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('name, email, password, country_code, mobileno, role, created_at')
    .eq('email', email)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Function to save user (expects already hashed password)
export async function saveUser(user: any) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name: user.name,
        email: user.email,
        password: user.password,
        country_code: user.country_code,
        mobileno: user.mobileno,
        role: user.role,
        created_at: user.created_at,
      },
    ]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

