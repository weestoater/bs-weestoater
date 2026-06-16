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

    // Fetch entries with calculated target weight based on history
    // Using RPC to call get_target_weight_for_date for each entry
    let query = supabaseClient
      .from("slimming_world_entries")
      .select(
        `
        id,
        profile_id,
        entry_date,
        weight,
        weight_change,
        total_lost,
        slimmer_of_week,
        notes,
        created_at,
        updated_at
      `,
      )
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

    // For each entry, calculate the target weight that was active on that date
    const entriesWithTargets = await Promise.all(
      (data || []).map(async (entry) => {
        const { data: targetWeight, error: targetError } =
          await supabaseClient.rpc("get_target_weight_for_date", {
            p_profile_id: profileId,
            p_entry_date: entry.entry_date,
          });

        if (targetError) {
          console.error("Error calculating target weight:", targetError);
          // Fallback to null if function fails
          return { ...entry, target_weight: null };
        }

        return { ...entry, target_weight: targetWeight };
      }),
    );

    return entriesWithTargets;
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

  // ============================================================================
  // SLIMMING WORLD TARGET WEIGHT HISTORY OPERATIONS
  // ============================================================================

  /**
   * Get all target weight history entries for a profile
   * @param {string} profileId - Profile UUID
   * @param {Object} options - Query options
   * @param {string} [options.orderBy='effective_date'] - Field to order by
   * @param {boolean} [options.ascending=false] - Sort order
   * @returns {Promise<Array>} Array of target weight history entries
   */
  async function getTargetWeightHistory(profileId, options = {}) {
    const { orderBy = "effective_date", ascending = false } = options;

    const { data, error } = await supabaseClient
      .from("slimming_world_target_weights")
      .select("*")
      .eq("profile_id", profileId)
      .order(orderBy, { ascending });

    if (error) {
      console.error("Error fetching target weight history:", error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get the current (most recent) target weight for a profile
   * @param {string} profileId - Profile UUID
   * @returns {Promise<Object|null>} Most recent target weight entry or null
   */
  async function getCurrentTargetWeight(profileId) {
    const { data, error } = await supabaseClient
      .from("slimming_world_target_weights")
      .select("*")
      .eq("profile_id", profileId)
      .order("effective_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching current target weight:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get the target weight that was active on a specific date
   * Uses the database function for accurate historical lookup
   * @param {string} profileId - Profile UUID
   * @param {string} entryDate - Date to check (YYYY-MM-DD)
   * @returns {Promise<number>} Target weight value in lbs
   */
  async function getTargetWeightForDate(profileId, entryDate) {
    const { data, error } = await supabaseClient.rpc(
      "get_target_weight_for_date",
      {
        p_profile_id: profileId,
        p_entry_date: entryDate,
      },
    );

    if (error) {
      console.error("Error getting target weight for date:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new target weight entry
   * @param {Object} targetWeightData
   * @param {string} targetWeightData.profile_id - Profile UUID
   * @param {number} targetWeightData.target_weight - New target weight in lbs
   * @param {string} targetWeightData.effective_date - Date from which this target applies (YYYY-MM-DD)
   * @param {string} [targetWeightData.notes] - Optional reason for change
   * @returns {Promise<Object>} The created target weight entry
   */
  async function createTargetWeight(targetWeightData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_target_weights")
      .insert([targetWeightData])
      .select();

    if (error) {
      console.error("Error creating target weight:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing target weight entry
   * @param {string} id - Target weight entry ID
   * @param {Object} targetWeightData - Fields to update
   * @returns {Promise<Object>} The updated target weight entry
   */
  async function updateTargetWeight(id, targetWeightData) {
    const { data, error } = await supabaseClient
      .from("slimming_world_target_weights")
      .update(targetWeightData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating target weight:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a target weight entry
   * @param {string} id - Target weight entry ID
   * @returns {Promise<void>}
   */
  async function deleteTargetWeight(id) {
    const { error } = await supabaseClient
      .from("slimming_world_target_weights")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting target weight:", error);
      throw error;
    }
  }

  // ============================================================================
  // FOOTBALL OPERATIONS
  // ============================================================================

  /**
   * Get all football seasons
   * @param {Object} options - Query options
   * @param {boolean} [options.includeInactive=true] - Include inactive seasons
   * @returns {Promise<Array>} Array of season objects
   */
  async function getFootballSeasons(options = {}) {
    const { includeInactive = true } = options;

    let query = supabaseClient
      .from("football_seasons")
      .select("*")
      .order("start_year", { ascending: false });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching football seasons:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single season by season_id
   * @param {string} seasonId - Season ID (e.g., "2024-25")
   * @returns {Promise<Object|null>} Season object or null if not found
   */
  async function getFootballSeasonById(seasonId) {
    const { data, error } = await supabaseClient
      .from("football_seasons")
      .select("*")
      .eq("season_id", seasonId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching football season:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new football season
   * @param {Object} seasonData
   * @param {string} seasonData.season_id - Season ID (e.g., "2024-25")
   * @param {string} seasonData.display_name - Display name
   * @param {number} seasonData.start_year - Start year
   * @param {number} seasonData.end_year - End year
   * @param {boolean} [seasonData.is_active=false] - Active status
   * @returns {Promise<Object>} The created season
   */
  async function createFootballSeason(seasonData) {
    const { data, error } = await supabaseClient
      .from("football_seasons")
      .insert([seasonData])
      .select();

    if (error) {
      console.error("Error creating football season:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing football season
   * @param {string} seasonId - Season ID
   * @param {Object} seasonData - Fields to update
   * @returns {Promise<Object>} The updated season
   */
  async function updateFootballSeason(seasonId, seasonData) {
    const { data, error } = await supabaseClient
      .from("football_seasons")
      .update(seasonData)
      .eq("season_id", seasonId)
      .select();

    if (error) {
      console.error("Error updating football season:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a football season and all related data (CASCADE)
   * @param {string} seasonId - Season ID
   * @returns {Promise<void>}
   */
  async function deleteFootballSeason(seasonId) {
    const { error } = await supabaseClient
      .from("football_seasons")
      .delete()
      .eq("season_id", seasonId);

    if (error) {
      console.error("Error deleting football season:", error);
      throw error;
    }
  }

  /**
   * Get all matches for a season
   * @param {string} seasonId - Season ID
   * @param {Object} options - Query options
   * @param {boolean} [options.detailed=false] - Include goals and cards
   * @returns {Promise<Array>} Array of match objects
   */
  async function getFootballMatches(seasonId, options = {}) {
    const { detailed = false } = options;

    if (detailed) {
      // Use the detailed view
      const { data, error } = await supabaseClient
        .from("football_matches_detailed")
        .select("*")
        .eq("season_id", seasonId)
        .order("match_date", { ascending: false });

      if (error) {
        console.error("Error fetching detailed football matches:", error);
        throw error;
      }

      return data;
    }

    // Simple query
    const { data, error } = await supabaseClient
      .from("football_matches")
      .select("*")
      .eq("season_id", seasonId)
      .order("match_date", { ascending: false });

    if (error) {
      console.error("Error fetching football matches:", error);
      throw error;
    }

    return data;
  }

  /**
   * Get a single match by ID
   * @param {string} matchId - Match UUID
   * @param {Object} options - Query options
   * @param {boolean} [options.includeGoals=false] - Include goals
   * @param {boolean} [options.includeCards=false] - Include cards
   * @returns {Promise<Object|null>} Match object or null if not found
   */
  async function getFootballMatchById(matchId, options = {}) {
    const { includeGoals = false, includeCards = false } = options;

    const { data, error } = await supabaseClient
      .from("football_matches")
      .select("*")
      .eq("id", matchId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching football match:", error);
      throw error;
    }

    if (includeGoals || includeCards) {
      const match = { ...data };

      if (includeGoals) {
        const goals = await getFootballMatchGoals(matchId);
        match.goals = goals;
      }

      if (includeCards) {
        const cards = await getFootballMatchCards(matchId);
        match.cards = cards;
      }

      return match;
    }

    return data;
  }

  /**
   * Create a new football match
   * @param {Object} matchData
   * @param {string} matchData.season_id - Season ID
   * @param {string} matchData.match_date - Match date (YYYY-MM-DD)
   * @param {string} matchData.opposition - Opposition team name
   * @param {string} matchData.venue - Home or Away
   * @param {number} [matchData.goals_scored] - Goals scored
   * @param {number} [matchData.goals_conceded] - Goals conceded
   * @param {string} [matchData.league] - League/Competition name
   * @param {string} [matchData.video_url] - Video URL
   * @param {string} [matchData.iplayer_url] - iPlayer URL
   * @param {string} [matchData.notes] - Match notes
   * @returns {Promise<Object>} The created match
   */
  async function createFootballMatch(matchData) {
    const { data, error } = await supabaseClient
      .from("football_matches")
      .insert([matchData])
      .select();

    if (error) {
      console.error("Error creating football match:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing football match
   * @param {string} matchId - Match UUID
   * @param {Object} matchData - Fields to update
   * @returns {Promise<Object>} The updated match
   */
  async function updateFootballMatch(matchId, matchData) {
    const { data, error } = await supabaseClient
      .from("football_matches")
      .update(matchData)
      .eq("id", matchId)
      .select();

    if (error) {
      console.error("Error updating football match:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a football match and all related data (CASCADE)
   * @param {string} matchId - Match UUID
   * @returns {Promise<void>}
   */
  async function deleteFootballMatch(matchId) {
    const { error } = await supabaseClient
      .from("football_matches")
      .delete()
      .eq("id", matchId);

    if (error) {
      console.error("Error deleting football match:", error);
      throw error;
    }
  }

  /**
   * Get goals for a match
   * @param {string} matchId - Match UUID
   * @returns {Promise<Array>} Array of goal objects
   */
  async function getFootballMatchGoals(matchId) {
    const { data, error } = await supabaseClient
      .from("football_match_goals")
      .select("*")
      .eq("match_id", matchId)
      .order("minute", { ascending: true });

    if (error) {
      console.error("Error fetching match goals:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new goal for a match
   * @param {Object} goalData
   * @param {string} goalData.match_id - Match UUID
   * @param {string} goalData.player - Player name
   * @param {string} goalData.minute - Goal minute (can include "+3", "(Pen)", etc.)
   * @param {string} [goalData.assist] - Assist player name
   * @returns {Promise<Object>} The created goal
   */
  async function createFootballMatchGoal(goalData) {
    const { data, error } = await supabaseClient
      .from("football_match_goals")
      .insert([goalData])
      .select();

    if (error) {
      console.error("Error creating match goal:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing match goal
   * @param {string} goalId - Goal UUID
   * @param {Object} goalData - Fields to update
   * @returns {Promise<Object>} The updated goal
   */
  async function updateFootballMatchGoal(goalId, goalData) {
    const { data, error } = await supabaseClient
      .from("football_match_goals")
      .update(goalData)
      .eq("id", goalId)
      .select();

    if (error) {
      console.error("Error updating match goal:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a match goal
   * @param {string} goalId - Goal UUID
   * @returns {Promise<void>}
   */
  async function deleteFootballMatchGoal(goalId) {
    const { error } = await supabaseClient
      .from("football_match_goals")
      .delete()
      .eq("id", goalId);

    if (error) {
      console.error("Error deleting match goal:", error);
      throw error;
    }
  }

  /**
   * Get cards for a match
   * @param {string} matchId - Match UUID
   * @returns {Promise<Array>} Array of card objects
   */
  async function getFootballMatchCards(matchId) {
    const { data, error } = await supabaseClient
      .from("football_match_cards")
      .select("*")
      .eq("match_id", matchId)
      .order("minute", { ascending: true });

    if (error) {
      console.error("Error fetching match cards:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create a new card for a match
   * @param {Object} cardData
   * @param {string} cardData.match_id - Match UUID
   * @param {string} cardData.player - Player name
   * @param {string} cardData.card_type - "yellow" or "red"
   * @param {number} cardData.minute - Card minute
   * @returns {Promise<Object>} The created card
   */
  async function createFootballMatchCard(cardData) {
    const { data, error } = await supabaseClient
      .from("football_match_cards")
      .insert([cardData])
      .select();

    if (error) {
      console.error("Error creating match card:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Update an existing match card
   * @param {string} cardId - Card UUID
   * @param {Object} cardData - Fields to update
   * @returns {Promise<Object>} The updated card
   */
  async function updateFootballMatchCard(cardId, cardData) {
    const { data, error } = await supabaseClient
      .from("football_match_cards")
      .update(cardData)
      .eq("id", cardId)
      .select();

    if (error) {
      console.error("Error updating match card:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete a match card
   * @param {string} cardId - Card UUID
   * @returns {Promise<void>}
   */
  async function deleteFootballMatchCard(cardId) {
    const { error } = await supabaseClient
      .from("football_match_cards")
      .delete()
      .eq("id", cardId);

    if (error) {
      console.error("Error deleting match card:", error);
      throw error;
    }
  }

  /**
   * Get season statistics (top scorers)
   * @param {string} seasonId - Season ID
   * @returns {Promise<Array>} Array of player statistics
   */
  async function getFootballSeasonStats(seasonId) {
    const { data, error } = await supabaseClient
      .from("football_season_stats")
      .select("*")
      .eq("season_id", seasonId)
      .order("goals", { ascending: false })
      .order("assists", { ascending: false });

    if (error) {
      console.error("Error fetching season stats:", error);
      throw error;
    }

    return data;
  }

  /**
   * Create or update season statistics for a player
   * @param {Object} statsData
   * @param {string} statsData.season_id - Season ID
   * @param {string} statsData.player - Player name
   * @param {number} statsData.goals - Goals scored
   * @param {number} statsData.assists - Assists
   * @returns {Promise<Object>} The created/updated stats
   */
  async function upsertFootballSeasonStats(statsData) {
    const { data, error } = await supabaseClient
      .from("football_season_stats")
      .upsert([statsData], {
        onConflict: "season_id,player",
      })
      .select();

    if (error) {
      console.error("Error upserting season stats:", error);
      throw error;
    }

    return data[0];
  }

  /**
   * Delete season statistics for a player
   * @param {string} seasonId - Season ID
   * @param {string} player - Player name
   * @returns {Promise<void>}
   */
  async function deleteFootballSeasonStats(seasonId, player) {
    const { error } = await supabaseClient
      .from("football_season_stats")
      .delete()
      .eq("season_id", seasonId)
      .eq("player", player);

    if (error) {
      console.error("Error deleting season stats:", error);
      throw error;
    }
  }

  /**
   * Bulk insert football data for migration
   * @param {Object} bulkData
   * @param {Array} [bulkData.seasons] - Array of season objects
   * @param {Array} [bulkData.matches] - Array of match objects
   * @param {Array} [bulkData.goals] - Array of goal objects
   * @param {Array} [bulkData.cards] - Array of card objects
   * @param {Array} [bulkData.stats] - Array of stats objects
   * @returns {Promise<Object>} Results of bulk operations
   */
  async function bulkInsertFootballData(bulkData) {
    const results = {};

    if (bulkData.seasons && bulkData.seasons.length > 0) {
      const { data, error } = await supabaseClient
        .from("football_seasons")
        .upsert(bulkData.seasons, { onConflict: "season_id" })
        .select();

      if (error) {
        console.error("Error bulk inserting seasons:", error);
        throw error;
      }
      results.seasons = data;
    }

    if (bulkData.matches && bulkData.matches.length > 0) {
      const { data, error } = await supabaseClient
        .from("football_matches")
        .insert(bulkData.matches)
        .select();

      if (error) {
        console.error("Error bulk inserting matches:", error);
        throw error;
      }
      results.matches = data;
    }

    if (bulkData.goals && bulkData.goals.length > 0) {
      const { data, error } = await supabaseClient
        .from("football_match_goals")
        .insert(bulkData.goals)
        .select();

      if (error) {
        console.error("Error bulk inserting goals:", error);
        throw error;
      }
      results.goals = data;
    }

    if (bulkData.cards && bulkData.cards.length > 0) {
      const { data, error } = await supabaseClient
        .from("football_match_cards")
        .insert(bulkData.cards)
        .select();

      if (error) {
        console.error("Error bulk inserting cards:", error);
        throw error;
      }
      results.cards = data;
    }

    if (bulkData.stats && bulkData.stats.length > 0) {
      const { data, error } = await supabaseClient
        .from("football_season_stats")
        .upsert(bulkData.stats, { onConflict: "season_id,player" })
        .select();

      if (error) {
        console.error("Error bulk inserting stats:", error);
        throw error;
      }
      results.stats = data;
    }

    return results;
  }

  /**
   * Get all unique player names from goals and cards
   * @param {string} [seasonId] - Optional season ID to filter players
   * @returns {Promise<string[]>} Array of unique player names sorted alphabetically
   */
  async function getFootballPlayers(seasonId = null) {
    const players = new Set();

    // Build the select string with join to matches
    const selectString = seasonId
      ? "player, football_matches!inner(season_id)"
      : "player";

    // Get players from goals
    let goalsQuery = supabaseClient
      .from("football_match_goals")
      .select(selectString);

    if (seasonId) {
      goalsQuery = goalsQuery.eq("football_matches.season_id", seasonId);
    }

    const { data: goals, error: goalsError } = await goalsQuery;

    if (goalsError) {
      console.error("Error fetching goal scorers:", goalsError);
      throw goalsError;
    }

    goals?.forEach((g) => players.add(g.player));

    // Get players from assists
    let assistsQuery = supabaseClient
      .from("football_match_goals")
      .select(selectString.replace("player", "assist"))
      .not("assist", "is", null);

    if (seasonId) {
      assistsQuery = assistsQuery.eq("football_matches.season_id", seasonId);
    }

    const { data: assists, error: assistsError } = await assistsQuery;

    if (assistsError) {
      console.error("Error fetching assists:", assistsError);
      throw assistsError;
    }

    assists?.forEach((a) => {
      if (a.assist) players.add(a.assist);
    });

    // Get players from cards
    let cardsQuery = supabaseClient
      .from("football_match_cards")
      .select(selectString);

    if (seasonId) {
      cardsQuery = cardsQuery.eq("football_matches.season_id", seasonId);
    }

    const { data: cards, error: cardsError } = await cardsQuery;

    if (cardsError) {
      console.error("Error fetching card recipients:", cardsError);
      throw cardsError;
    }

    cards?.forEach((c) => players.add(c.player));

    // Convert to array and sort alphabetically
    return Array.from(players).sort((a, b) => a.localeCompare(b));
  }

  /**
   * Get complete season data with matches and stats
   * @param {string} seasonId - Season ID
   * @returns {Promise<Object|null>} Season with matches and stats
   */
  async function getFootballSeasonComplete(seasonId) {
    // Get season info
    const season = await getFootballSeasonById(seasonId);

    if (!season) {
      return null;
    }

    // Get matches with details
    const matches = await getFootballMatches(seasonId, { detailed: true });

    // Get season stats
    const stats = await getFootballSeasonStats(seasonId);

    return {
      ...season,
      matches,
      topScorers: stats,
    };
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
    // Slimming World Target Weights
    getTargetWeightHistory,
    getCurrentTargetWeight,
    getTargetWeightForDate,
    createTargetWeight,
    updateTargetWeight,
    deleteTargetWeight,
    // Football
    getFootballSeasons,
    getFootballSeasonById,
    createFootballSeason,
    updateFootballSeason,
    deleteFootballSeason,
    getFootballMatches,
    getFootballMatchById,
    createFootballMatch,
    updateFootballMatch,
    deleteFootballMatch,
    getFootballMatchGoals,
    createFootballMatchGoal,
    updateFootballMatchGoal,
    deleteFootballMatchGoal,
    getFootballMatchCards,
    createFootballMatchCard,
    updateFootballMatchCard,
    deleteFootballMatchCard,
    getFootballSeasonStats,
    upsertFootballSeasonStats,
    deleteFootballSeasonStats,
    bulkInsertFootballData,
    getFootballPlayers,
    getFootballSeasonComplete,
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
