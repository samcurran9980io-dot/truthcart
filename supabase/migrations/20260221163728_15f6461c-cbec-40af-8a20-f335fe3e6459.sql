
-- Price tracking table for wishlisted products
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  product_url TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own price history
CREATE POLICY "Users can view own price history"
  ON public.price_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price history"
  ON public.price_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price history"
  ON public.price_history FOR DELETE
  USING (auth.uid() = user_id);

-- Add price alert columns to wishlists
ALTER TABLE public.wishlists
  ADD COLUMN IF NOT EXISTS target_price NUMERIC,
  ADD COLUMN IF NOT EXISTS last_known_price NUMERIC,
  ADD COLUMN IF NOT EXISTS price_alert_enabled BOOLEAN NOT NULL DEFAULT false;

-- Index for fast lookups
CREATE INDEX idx_price_history_wishlist ON public.price_history(wishlist_id, recorded_at DESC);
