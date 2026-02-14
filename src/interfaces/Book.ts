/**
 * Book interface for content from Supabase
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  cover_image: string;
  description: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}
