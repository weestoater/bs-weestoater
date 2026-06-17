import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Options for useDataFetch hook
 */
export interface UseDataFetchOptions<T> {
  /**
   * Cache the result with a TTL (time-to-live) in milliseconds
   * Set to 0 to disable caching
   */
  cacheTTL?: number;

  /**
   * Cache key for storing/retrieving cached data
   * Required if cacheTTL is set
   */
  cacheKey?: string;

  /**
   * Initial data to use before fetch completes
   */
  initialData?: T;

  /**
   * Skip the initial fetch on mount
   * Useful when you want to manually trigger the fetch
   */
  skip?: boolean;

  /**
   * Callback fired on successful fetch
   */
  onSuccess?: (data: T) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: Error) => void;
}

/**
 * Result type for useDataFetch hook
 */
export interface UseDataFetchResult<T> {
  /** The fetched data */
  data: T | null;

  /** Loading state */
  loading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Manually trigger a refetch */
  refetch: () => Promise<void>;

  /** Clear the error state */
  clearError: () => void;

  /** Set data manually */
  setData: (data: T | null) => void;
}

/**
 * Simple in-memory cache for fetch results
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Custom hook for data fetching with loading/error states
 *
 * Handles the common pattern of:
 * - useState for data/loading/error
 * - useEffect for fetching
 * - Optional caching with TTL
 * - Cleanup for unmounted components
 *
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useDataFetch(
 *   async () => {
 *     const supabase = getSupabaseClient();
 *     const db = createDatabaseService(supabase);
 *     return await db.getBooks();
 *   },
 *   { cacheTTL: 5 * 60 * 1000, cacheKey: 'books' }
 * );
 * ```
 */
export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseDataFetchOptions<T> = {},
): UseDataFetchResult<T> {
  const {
    cacheTTL = 0,
    cacheKey,
    initialData = null,
    skip = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fetchRef = useRef(fetchFn);

  // Update fetch function ref when it changes
  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchData = useCallback(async () => {
    // Check cache first
    if (cacheTTL > 0 && cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        if (mountedRef.current) {
          setData(cached.data as T);
          setLoading(false);
          setError(null);
        }
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchRef.current();

      if (mountedRef.current) {
        setData(result);
        setError(null);

        // Store in cache
        if (cacheTTL > 0 && cacheKey) {
          cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setData(null);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [cacheTTL, cacheKey, onSuccess, onError]);

  // Fetch data on mount (unless skip is true)
  useEffect(() => {
    if (!skip) {
      fetchData();
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, [skip, fetchData]); // Only re-run if skip or fetchData changes

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    clearError,
    setData,
  };
}

/**
 * Clear all cached data
 */
export function clearDataFetchCache() {
  cache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearDataFetchCacheKey(key: string) {
  cache.delete(key);
}
