/**
 * TypeScript types for weeCMS
 * Matches backend types from backend/index.d.ts
 */

export interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  icon?: string;
  page: string;
  section?: string;
  content_type: "card" | "hero" | "text" | "embed" | "custom";
  order_index: number;
  grid_size: string;
  published: boolean;
  publish_at?: string;
  unpublish_at?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  parent_id?: string;
  icon?: string;
  order_index: number;
  visible: boolean;
  require_auth: boolean;
  allowed_roles?: string[];
  external: boolean;
  new_window: boolean;
  created_at: string;
  updated_at: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  id: string;
  site_name: string;
  site_tagline?: string;
  site_description?: string;
  logo_url?: string;
  favicon_url?: string;
  email?: string;
  social_links: Record<string, string>;
  default_og_image?: string;
  google_analytics_id?: string;
  google_site_verification?: string;
  enable_search: boolean;
  enable_comments: boolean;
  maintenance_mode: boolean;
  maintenance_message?: string;
  default_theme: "light" | "dark" | "high-contrast" | "gov-uk";
  allowed_themes: string[];
  footer_text?: string;
  footer_links: unknown[];
  updated_at: string;
  updated_by?: string;
}

export interface MediaLibraryItem {
  id: string;
  filename: string;
  original_filename: string;
  file_type: "image" | "video" | "document" | "audio" | "other";
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_bucket: string;
  public_url: string;
  width?: number;
  height?: number;
  alt_text?: string;
  folder?: string;
  tags?: string[];
  used_in_tables?: string[];
  usage_count: number;
  uploaded_by?: string;
  created_at: string;
}
