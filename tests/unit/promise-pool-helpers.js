/**
 * Promise Pool Helper Functions
 * Easy-to-use functions for managing promises in tests
 */

// Setup function for individual test files
export const setupPromisePool = () => {
  const promisePool = global.promisePool

  beforeEach(() => {
    promisePool.clearAll()
  })

  afterEach(async () => {
    // Flush any pending promises before cleanup
    await promisePool.flushPendingPromises()
  })
}

// Individual test wrapper for more control
export const withPromiseCleanup = (testFn) => {
  return async (...args) => {
    const promisePool = global.promisePool
    promisePool.clearAll()

    try {
      const result = await testFn(...args)
      await promisePool.flushPendingPromises()
      return result
    } catch (error) {
      await promisePool.flushPendingPromises()
      throw error
    }
  }
}

// Get promise statistics
export const getPromiseStats = () => {
  return global.promisePool.getStats()
}

// Manual cleanup function
export const flushPromises = async () => {
  await global.promisePool.flushPendingPromises()
}

// Clear all promise tracking
export const clearPromises = () => {
  global.promisePool.clearAll()
}
