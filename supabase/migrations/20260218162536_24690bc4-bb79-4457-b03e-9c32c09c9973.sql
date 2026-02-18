
-- Create verified_deals table for the "Today's Verified Safe Picks" section
CREATE TABLE public.verified_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  trust_score INTEGER NOT NULL DEFAULT 95,
  deal_url TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'Amazon',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verified_deals ENABLE ROW LEVEL SECURITY;

-- Public read access for active deals
CREATE POLICY "Verified deals are publicly readable"
ON public.verified_deals
FOR SELECT
USING (is_active = true);

-- Insert some seed data
INSERT INTO public.verified_deals (product_name, product_image, price, trust_score, deal_url, platform) VALUES
('Sony WH-1000XM5 Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 278.00, 97, 'https://amazon.com', 'Amazon'),
('Apple AirPods Pro 2', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop', 189.99, 96, 'https://amazon.com', 'Amazon'),
('Samsung Galaxy S24 Ultra', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop', 1099.99, 95, 'https://amazon.com', 'Amazon'),
('Dyson V15 Detect Vacuum', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', 649.99, 94, 'https://amazon.com', 'Amazon'),
('Kindle Paperwhite 2024', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', 139.99, 98, 'https://amazon.com', 'Amazon'),
('Bose QuietComfort Ultra', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', 329.00, 96, 'https://amazon.com', 'Amazon');
