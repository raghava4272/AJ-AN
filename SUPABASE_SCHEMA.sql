-- Create portfolio table
CREATE TABLE portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read access" ON portfolio
  FOR SELECT USING (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);

-- Storage public read policy
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

-- Create index
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_created_at ON portfolio(created_at DESC);
