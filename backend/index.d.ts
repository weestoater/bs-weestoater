/**
 * TypeScript declarations for BS WeeStaater Backend
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: Record<string, any>;
}

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

export interface DatabaseService {
  getBooks(options?: { includeUnpublished?: boolean }): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  createBook(bookData: Partial<Book>): Promise<Book>;
  updateBook(id: string, bookData: Partial<Book>): Promise<Book>;
  deleteBook(id: string): Promise<void>;
  bulkInsertBooks(books: Partial<Book>[]): Promise<Book[]>;
  updateBooksOrder(
    orderUpdates: Array<{ id: string; order_index: number }>,
  ): Promise<void>;
}

// Configuration
export function validateConfig(config: SupabaseConfig): void;
export function loadConfigFromEnv(): SupabaseConfig;
export function createConfig(config?: SupabaseConfig | null): SupabaseConfig;
export function debugConfig(config: SupabaseConfig): void;

// Client factory
export function createSupabaseClient(
  config?: SupabaseConfig | null,
  debug?: boolean,
): SupabaseClient;
export function getSupabaseClient(
  config?: SupabaseConfig | null,
  debug?: boolean,
): SupabaseClient;
export function resetSupabaseClient(): void;
export function createSupabaseClientFromEnv(debug?: boolean): SupabaseClient;

// Database service
export function createDatabaseService(
  supabaseClient: SupabaseClient,
): DatabaseService;
export function createDatabaseServiceFromEnv(
  client?: SupabaseClient | null,
): DatabaseService;

// Default export - get Supabase client singleton
declare const getSupabaseClientDefault: typeof getSupabaseClient;
export default getSupabaseClientDefault;
