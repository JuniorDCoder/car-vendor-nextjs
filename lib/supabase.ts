import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string;
  description: string;
  features: string[];
  images: string[];
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  car_id?: string;
  is_approved: boolean;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  car_id?: string;
  status: string;
  created_at: string;
};
