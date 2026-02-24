import {
  setupPromisePool,
  withPromiseCleanup,
  getPromiseStats,
  flushPromises,
  clearPromises
} from './promise-pool-helpers'

describe('promise-pool-helpers', () => {
  describe('getPromiseStats', () => {
    it('returns stats from global promisePool', () => {
      const stats = getPromiseStats()
      expect(stats).toHaveProperty('active')
      expect(stats).toHaveProperty('completed')
      expect(stats).toHaveProperty('rejected')
    })
  })

  describe('flushPromises', () => {
    it('flushes pending promises', async () => {
      await flushPromises()
    })
  })

  describe('clearPromises', () => {
    it('clears all promise tracking', () => {
      clearPromises()
      const stats = getPromiseStats()
      expect(stats.active).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.rejected).toBe(0)
    })
  })

  describe('withPromiseCleanup', () => {
    it('flushes and rethrows on error', async () => {
      clearPromises()
      const wrapped = withPromiseCleanup(() => {
        throw new Error('test error')
      })
      await expect(wrapped()).rejects.toThrow('test error')
    })
  })

  describe('setupPromisePool', () => {
    it('registers beforeEach and afterEach', () => {
      expect(() => setupPromisePool()).not.toThrow()
    })

    it('works when used in describe', () => {
      setupPromisePool()
      expect(global.promisePool).toBeDefined()
    })
  })
})
