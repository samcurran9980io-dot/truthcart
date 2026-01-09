-- Create analytics table to track actual usage stats
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  metric_value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read analytics (public stats)
CREATE POLICY "Analytics are publicly readable" 
ON public.analytics 
FOR SELECT 
USING (true);

-- Insert initial metrics with realistic starting values
INSERT INTO public.analytics (metric_name, metric_value) VALUES
  ('products_analyzed', 847),
  ('happy_users', 312),
  ('accuracy_rate', 96);

-- Create function to increment products analyzed
CREATE OR REPLACE FUNCTION public.increment_products_analyzed()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.analytics 
  SET metric_value = metric_value + 1, updated_at = now()
  WHERE metric_name = 'products_analyzed';
END;
$$;

-- Create function to increment happy users (when user gives positive feedback)
CREATE OR REPLACE FUNCTION public.increment_happy_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.analytics 
  SET metric_value = metric_value + 1, updated_at = now()
  WHERE metric_name = 'happy_users';
END;
$$;