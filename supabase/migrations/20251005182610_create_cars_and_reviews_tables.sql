/*
  # Paul's Auto Car Sales - Database Schema

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `make` (text) - Car manufacturer
      - `model` (text) - Car model name
      - `year` (integer) - Manufacturing year
      - `price` (decimal) - Price in GBP
      - `mileage` (integer) - Mileage in miles
      - `fuel_type` (text) - Fuel type (Petrol, Diesel, Electric, Hybrid)
      - `transmission` (text) - Transmission type (Manual, Automatic)
      - `body_type` (text) - Body type (Sedan, SUV, Hatchback, etc.)
      - `color` (text) - Exterior color
      - `description` (text) - Detailed description
      - `features` (jsonb) - Array of features
      - `images` (jsonb) - Array of Cloudinary image URLs
      - `is_featured` (boolean) - Featured on homepage
      - `status` (text) - Available, Sold, Reserved
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `reviews`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer name
      - `rating` (integer) - Rating 1-5
      - `comment` (text) - Review text
      - `car_id` (uuid) - Reference to car (optional)
      - `is_approved` (boolean) - Admin approval status
      - `created_at` (timestamptz) - Creation timestamp

    - `inquiries`
      - `id` (uuid, primary key)
      - `name` (text) - Customer name
      - `email` (text) - Customer email
      - `phone` (text) - Customer phone
      - `message` (text) - Inquiry message
      - `car_id` (uuid) - Reference to car (optional)
      - `status` (text) - New, Contacted, Closed
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Public read access for approved content
    - Admin-only write access
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(10,2) NOT NULL,
  mileage integer NOT NULL,
  fuel_type text NOT NULL,
  transmission text NOT NULL,
  body_type text NOT NULL,
  color text NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'Available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  car_id uuid REFERENCES cars(id) ON DELETE SET NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  car_id uuid REFERENCES cars(id) ON DELETE SET NULL,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Cars policies: public read, admin write
CREATE POLICY "Anyone can view available cars"
  ON cars FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert cars"
  ON cars FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars"
  ON cars FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cars"
  ON cars FOR DELETE
  TO authenticated
  USING (true);

-- Reviews policies: public read approved, admin write
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);

-- Inquiries policies: admin only
CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inquiries"
  ON inquiries FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_is_featured ON cars(is_featured);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);