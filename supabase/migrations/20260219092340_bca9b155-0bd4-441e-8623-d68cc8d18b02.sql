
-- Create scans table for community feed, user vault, and shareable reports
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  trust_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'mixed',
  mode TEXT NOT NULL DEFAULT 'fast',
  verdict TEXT DEFAULT '',
  breakdown JSONB DEFAULT '[]'::jsonb,
  community_signals JSONB DEFAULT '[]'::jsonb,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  data_sources JSONB DEFAULT '[]'::jsonb,
  confidence TEXT DEFAULT 'medium',
  brand TEXT DEFAULT '',
  pinned BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read public scans (for community feed & shared reports)
CREATE POLICY "Public scans are readable by everyone"
ON public.scans
FOR SELECT
USING (is_public = true);

-- Authenticated users can read their own scans (including non-public)
CREATE POLICY "Users can read their own scans"
ON public.scans
FOR SELECT
USING (auth.uid() = user_id);

-- Authenticated users can insert their own scans
CREATE POLICY "Users can insert their own scans"
ON public.scans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own scans (for pinning)
CREATE POLICY "Users can update their own scans"
ON public.scans
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own scans
CREATE POLICY "Users can delete their own scans"
ON public.scans
FOR DELETE
USING (auth.uid() = user_id);

-- Anonymous insert (for guest scans without user_id)
CREATE POLICY "Anyone can insert anonymous scans"
ON public.scans
FOR INSERT
WITH CHECK (user_id IS NULL);

-- Index for community feed queries
CREATE INDEX idx_scans_trust_score ON public.scans (trust_score DESC) WHERE is_public = true;
CREATE INDEX idx_scans_user_id ON public.scans (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_scans_created_at ON public.scans (created_at DESC);
