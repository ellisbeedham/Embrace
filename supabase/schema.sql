-- Embrace Boxing Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Class slots (weekly recurring classes)
CREATE TABLE class_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  location_address TEXT NOT NULL,
  class_type TEXT NOT NULL CHECK (class_type IN ('boxing', 'muay_thai')),
  capacity INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default class slots
INSERT INTO class_slots (day_of_week, start_time, end_time, location, location_address, class_type, capacity) VALUES
  ('Tuesday', '19:00', '20:00', 'Lion Boxing Academy', '140 Pitfield St, London N1 6JR', 'boxing', 20),
  ('Saturday', '10:30', '11:30', 'KO Combat Academy', '186 Bancroft Road, London E1 4ET', 'boxing', 20),
  ('Sunday', '12:00', '13:00', 'KO Combat Academy', '186 Bancroft Road, London E1 4ET', 'muay_thai', 20);

-- Subscriptions table (linked to auth.users via user_id)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('trial', '10class', 'unlimited')),
  remaining_classes INTEGER,
  valid_until DATE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_slot_id UUID NOT NULL REFERENCES class_slots(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_slot_id, booking_date)
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_class_slot_date ON bookings(class_slot_id, booking_date);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-- RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_slots ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Class slots are public read
CREATE POLICY "Class slots are publicly readable" ON class_slots
  FOR SELECT USING (true);
