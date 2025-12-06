-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'standard', 'premium')),
  stripe_customer_id TEXT UNIQUE,
  usa_address_id UUID REFERENCES usa_addresses(id),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- USA Addresses table
CREATE TABLE IF NOT EXISTS usa_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  suite_number INTEGER UNIQUE NOT NULL,
  street TEXT NOT NULL DEFAULT '123 Parcel Forward Way',
  city TEXT NOT NULL DEFAULT 'New York',
  state TEXT NOT NULL DEFAULT 'NY',
  zip TEXT NOT NULL DEFAULT '10001',
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usa_address_id UUID REFERENCES usa_addresses(id),
  tracking_number TEXT UNIQUE NOT NULL,
  carrier TEXT,
  received_date TIMESTAMPTZ DEFAULT NOW(),
  weight_lbs DECIMAL(10, 2),
  dimensions JSONB, -- {length, width, height}
  declared_value DECIMAL(10, 2),
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'stored', 'shipped', 'delivered', 'discarded')),
  photos TEXT[], -- Array of photo URLs
  notes TEXT,
  consolidated_shipment_id UUID REFERENCES shipments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_ids UUID[], -- Array of package IDs
  shipping_method TEXT NOT NULL CHECK (shipping_method IN ('air_express', 'air_economy', 'sea_lcl', 'sea_fcl')),
  destination_address JSONB NOT NULL, -- {name, address, city, state, zip, country}
  customs_declaration JSONB, -- {items: [{description, value, hs_code, quantity}]}
  tracking_number TEXT UNIQUE,
  carrier TEXT,
  cost_usd DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'customs', 'delivered', 'cancelled')),
  estimated_delivery DATE,
  actual_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(id),
  type TEXT NOT NULL CHECK (type IN ('storage', 'consolidation', 'shipping', 'repackaging')),
  amount_usd DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  stripe_invoice_id TEXT UNIQUE,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('package_received', 'shipment_update', 'invoice', 'customs', 'delivery')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- Additional data specific to notification type
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipping rates table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_country TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('air_express', 'air_economy', 'sea_lcl', 'sea_fcl')),
  weight_min_lbs DECIMAL(10, 2) NOT NULL DEFAULT 0,
  weight_max_lbs DECIMAL(10, 2) NOT NULL DEFAULT 9999,
  cost_per_lb DECIMAL(10, 2) NOT NULL,
  base_fee DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_packages_user_id ON packages(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usa_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- USA Addresses policies
CREATE POLICY "Users can view own address" ON usa_addresses
  FOR SELECT USING (user_id = auth.uid());

-- Packages policies
CREATE POLICY "Users can view own packages" ON packages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all packages" ON packages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert packages" ON packages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update packages" ON packages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Shipments policies
CREATE POLICY "Users can view own shipments" ON shipments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create shipments" ON shipments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all shipments" ON shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update shipments" ON shipments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Shipping rates policies (public read)
CREATE POLICY "Anyone can view shipping rates" ON shipping_rates
  FOR SELECT USING (true);

-- Insert default shipping rates
INSERT INTO shipping_rates (origin_country, destination_country, method, cost_per_lb, base_fee) VALUES
  ('USA', '*', 'air_express', 8.00, 15.00),
  ('USA', '*', 'air_economy', 5.00, 10.00),
  ('USA', '*', 'sea_lcl', 2.00, 25.00)
ON CONFLICT DO NOTHING;

-- Function to auto-assign suite number on user creation
CREATE OR REPLACE FUNCTION assign_usa_address()
RETURNS TRIGGER AS $$
DECLARE
  new_suite_number INTEGER;
  max_attempts INTEGER := 100;
  attempt INTEGER := 0;
BEGIN
  -- Try to find an available suite number
  LOOP
    -- Generate a random suite number between 1000 and 9999
    new_suite_number := floor(random() * 9000 + 1000)::INTEGER;
    
    -- Check if it's available
    IF NOT EXISTS (SELECT 1 FROM usa_addresses WHERE suite_number = new_suite_number) THEN
      EXIT; -- Found an available number
    END IF;
    
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Unable to assign suite number after % attempts', max_attempts;
    END IF;
  END LOOP;
  
  -- Create USA address
  INSERT INTO usa_addresses (user_id, suite_number)
  VALUES (NEW.id, new_suite_number)
  RETURNING id INTO NEW.usa_address_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign USA address on user creation
CREATE TRIGGER on_user_created
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION assign_usa_address();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for shipments updated_at
CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
