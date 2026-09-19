-- PostgreSQL Database Schema for Holiday Travelers Travel and Tours Inc Capstone
-- Run this in pgAdmin or psql to set up your database tables and seed data.

CREATE DATABASE holidaytravelers_db;
\c holidaytravelers_db;

-- 1. Tour Packages Table
CREATE TABLE IF NOT EXISTS tour_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    price_per_pax NUMERIC(12, 2) NOT NULL,
    max_capacity INT NOT NULL,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    banner_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    featured BOOLEAN DEFAULT FALSE,
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref VARCHAR(50) UNIQUE NOT NULL,
    tour_package_id UUID REFERENCES tour_packages(id) ON DELETE SET NULL,
    tour_title VARCHAR(255) NOT NULL,
    customer JSONB NOT NULL, -- { full_name, email, phone, special_requests }
    passengers JSONB NOT NULL DEFAULT '[]'::jsonb,
    travel_date DATE NOT NULL,
    num_pax INT NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    deposit_required NUMERIC(12, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'Confirmed', -- Confirmed, Pending, Completed, Cancelled
    payment_status VARCHAR(50) DEFAULT 'Unpaid', -- Paid, Partial, Unpaid
    assigned_guide VARCHAR(255),
    hotel_reservation JSONB,
    transport_reservation JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Payments & Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    booking_ref VARCHAR(50) REFERENCES bookings(booking_ref) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    amount_paid NUMERIC(12, 2) NOT NULL,
    balance_due NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- GCash, Maya, Bank Transfer, Credit Card, Cash
    payment_status VARCHAR(50) NOT NULL,
    issued_date DATE NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customer Feedback Table
CREATE TABLE IF NOT EXISTS customer_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    tour_guide_rating INT CHECK (tour_guide_rating BETWEEN 1 AND 5),
    hotel_rating INT CHECK (hotel_rating BETWEEN 1 AND 5),
    transport_rating INT CHECK (transport_rating BETWEEN 1 AND 5),
    comments TEXT,
    would_recommend BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE SEED DATA
INSERT INTO tour_packages (code, title, destination, category, duration_days, duration_nights, price_per_pax, max_capacity, inclusions, exclusions, banner_url, status, featured, itinerary)
VALUES 
(
  'PKG-PAL-01',
  'El Nido Island Hopping Tour A & C Ultimate Package',
  'El Nido, Palawan',
  'Island Hopping',
  4, 3, 14500.00, 15,
  '["4-Star Hotel Accommodation with Breakfast", "Private Air-Conditioned Van Transfers", "Tour A & C Boat Rentals with Licensed Guide", "Buffet Lunch on Island", "Environmental & Eco-Tourism Permits"]'::jsonb,
  '["Airfare / Flight Tickets", "Personal Travel Insurance", "Dinner & Alcoholic Beverages"]'::jsonb,
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1200',
  'Active', TRUE,
  '[{"day": 1, "title": "Arrival & Sunset Beach Walk", "activity": "Pickup from Lio Airport or Puerto Princesa Van Transfer. Check-in at Cove Resort and free evening sunset walk at Las Cabañas."}, {"day": 2, "title": "Tour A: Big Lagoon & Secret Lagoon", "activity": "Full day island hopping featuring Big Lagoon kayaking, Shimizu Island snorkeling, and Seven Commandos beach relax."}, {"day": 3, "title": "Tour C: Hidden Beach & Helicopter Island", "activity": "Explore Matinloc Shrine, Hidden Beach, and Helicopter Island with seafood lunch feast on board."}]'::jsonb
),
(
  'PKG-CEB-02',
  'Cebu & Bohol Heritage & Whale Shark Escapade',
  'Cebu & Bohol',
  'Heritage & Wildlife',
  3, 2, 11800.00, 20,
  '["Whale Shark Interaction Fee & Gear", "Bohol Countryside Tour with Loboc River Cruise", "FastCraft Ferry Tickets (Cebu to Tagbilaran v.v.)", "Hotel Stay at Alona Beach Resort"]'::jsonb,
  '["Flights", "Souvenirs & Tipping"]'::jsonb,
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200',
  'Active', TRUE,
  '[{"day": 1, "title": "Oslob Whale Shark & Tumalog Falls", "activity": "Early morning pickup for whale shark encounter followed by Tumalog Falls cooling dip and Sumilon Island sandbar."}, {"day": 2, "title": "Bohol Countryside & Chocolate Hills", "activity": "FastCraft to Bohol. Visit Chocolate Hills, Tarsier Sanctuary, and enjoy Loboc River lunch buffet with live music."}]'::jsonb
);

INSERT INTO bookings (booking_ref, tour_title, customer, passengers, travel_date, num_pax, total_price, deposit_required, booking_status, payment_status, assigned_guide)
VALUES 
(
  'TT-2026-8942',
  'El Nido Island Hopping Tour A & C Ultimate Package',
  '{"full_name": "Maria Santos", "email": "maria.santos@gmail.com", "phone": "+63 917 123 4567"}'::jsonb,
  '[{"name": "Maria Santos", "age": 28, "gender": "Female"}, {"name": "Juan Santos", "age": 30, "gender": "Male"}]'::jsonb,
  '2026-09-15', 2, 29000.00, 8700.00, 'Confirmed', 'Paid', 'Kuya Mark (Licensed Tour Guide)'
);
