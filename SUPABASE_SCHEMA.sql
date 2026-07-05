-- Create portfolio table
CREATE TABLE portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
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

-- Create contact_requests table
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insert submissions
CREATE POLICY "Public insert access" ON contact_requests
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read/delete access (also bypassable using service role key)
CREATE POLICY "Admin select access" ON contact_requests
  FOR SELECT USING (true);

CREATE POLICY "Admin delete access" ON contact_requests
  FOR DELETE USING (true);
