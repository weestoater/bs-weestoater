/**
 * BS WeeStaater Database Operations
 * Provides database access layer for books content
 * This module can be used with any Supabase client instance
 */

/**
 * Creates database service with the provided Supabase client
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @returns {Object} Database service methods
 */
export function createDatabaseService(supabaseClient) {
  // ============================================================================
  // BOOKS OPERATIONS
  // ============================================================================

  /**
   * Get all published books
   * @param {Object} options - Query options
   * @param {boolean} [options.includeUnpublished=false] - Include unpublished books
   * @returns {Promise<Array>} Array of book objects
   */
  async function getBooks(options = {}) {
    const { includeUnpublished = false } = options;

    let query = supabaseClient
      .from("books")
      .select("*")
      .order("order_index", { ascending: true });

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching books:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single book by ID
   * @param {string} id - Book ID
   * @returns {Promise<Object|null>} Book object or null if not found
   */
  async function getBookById(id) {
    const { data, error } = await supabaseClient
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      console.error("Error fetching book:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new book
   * @param {Object} bookData
   * @param {string} bookData.id - Unique book ID (slug)
   * @param {string} bookData.title - Book title
   * @param {string} bookData.author - Author name
   * @param {string} bookData.cover_image - Cover image URL
   * @param {string} bookData.description - HTML description
   * @param {number} [bookData.order_index=0] - Order for display
   * @param {boolean} [bookData.published=true] - Published status
   * @returns {Promise<Object>} The created book
   */
  async function createBook(bookData) {
    const { data, error } = await supabaseClient
      .from("books")
      .insert([
        {
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          cover_image: bookData.cover_image,
          description: bookData.description,
          order_index: bookData.order_index || 0,
          published:
            bookData.published !== undefined ? bookData.published : true,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating book:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing book
   * @param {string} id - Book ID
   * @param {Object} bookData - Fields to update
   * @returns {Promise<Object>} The updated book
   */
  async function updateBook(id, bookData) {
    const { data, error } = await supabaseClient
      .from("books")
      .update(bookData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating book:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a book by ID
   * @param {string} id - Book ID
   */
  async function deleteBook(id) {
    const { error } = await supabaseClient.from("books").delete().eq("id", id);

    if (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  /**
   * Bulk insert books (useful for migrations)
   * @param {Array<Object>} books - Array of book objects
   * @returns {Promise<Array>} Array of created book objects
   */
  async function bulkInsertBooks(books) {
    const { data, error } = await supabaseClient
      .from("books")
      .insert(books)
      .select();

    if (error) {
      console.error("Error bulk inserting books:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update book order
   * @param {Array<{id: string, order_index: number}>} orderUpdates
   */
  async function updateBooksOrder(orderUpdates) {
    const promises = orderUpdates.map(({ id, order_index }) =>
      updateBook(id, { order_index }),
    );

    await Promise.all(promises);
  }

  // Return all database service methods
  return {
    // Books
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    bulkInsertBooks,
    updateBooksOrder,
  };
}

/**
 * Create a database service instance from environment variables
 * @param {import('@supabase/supabase-js').SupabaseClient} [client] - Optional Supabase client
 * @returns {Object} Database service methods
 */
export function createDatabaseServiceFromEnv(client = null) {
  if (!client) {
    throw new Error(
      "Supabase client is required. Import and pass a client instance.",
    );
  }
  return createDatabaseService(client);
}

/**
 * Export a default function that creates the service
 */
export default createDatabaseService;
