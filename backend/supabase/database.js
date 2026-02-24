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

  // ============================================================================
  // ARTICLES OPERATIONS
  // ============================================================================

  /**
   * Get all articles with optional filtering
   * @param {Object} options - Query options
   * @param {boolean} [options.includeUnpublished=false] - Include unpublished articles
   * @param {string} [options.category] - Filter by category
   * @param {boolean} [options.featuredOnly=false] - Only featured articles
   * @returns {Promise<Array>} Array of article objects
   */
  async function getArticles(options = {}) {
    const {
      includeUnpublished = false,
      category,
      featuredOnly = false,
    } = options;

    let query = supabaseClient
      .from("articles")
      .select("*")
      .order("published_date", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("published", true);
      // For published articles, also check that publish_at is either null (immediate) or in the past
      query = query.or(
        "publish_at.is.null,publish_at.lte." + new Date().toISOString(),
      );
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (featuredOnly) {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single article by ID
   * @param {string} id - Article ID
   * @returns {Promise<Object|null>} Article object or null if not found
   */
  async function getArticleById(id) {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching article:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single article by slug
   * @param {string} slug - Article slug
   * @returns {Promise<Object|null>} Article object or null if not found
   */
  async function getArticleBySlug(slug) {
    let query = supabaseClient
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("published", true);

    // Also check that publish_at is either null (immediate) or in the past
    query = query.or(
      "publish_at.is.null,publish_at.lte." + new Date().toISOString(),
    );

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching article:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new article
   * @param {Object} articleData - Article data
   * @returns {Promise<Object>} The created article
   */
  async function createArticle(articleData) {
    const { data, error } = await supabaseClient
      .from("articles")
      .insert([articleData])
      .select();

    if (error) {
      console.error("Error creating article:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing article
   * @param {string} id - Article ID
   * @param {Object} articleData - Fields to update
   * @returns {Promise<Object>} The updated article
   */
  async function updateArticle(id, articleData) {
    const { data, error } = await supabaseClient
      .from("articles")
      .update(articleData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating article:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete an article by ID
   * @param {string} id - Article ID
   */
  async function deleteArticle(id) {
    const { error } = await supabaseClient
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  }

  /**
   * Bulk insert articles (useful for migrations)
   * @param {Array<Object>} articles - Array of article objects
   * @returns {Promise<Array>} Array of created article objects
   */
  async function bulkInsertArticles(articles) {
    const { data, error } = await supabaseClient
      .from("articles")
      .insert(articles)
      .select();

    if (error) {
      console.error("Error bulk inserting articles:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get articles by tags
   * @param {Array<string>} tags - Array of tags to search for
   * @returns {Promise<Array>} Array of article objects
   */
  async function getArticlesByTags(tags) {
    const { data, error } = await supabaseClient
      .from("articles")
      .select("*")
      .contains("tags", tags)
      .eq("published", true)
      .order("published_date", { ascending: false });

    if (error) {
      console.error("Error fetching articles by tags:", error);
      throw error;
    }

    return data;
  }

  // ============================================================================
  // SLIMMING WORLD OPERATIONS
  // ============================================================================

  /**
   * Get all Slimming World profiles
   * @param {Object} options - Query options
   * @param {boolean} [options.includeInactive=false] - Include inactive profiles
   * @returns {Promise<Array>} Array of profile objects
   */
  async function getSlimmingWorldProfiles(options = {}) {
    const { includeInactive = false } = options;

    let query = supabaseClient
      .from("slimming_world_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching Slimming World profiles:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single Slimming World profile by user_id
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Profile object or null if not found
   */
  async function getSlimmingWorldProfileByUserId(userId) {
    const { data, error } = await supabaseClient
      .from("slimming_world_profiles")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching Slimming World profile:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single Slimming World profile by ID
   * @param {string} id - Profile UUID
   * @returns {Promise<Object|null>} Profile object or null if not found
   */
  async function getSlimmingWorldProfileById(id) {
    const { data, error } = await supabaseClient
      .from("slimming_world_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching Slimming World profile:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new Slimming World profile
   * @param {Object} profileData
   * @param {string} profileData.user_id - Unique user identifier
   * @param {string} profileData.start_date - Start date (YYYY-MM-DD)
   * @param {number} profileData.start_weight - Starting weight in lbs
   * @param {number} profileData.target_weight - Target weight in lbs
   * @param {boolean} [profileData.is_active=true] - Active status
   * @returns {Promise<Object>} The created profile
   */
  async function createSlimmingWorldProfile(profileData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_profiles")
      .insert([
        {
          user_id: profileData.user_id,
          start_date: profileData.start_date,
          start_weight: profileData.start_weight,
          target_weight: profileData.target_weight,
          is_active:
            profileData.is_active !== undefined ? profileData.is_active : true,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating Slimming World profile:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing Slimming World profile
   * @param {string} id - Profile ID
   * @param {Object} profileData - Fields to update
   * @returns {Promise<Object>} The updated profile
   */
  async function updateSlimmingWorldProfile(id, profileData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_profiles")
      .update(profileData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating Slimming World profile:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a Slimming World profile by ID (cascade deletes entries)
   * @param {string} id - Profile ID
   */
  async function deleteSlimmingWorldProfile(id) {
    const { error } = await supabaseClient
      .from("slimming_world_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting Slimming World profile:", error);
      throw error;
    }
  }

  /**
   * Get all entries for a specific profile
   * @param {string} profileId - Profile UUID
   * @param {Object} options - Query options
   * @param {number} [options.limit] - Limit number of results
   * @param {string} [options.orderBy='entry_date'] - Field to order by
   * @param {boolean} [options.ascending=true] - Sort order
   * @returns {Promise<Array>} Array of entry objects
   */
  async function getSlimmingWorldEntries(profileId, options = {}) {
    const { limit, orderBy = "entry_date", ascending = true } = options;

    let query = supabaseClient
      .from("slimming_world_entries")
      .select("*")
      .eq("profile_id", profileId)
      .order(orderBy, { ascending });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching Slimming World entries:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single entry by ID
   * @param {string} id - Entry UUID
   * @returns {Promise<Object|null>} Entry object or null if not found
   */
  async function getSlimmingWorldEntryById(id) {
    const { data, error } = await supabaseClient
      .from("slimming_world_entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching Slimming World entry:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get the latest entry for a profile
   * @param {string} profileId - Profile UUID
   * @returns {Promise<Object|null>} Latest entry object or null
   */
  async function getLatestSlimmingWorldEntry(profileId) {
    const { data, error } = await supabaseClient
      .from("slimming_world_entries")
      .select("*")
      .eq("profile_id", profileId)
      .order("entry_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching latest Slimming World entry:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new Slimming World entry
   * @param {Object} entryData
   * @param {string} entryData.profile_id - Profile UUID
   * @param {string} entryData.entry_date - Entry date (YYYY-MM-DD)
   * @param {number} entryData.weight - Weight in lbs
   * @param {number} [entryData.weight_change=0] - Change from previous entry
   * @param {number} [entryData.total_lost=0] - Total weight lost
   * @param {number} entryData.target_weight - Target weight
   * @param {number} [entryData.slimmer_of_week] - SOTW marker (100 if awarded)
   * @param {string} [entryData.notes] - Optional notes
   * @returns {Promise<Object>} The created entry
   */
  async function createSlimmingWorldEntry(entryData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_entries")
      .insert([entryData])
      .select();

    if (error) {
      console.error("Error creating Slimming World entry:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing Slimming World entry
   * @param {string} id - Entry ID
   * @param {Object} entryData - Fields to update
   * @returns {Promise<Object>} The updated entry
   */
  async function updateSlimmingWorldEntry(id, entryData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_entries")
      .update(entryData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating Slimming World entry:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a Slimming World entry by ID
   * @param {string} id - Entry ID
   */
  async function deleteSlimmingWorldEntry(id) {
    const { error } = await supabaseClient
      .from("slimming_world_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting Slimming World entry:", error);
      throw error;
    }
  }

  /**
   * Bulk insert Slimming World entries (useful for migrations)
   * @param {Array<Object>} entries - Array of entry objects
   * @returns {Promise<Array>} Array of created entry objects
   */
  async function bulkInsertSlimmingWorldEntries(entries) {
    const { data, error } = await supabaseClient
      .from("slimming_world_entries")
      .insert(entries)
      .select();

    if (error) {
      console.error("Error bulk inserting Slimming World entries:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get complete profile with all entries
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Profile with nested entries array
   */
  async function getSlimmingWorldProfileWithEntries(userId) {
    // First get the profile
    const profile = await getSlimmingWorldProfileByUserId(userId);

    if (!profile) {
      return null;
    }

    // Then get all entries for this profile
    const entries = await getSlimmingWorldEntries(profile.id, {
      orderBy: "entry_date",
      ascending: true,
    });

    return {
      ...profile,
      entries,
    };
  }

  /**
   * Get profile statistics from the view
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Profile statistics
   */
  async function getSlimmingWorldProfileStats(userId) {
    const { data, error } = await supabaseClient
      .from("slimming_world_profile_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching Slimming World profile stats:", error);
      throw error;
    }

    return data;
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
    // Articles
    getArticles,
    getArticleById,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    bulkInsertArticles,
    getArticlesByTags,
    // Slimming World
    getSlimmingWorldProfiles,
    getSlimmingWorldProfileByUserId,
    getSlimmingWorldProfileById,
    createSlimmingWorldProfile,
    updateSlimmingWorldProfile,
    deleteSlimmingWorldProfile,
    getSlimmingWorldEntries,
    getSlimmingWorldEntryById,
    getLatestSlimmingWorldEntry,
    createSlimmingWorldEntry,
    updateSlimmingWorldEntry,
    deleteSlimmingWorldEntry,
    bulkInsertSlimmingWorldEntries,
    getSlimmingWorldProfileWithEntries,
    getSlimmingWorldProfileStats,
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
