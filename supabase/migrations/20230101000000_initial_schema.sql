-- Create users table with extended profile
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS public.phone_numbers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  number TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'expired')),
  price DECIMAL(10, 2) NOT NULL,
  user_id UUID REFERENCES public.users(id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sms_messages table
CREATE TABLE IF NOT EXISTS public.sms_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone_number_id UUID REFERENCES public.phone_numbers(id) NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create esims table
CREATE TABLE IF NOT EXISTS public.esims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  country TEXT NOT NULL,
  data_amount TEXT NOT NULL,
  validity_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'expired')),
  user_id UUID REFERENCES public.users(id),
  purchased_at TIMESTAMP WITH TIME ZONE,
  activation_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS public.gift_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_type TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  seller_id UUID REFERENCES public.users(id) NOT NULL,
  buyer_id UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'disputed', 'cancelled')),
  code TEXT,
  escrow_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create smm_services table
CREATE TABLE IF NOT EXISTS public.smm_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  price_per_1000 DECIMAL(10, 2) NOT NULL,
  average_time TEXT,
  service_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('phone_number', 'esim', 'gift_card', 'smm')),
  item_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'purchase')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ticket_replies table
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES public.support_tickets(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies

-- Users table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.users FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Phone numbers table policies
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view available phone numbers" 
  ON public.phone_numbers FOR SELECT 
  USING (status = 'available' OR user_id = auth.uid());

CREATE POLICY "Users can purchase available phone numbers" 
  ON public.phone_numbers FOR UPDATE 
  USING (status = 'available');

CREATE POLICY "Admins can manage all phone numbers" 
  ON public.phone_numbers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- SMS messages table policies
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SMS messages" 
  ON public.sms_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.phone_numbers
      WHERE id = phone_number_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all SMS messages" 
  ON public.sms_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, wallet_balance, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 0, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert initial admin user (you'll need to replace with your own user ID after registration)
-- INSERT INTO public.users (id, email, full_name, role)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@socialblast.com', 'Admin User', 'admin');

-- Insert initial settings
INSERT INTO public.settings (key, value)
VALUES 
  ('site_name', 'SocialBlast'),
  ('site_description', 'Your one-stop digital service hub'),
  ('maintenance_mode', 'false'),
  ('sms_activate_api_key', 'YOUR_SMS_ACTIVATE_API_KEY'),
  ('esim_api_key', 'YOUR_ESIM_API_KEY'),
  ('owlet_api_key', 'YOUR_OWLET_API_KEY'),
  ('stripe_public_key', 'YOUR_STRIPE_PUBLIC_KEY'),
  ('stripe_secret_key', 'YOUR_STRIPE_SECRET_KEY');