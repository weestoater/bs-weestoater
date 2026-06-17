/**
 * Generic CRUD Service for Supabase
 * Provides reusable database operations to reduce code duplication
 */

/**
 * Standard error handler for database operations
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation
 * @param {string} tableName - Name of the table
 * @throws {Error} The original error after logging
 */
function handleError(error, operation, tableName) {
  if (error.code === "PGRST116") {
    // Not found - return null instead of throwing
    return null;
  }
  console.error(`Error ${operation} in ${tableName}:`, error);
  throw error;
}

/**
 * Creates a generic CRUD service for a specific table
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @param {string} tableName - Name of the database table
 * @param {Object} options - Configuration options
 * @param {string} [options.idField='id'] - Name of the ID field
 * @param {string} [options.orderByField] - Default field to order by
 * @param {boolean} [options.orderAscending=true] - Default sort order
 * @returns {Object} CRUD service methods
 */
export function createCrudService(supabaseClient, tableName, options = {}) {
  const { idField = "id", orderByField, orderAscending = true } = options;

  /**
   * Get all records with optional filtering and ordering
   * @param {Object} queryOptions - Query options
   * @param {string} [queryOptions.orderBy] - Field to order by
   * @param {boolean} [queryOptions.ascending] - Sort order
   * @param {number} [queryOptions.limit] - Limit number of results
   * @param {Object} [queryOptions.filters] - Key-value pairs for equality filters
   * @param {string} [queryOptions.select='*'] - Fields to select
   * @returns {Promise<Array>} Array of records
   */
  async function getAll(queryOptions = {}) {
    const {
      orderBy = orderByField,
      ascending = orderAscending,
      limit,
      filters = {},
      select = "*",
    } = queryOptions;

    let query = supabaseClient.from(tableName).select(select);

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return handleError(error, "fetching all", tableName);
    }

    return data;
  }

  /**
   * Get a single record by ID
   * @param {string|number} id - Record ID
   * @param {string} [select='*'] - Fields to select
   * @returns {Promise<Object|null>} Record object or null if not found
   */
  async function getById(id, select = "*") {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select(select)
      .eq(idField, id)
      .single();

    if (error) {
      return handleError(error, `fetching by ${idField}`, tableName);
    }

    return data;
  }

  /**
   * Get a single record by any field
   * @param {string} field - Field name to query
   * @param {any} value - Value to match
   * @param {string} [select='*'] - Fields to select
   * @returns {Promise<Object|null>} Record object or null if not found
   */
  async function getByField(field, value, select = "*") {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select(select)
      .eq(field, value)
      .single();

    if (error) {
      return handleError(error, `fetching by ${field}`, tableName);
    }

    return data;
  }

  /**
   * Get multiple records by a field value
   * @param {string} field - Field name to query
   * @param {any} value - Value to match
   * @param {Object} queryOptions - Additional query options
   * @returns {Promise<Array>} Array of matching records
   */
  async function getAllByField(field, value, queryOptions = {}) {
    return getAll({
      ...queryOptions,
      filters: { ...queryOptions.filters, [field]: value },
    });
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} The created record
   */
  async function create(data) {
    const { data: result, error } = await supabaseClient
      .from(tableName)
      .insert([data])
      .select();

    if (error) {
      console.error(`Error creating in ${tableName}:`, error);
      throw error;
    }

    return result[0];
  }

  /**
   * Update an existing record
   * @param {string|number} id - Record ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} The updated record
   */
  async function update(id, data) {
    const { data: result, error } = await supabaseClient
      .from(tableName)
      .update(data)
      .eq(idField, id)
      .select();

    if (error) {
      console.error(`Error updating in ${tableName}:`, error);
      throw error;
    }

    return result[0];
  }

  /**
   * Delete a record by ID
   * @param {string|number} id - Record ID
   * @returns {Promise<void>}
   */
  async function remove(id) {
    const { error } = await supabaseClient
      .from(tableName)
      .delete()
      .eq(idField, id);

    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Bulk insert multiple records
   * @param {Array<Object>} records - Array of record objects
   * @returns {Promise<Array>} Array of created records
   */
  async function bulkInsert(records) {
    const { data, error } = await supabaseClient
      .from(tableName)
      .insert(records)
      .select();

    if (error) {
      console.error(`Error bulk inserting into ${tableName}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Count records with optional filters
   * @param {Object} filters - Key-value pairs for equality filters
   * @returns {Promise<number>} Count of matching records
   */
  async function count(filters = {}) {
    let query = supabaseClient
      .from(tableName)
      .select("*", { count: "exact", head: true });

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { count: result, error } = await query;

    if (error) {
      console.error(`Error counting in ${tableName}:`, error);
      throw error;
    }

    return result;
  }

  return {
    getAll,
    getById,
    getByField,
    getAllByField,
    create,
    update,
    remove,
    bulkInsert,
    count,
    // Expose table name for custom queries
    tableName,
    supabaseClient,
  };
}

/**
 * Helper to create multiple CRUD services at once
 * @param {import('@supabase/supabase-js').SupabaseClient} supabaseClient
 * @param {Object} tableConfigs - Object mapping service names to table configurations
 * @returns {Object} Object with all CRUD services
 *
 * @example
 * const services = createCrudServices(supabase, {
 *   books: { tableName: 'books', orderByField: 'order_index' },
 *   articles: { tableName: 'articles', orderByField: 'published_date', orderAscending: false }
 * });
 * // Use as: services.books.getAll()
 */
export function createCrudServices(supabaseClient, tableConfigs) {
  const services = {};

  Object.entries(tableConfigs).forEach(([serviceName, config]) => {
    const { tableName, ...options } = config;
    services[serviceName] = createCrudService(
      supabaseClient,
      tableName,
      options,
    );
  });

  return services;
}
