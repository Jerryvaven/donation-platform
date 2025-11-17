-- Database Schema for Product Donation & Fire Department Matching

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table (King Sauna, Barrel Sauna, Pro Pod, Air Plunge, etc.)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., "King Sauna", "Barrel Sauna", "Pro Pod", "Air Plunge"
  category TEXT, -- e.g., "Sauna", "Cold Plunge"
  value DECIMAL(10,2) NOT NULL, -- Product value/price
  description TEXT,
  image_url TEXT, -- URL to product image or base64 data URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fire Departments table
CREATE TABLE IF NOT EXISTS fire_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., "Newport Beach Fire Department"
  city TEXT,
  county TEXT,
  latitude TEXT,
  longitude TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT, -- City name (e.g., "Los Angeles", "San Francisco")
  county TEXT, -- California county name (e.g., "Los Angeles", "San Diego")
  address TEXT, -- Full address
  latitude TEXT, -- Latitude coordinate
  longitude TEXT, -- Longitude coordinate
  total_donated_value DECIMAL(10,2) DEFAULT 0, -- Total value of products donated
  total_products_donated INT DEFAULT 0, -- Count of products donated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Donations table (replaces old donations table)
CREATE TABLE IF NOT EXISTS product_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  fire_department_id UUID REFERENCES fire_departments(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  donation_date DATE NOT NULL,
  matched BOOLEAN DEFAULT FALSE, -- Whether matched to a fire department
  status TEXT DEFAULT 'PENDING', -- 'PENDING', 'MATCHED'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Admins table (optional, for role-based access)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_donors_total_donated_value ON donors(total_donated_value DESC);
CREATE INDEX IF NOT EXISTS idx_donors_total_products ON donors(total_products_donated DESC);
CREATE INDEX IF NOT EXISTS idx_product_donations_donor_id ON product_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_product_donations_date ON product_donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_product_donations_status ON product_donations(status);
CREATE INDEX IF NOT EXISTS idx_fire_departments_name ON fire_departments(name);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Row Level Security (RLS)
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'donors' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'product_donations' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE product_donations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'products' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'fire_departments' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE fire_departments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'admins' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow insert/update to donors for admins" ON donors;
DROP POLICY IF EXISTS "Allow read access to donors" ON donors;
DROP POLICY IF EXISTS "Allow read access to admins" ON admins;
DROP POLICY IF EXISTS "Allow insert/update to donors for authenticated users" ON donors;
DROP POLICY IF EXISTS "Allow read access to product_donations" ON product_donations;
DROP POLICY IF EXISTS "Allow insert/update to product_donations for authenticated users" ON product_donations;
DROP POLICY IF EXISTS "Allow read access to products" ON products;
DROP POLICY IF EXISTS "Allow insert/update to products for authenticated users" ON products;
DROP POLICY IF EXISTS "Allow read access to fire_departments" ON fire_departments;
DROP POLICY IF EXISTS "Allow insert/update to fire_departments for authenticated users" ON fire_departments;

-- Policies: Allow read for everyone, write only for authenticated users
CREATE POLICY "Allow read access to donors" ON donors FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to donors for authenticated users" ON donors FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to product_donations" ON product_donations FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to product_donations for authenticated users" ON product_donations FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to products for authenticated users" ON products FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to fire_departments" ON fire_departments FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to fire_departments for authenticated users" ON fire_departments FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow read access to admins" ON admins FOR SELECT USING (auth.uid() = user_id);

-- Insert California fire departments
INSERT INTO fire_departments (name, city, county, address) VALUES
  -- Los Angeles County
  ('Los Angeles Fire Department', 'Los Angeles', 'Los Angeles County', 'Los Angeles, CA'),
  ('Los Angeles County Fire Department', 'Los Angeles', 'Los Angeles County', 'Los Angeles, CA'),
  ('Pasadena Fire Department', 'Pasadena', 'Los Angeles County', 'Pasadena, CA'),
  ('Glendale Fire Department', 'Glendale', 'Los Angeles County', 'Glendale, CA'),
  ('Burbank Fire Department', 'Burbank', 'Los Angeles County', 'Burbank, CA'),
  ('Long Beach Fire Department', 'Long Beach', 'Los Angeles County', 'Long Beach, CA'),
  ('Torrance Fire Department', 'Torrance', 'Los Angeles County', 'Torrance, CA'),
  ('Santa Monica Fire Department', 'Santa Monica', 'Los Angeles County', 'Santa Monica, CA'),
  ('Inglewood Fire Department', 'Inglewood', 'Los Angeles County', 'Inglewood, CA'),
  ('Compton Fire Department', 'Compton', 'Los Angeles County', 'Compton, CA'),
  
  -- Orange County
  ('Orange County Fire Authority', 'Irvine', 'Orange County', 'Irvine, CA'),
  ('Newport Beach Fire Department', 'Newport Beach', 'Orange County', 'Newport Beach, CA'),
  ('Santa Ana Fire Department', 'Santa Ana', 'Orange County', 'Santa Ana, CA'),
  ('Anaheim Fire Department', 'Anaheim', 'Orange County', 'Anaheim, CA'),
  ('Huntington Beach Fire Department', 'Huntington Beach', 'Orange County', 'Huntington Beach, CA'),
  ('Irvine Fire Department', 'Irvine', 'Orange County', 'Irvine, CA'),
  ('Costa Mesa Fire Department', 'Costa Mesa', 'Orange County', 'Costa Mesa, CA'),
  ('Fullerton Fire Department', 'Fullerton', 'Orange County', 'Fullerton, CA'),
  
  -- San Diego County
  ('San Diego Fire-Rescue Department', 'San Diego', 'San Diego County', 'San Diego, CA'),
  ('San Diego County Fire Authority', 'San Diego', 'San Diego County', 'San Diego, CA'),
  ('Chula Vista Fire Department', 'Chula Vista', 'San Diego County', 'Chula Vista, CA'),
  ('Oceanside Fire Department', 'Oceanside', 'San Diego County', 'Oceanside, CA'),
  ('Escondido Fire Department', 'Escondido', 'San Diego County', 'Escondido, CA'),
  ('Carlsbad Fire Department', 'Carlsbad', 'San Diego County', 'Carlsbad, CA'),
  ('El Cajon Fire Department', 'El Cajon', 'San Diego County', 'El Cajon, CA'),
  
  -- San Francisco Bay Area
  ('San Francisco Fire Department', 'San Francisco', 'San Francisco County', 'San Francisco, CA'),
  ('Oakland Fire Department', 'Oakland', 'Alameda County', 'Oakland, CA'),
  ('San Jose Fire Department', 'San Jose', 'Santa Clara County', 'San Jose, CA'),
  ('Fremont Fire Department', 'Fremont', 'Alameda County', 'Fremont, CA'),
  ('Berkeley Fire Department', 'Berkeley', 'Alameda County', 'Berkeley, CA'),
  ('Santa Clara County Fire Department', 'San Jose', 'Santa Clara County', 'San Jose, CA'),
  ('Alameda County Fire Department', 'Oakland', 'Alameda County', 'Oakland, CA'),
  ('Palo Alto Fire Department', 'Palo Alto', 'Santa Clara County', 'Palo Alto, CA'),
  ('Sunnyvale Department of Public Safety', 'Sunnyvale', 'Santa Clara County', 'Sunnyvale, CA'),
  ('Mountain View Fire Department', 'Mountain View', 'Santa Clara County', 'Mountain View, CA'),
  ('Hayward Fire Department', 'Hayward', 'Alameda County', 'Hayward, CA'),
  
  -- Sacramento Area
  ('Sacramento Fire Department', 'Sacramento', 'Sacramento County', 'Sacramento, CA'),
  ('Sacramento Metropolitan Fire District', 'Sacramento', 'Sacramento County', 'Sacramento, CA'),
  ('Elk Grove Fire Department', 'Elk Grove', 'Sacramento County', 'Elk Grove, CA'),
  ('Roseville Fire Department', 'Roseville', 'Placer County', 'Roseville, CA'),
  ('Folsom Fire Department', 'Folsom', 'Sacramento County', 'Folsom, CA'),
  
  -- Riverside County
  ('Riverside Fire Department', 'Riverside', 'Riverside County', 'Riverside, CA'),
  ('Riverside County Fire Department', 'Riverside', 'Riverside County', 'Riverside, CA'),
  ('Corona Fire Department', 'Corona', 'Riverside County', 'Corona, CA'),
  ('Moreno Valley Fire Department', 'Moreno Valley', 'Riverside County', 'Moreno Valley, CA'),
  ('Murrieta Fire Department', 'Murrieta', 'Riverside County', 'Murrieta, CA'),
  ('Temecula Fire Department', 'Temecula', 'Riverside County', 'Temecula, CA'),
  
  -- San Bernardino County
  ('San Bernardino County Fire Department', 'San Bernardino', 'San Bernardino County', 'San Bernardino, CA'),
  ('San Bernardino Fire Department', 'San Bernardino', 'San Bernardino County', 'San Bernardino, CA'),
  ('Fontana Fire Department', 'Fontana', 'San Bernardino County', 'Fontana, CA'),
  ('Rancho Cucamonga Fire Department', 'Rancho Cucamonga', 'San Bernardino County', 'Rancho Cucamonga, CA'),
  ('Ontario Fire Department', 'Ontario', 'San Bernardino County', 'Ontario, CA'),
  
  -- Ventura County
  ('Ventura County Fire Department', 'Ventura', 'Ventura County', 'Ventura, CA'),
  ('Oxnard Fire Department', 'Oxnard', 'Ventura County', 'Oxnard, CA'),
  ('Ventura Fire Department', 'Ventura', 'Ventura County', 'Ventura, CA'),
  ('Simi Valley Fire Department', 'Simi Valley', 'Ventura County', 'Simi Valley, CA'),
  ('Thousand Oaks Fire Department', 'Thousand Oaks', 'Ventura County', 'Thousand Oaks, CA'),
  
  -- Kern County
  ('Bakersfield Fire Department', 'Bakersfield', 'Kern County', 'Bakersfield, CA'),
  ('Kern County Fire Department', 'Bakersfield', 'Kern County', 'Bakersfield, CA'),
  
  -- Fresno County
  ('Fresno Fire Department', 'Fresno', 'Fresno County', 'Fresno, CA'),
  ('Fresno County Fire Protection District', 'Fresno', 'Fresno County', 'Fresno, CA'),
  ('Clovis Fire Department', 'Clovis', 'Fresno County', 'Clovis, CA'),
  
  -- Contra Costa County
  ('Contra Costa County Fire Protection District', 'Concord', 'Contra Costa County', 'Concord, CA'),
  ('Richmond Fire Department', 'Richmond', 'Contra Costa County', 'Richmond, CA'),
  ('Antioch Fire Department', 'Antioch', 'Contra Costa County', 'Antioch, CA'),
  ('Concord Fire Department', 'Concord', 'Contra Costa County', 'Concord, CA'),
  
  -- Santa Barbara County
  ('Santa Barbara County Fire Department', 'Santa Barbara', 'Santa Barbara County', 'Santa Barbara, CA'),
  ('Santa Barbara City Fire Department', 'Santa Barbara', 'Santa Barbara County', 'Santa Barbara, CA'),
  ('Santa Maria Fire Department', 'Santa Maria', 'Santa Barbara County', 'Santa Maria, CA'),
  
  -- San Luis Obispo County
  ('San Luis Obispo County Fire Department', 'San Luis Obispo', 'San Luis Obispo County', 'San Luis Obispo, CA'),
  ('San Luis Obispo City Fire Department', 'San Luis Obispo', 'San Luis Obispo County', 'San Luis Obispo, CA'),
  
  -- Monterey County
  ('Monterey Fire Department', 'Monterey', 'Monterey County', 'Monterey, CA'),
  ('Salinas Fire Department', 'Salinas', 'Monterey County', 'Salinas, CA'),
  
  -- Santa Cruz County
  ('Santa Cruz Fire Department', 'Santa Cruz', 'Santa Cruz County', 'Santa Cruz, CA'),
  ('Santa Cruz County Fire Department', 'Santa Cruz', 'Santa Cruz County', 'Santa Cruz, CA'),
  
  -- Sonoma County
  ('Sonoma County Fire District', 'Santa Rosa', 'Sonoma County', 'Santa Rosa, CA'),
  ('Santa Rosa Fire Department', 'Santa Rosa', 'Sonoma County', 'Santa Rosa, CA'),
  
  -- Marin County
  ('Marin County Fire Department', 'San Rafael', 'Marin County', 'San Rafael, CA'),
  ('San Rafael Fire Department', 'San Rafael', 'Marin County', 'San Rafael, CA'),
  
  -- Napa County
  ('Napa County Fire Department', 'Napa', 'Napa County', 'Napa, CA'),
  ('Napa Fire Department', 'Napa', 'Napa County', 'Napa, CA'),
  
  -- Solano County
  ('Solano County Fire Department', 'Fairfield', 'Solano County', 'Fairfield, CA'),
  ('Vallejo Fire Department', 'Vallejo', 'Solano County', 'Vallejo, CA'),
  ('Fairfield Fire Department', 'Fairfield', 'Solano County', 'Fairfield, CA'),
  
  -- Stanislaus County
  ('Modesto Fire Department', 'Modesto', 'Stanislaus County', 'Modesto, CA'),
  ('Stanislaus County Fire Department', 'Modesto', 'Stanislaus County', 'Modesto, CA'),
  
  -- San Joaquin County
  ('Stockton Fire Department', 'Stockton', 'San Joaquin County', 'Stockton, CA'),
  ('San Joaquin County Fire Authority', 'Stockton', 'San Joaquin County', 'Stockton, CA'),
  
  -- Tulare County
  ('Tulare County Fire Department', 'Visalia', 'Tulare County', 'Visalia, CA'),
  ('Visalia Fire Department', 'Visalia', 'Tulare County', 'Visalia, CA'),
  
  -- Placer County
  ('Placer County Fire Department', 'Auburn', 'Placer County', 'Auburn, CA'),
  
  -- El Dorado County
  ('El Dorado County Fire Department', 'Placerville', 'El Dorado County', 'Placerville, CA'),
  
  -- Shasta County
  ('Redding Fire Department', 'Redding', 'Shasta County', 'Redding, CA'),
  ('Shasta County Fire Department', 'Redding', 'Shasta County', 'Redding, CA'),
  
  -- Butte County
  ('Butte County Fire Department', 'Chico', 'Butte County', 'Chico, CA'),
  ('Chico Fire Department', 'Chico', 'Butte County', 'Chico, CA')
ON CONFLICT DO NOTHING;

-- Update fire departments with approximate coordinates
UPDATE fire_departments SET latitude = '34.0522', longitude = '-118.2437' WHERE city = 'Los Angeles';
UPDATE fire_departments SET latitude = '34.1478', longitude = '-118.1445' WHERE city = 'Pasadena';
UPDATE fire_departments SET latitude = '34.1425', longitude = '-118.2551' WHERE city = 'Glendale';
UPDATE fire_departments SET latitude = '34.1808', longitude = '-118.3090' WHERE city = 'Burbank';
UPDATE fire_departments SET latitude = '33.7701', longitude = '-118.1937' WHERE city = 'Long Beach';
UPDATE fire_departments SET latitude = '33.8358', longitude = '-118.3406' WHERE city = 'Torrance';
UPDATE fire_departments SET latitude = '34.0195', longitude = '-118.4912' WHERE city = 'Santa Monica';
UPDATE fire_departments SET latitude = '33.9617', longitude = '-118.3531' WHERE city = 'Inglewood';
UPDATE fire_departments SET latitude = '33.8958', longitude = '-118.2201' WHERE city = 'Compton';
UPDATE fire_departments SET latitude = '33.6846', longitude = '-117.8265' WHERE city = 'Irvine';
UPDATE fire_departments SET latitude = '33.6189', longitude = '-117.9289' WHERE city = 'Newport Beach';
UPDATE fire_departments SET latitude = '33.7455', longitude = '-117.8677' WHERE city = 'Santa Ana';
UPDATE fire_departments SET latitude = '33.8366', longitude = '-117.9143' WHERE city = 'Anaheim';
UPDATE fire_departments SET latitude = '33.6603', longitude = '-118.0000' WHERE city = 'Huntington Beach';
UPDATE fire_departments SET latitude = '33.6412', longitude = '-117.9187' WHERE city = 'Costa Mesa';
UPDATE fire_departments SET latitude = '33.8704', longitude = '-117.9242' WHERE city = 'Fullerton';
UPDATE fire_departments SET latitude = '32.7157', longitude = '-117.1611' WHERE city = 'San Diego';
UPDATE fire_departments SET latitude = '32.6401', longitude = '-117.0842' WHERE city = 'Chula Vista';
UPDATE fire_departments SET latitude = '33.1959', longitude = '-117.3795' WHERE city = 'Oceanside';
UPDATE fire_departments SET latitude = '33.1192', longitude = '-117.0864' WHERE city = 'Escondido';
UPDATE fire_departments SET latitude = '33.1581', longitude = '-117.3506' WHERE city = 'Carlsbad';
UPDATE fire_departments SET latitude = '32.7948', longitude = '-116.9625' WHERE city = 'El Cajon';
UPDATE fire_departments SET latitude = '37.7749', longitude = '-122.4194' WHERE city = 'San Francisco';
UPDATE fire_departments SET latitude = '37.8044', longitude = '-122.2712' WHERE city = 'Oakland';
UPDATE fire_departments SET latitude = '37.3382', longitude = '-121.8863' WHERE city = 'San Jose';
UPDATE fire_departments SET latitude = '37.5485', longitude = '-121.9886' WHERE city = 'Fremont';
UPDATE fire_departments SET latitude = '37.8715', longitude = '-122.2730' WHERE city = 'Berkeley';
UPDATE fire_departments SET latitude = '37.4419', longitude = '-122.1430' WHERE city = 'Palo Alto';
UPDATE fire_departments SET latitude = '37.3688', longitude = '-122.0363' WHERE city = 'Sunnyvale';
UPDATE fire_departments SET latitude = '37.3861', longitude = '-122.0839' WHERE city = 'Mountain View';
UPDATE fire_departments SET latitude = '37.6688', longitude = '-122.0808' WHERE city = 'Hayward';
UPDATE fire_departments SET latitude = '38.5816', longitude = '-121.4944' WHERE city = 'Sacramento';
UPDATE fire_departments SET latitude = '38.4088', longitude = '-121.3716' WHERE city = 'Elk Grove';
UPDATE fire_departments SET latitude = '38.7521', longitude = '-121.2880' WHERE city = 'Roseville';
UPDATE fire_departments SET latitude = '38.6779', longitude = '-121.1761' WHERE city = 'Folsom';
UPDATE fire_departments SET latitude = '33.9533', longitude = '-117.3962' WHERE city = 'Riverside';
UPDATE fire_departments SET latitude = '33.9425', longitude = '-117.5664' WHERE city = 'Corona';
UPDATE fire_departments SET latitude = '33.9425', longitude = '-117.2297' WHERE city = 'Moreno Valley';
UPDATE fire_departments SET latitude = '33.5539', longitude = '-117.2139' WHERE city = 'Murrieta';
UPDATE fire_departments SET latitude = '33.4936', longitude = '-117.1484' WHERE city = 'Temecula';
UPDATE fire_departments SET latitude = '34.1083', longitude = '-117.2898' WHERE city = 'San Bernardino';
UPDATE fire_departments SET latitude = '34.0922', longitude = '-117.4350' WHERE city = 'Fontana';
UPDATE fire_departments SET latitude = '34.1064', longitude = '-117.5931' WHERE city = 'Rancho Cucamonga';
UPDATE fire_departments SET latitude = '34.0633', longitude = '-117.6509' WHERE city = 'Ontario';
UPDATE fire_departments SET latitude = '34.2746', longitude = '-119.2290' WHERE city = 'Ventura';
UPDATE fire_departments SET latitude = '34.1975', longitude = '-119.1771' WHERE city = 'Oxnard';
UPDATE fire_departments SET latitude = '34.2694', longitude = '-118.7815' WHERE city = 'Simi Valley';
UPDATE fire_departments SET latitude = '34.1706', longitude = '-118.8376' WHERE city = 'Thousand Oaks';
UPDATE fire_departments SET latitude = '35.3733', longitude = '-119.0187' WHERE city = 'Bakersfield';
UPDATE fire_departments SET latitude = '36.7378', longitude = '-119.7871' WHERE city = 'Fresno';
UPDATE fire_departments SET latitude = '36.8252', longitude = '-119.7029' WHERE city = 'Clovis';
UPDATE fire_departments SET latitude = '37.9780', longitude = '-122.0311' WHERE city = 'Concord';
UPDATE fire_departments SET latitude = '37.9358', longitude = '-122.3477' WHERE city = 'Richmond';
UPDATE fire_departments SET latitude = '38.0049', longitude = '-121.8058' WHERE city = 'Antioch';
UPDATE fire_departments SET latitude = '34.4208', longitude = '-119.6982' WHERE city = 'Santa Barbara';
UPDATE fire_departments SET latitude = '34.9530', longitude = '-120.4357' WHERE city = 'Santa Maria';
UPDATE fire_departments SET latitude = '35.2828', longitude = '-120.6596' WHERE city = 'San Luis Obispo';
UPDATE fire_departments SET latitude = '36.6002', longitude = '-121.8947' WHERE city = 'Monterey';
UPDATE fire_departments SET latitude = '36.6777', longitude = '-121.6555' WHERE city = 'Salinas';
UPDATE fire_departments SET latitude = '36.9741', longitude = '-122.0308' WHERE city = 'Santa Cruz';
UPDATE fire_departments SET latitude = '38.4404', longitude = '-122.7141' WHERE city = 'Santa Rosa';
UPDATE fire_departments SET latitude = '37.9735', longitude = '-122.5311' WHERE city = 'San Rafael';
UPDATE fire_departments SET latitude = '38.2975', longitude = '-122.2869' WHERE city = 'Napa';
UPDATE fire_departments SET latitude = '38.2494', longitude = '-122.0400' WHERE city = 'Fairfield';
UPDATE fire_departments SET latitude = '38.1041', longitude = '-122.2566' WHERE city = 'Vallejo';
UPDATE fire_departments SET latitude = '37.6391', longitude = '-120.9969' WHERE city = 'Modesto';
UPDATE fire_departments SET latitude = '37.9577', longitude = '-121.2908' WHERE city = 'Stockton';
UPDATE fire_departments SET latitude = '36.3302', longitude = '-119.2921' WHERE city = 'Visalia';
UPDATE fire_departments SET latitude = '38.8971', longitude = '-121.0762' WHERE city = 'Auburn';
UPDATE fire_departments SET latitude = '38.7296', longitude = '-120.7989' WHERE city = 'Placerville';
UPDATE fire_departments SET latitude = '40.5865', longitude = '-122.3917' WHERE city = 'Redding';
UPDATE fire_departments SET latitude = '39.7285', longitude = '-121.8375' WHERE city = 'Chico';
