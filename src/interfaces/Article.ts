export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  icon?: string;
  published_date: string;
  updated_date?: string;
  reading_time?: number;
  tags: string[];
  published: boolean;
  featured: boolean;
  author: string;
  order_index: number;
  publish_at?: string; // Optional: schedule publishing for future date/time
  created_at?: string;
  updated_at?: string;
}
