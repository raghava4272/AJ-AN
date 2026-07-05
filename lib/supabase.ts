import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type Portfolio = {
  id: string;
  title: string;
  image_url: string;
  video_url?: string;
  description?: string;
  category: string;
  is_featured?: boolean;
  created_at: string;
};
