import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  wallet_balance: number;
  created_at: string;
};

export type PhoneNumber = {
  id: string;
  country: string;
  number: string;
  price: number;
  status: 'available' | 'in_use';
  created_at: string;
};

export type ESim = {
  id: string;
  country: string;
  provider: string;
  data_amount: string;
  validity_days: number;
  price: number;
  status: 'available' | 'sold';
  created_at: string;
};

export type GiftCard = {
  id: string;
  seller_id: string;
  type: string;
  value: number;
  price: number;
  status: 'available' | 'pending' | 'sold' | 'disputed';
  created_at: string;
};

export type SMMService = {
  id: string;
  platform: string;
  service_type: string;
  name: string;
  description: string;
  price_per_unit: number;
  min_quantity: number;
  max_quantity: number;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_type: 'phone_number' | 'esim' | 'gift_card' | 'smm';
  item_id: string;
  quantity?: number;
  total_price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

export type SupportTicket = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
};

export type SMSMessage = {
  id: string;
  phone_number_id: string;
  message: string;
  received_at: string;
};