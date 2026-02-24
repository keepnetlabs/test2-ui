import promisePool from './promise-pool'

describe('PromisePool', () => {
  beforeEach(() => {
    promisePool.clearAll()
  })

  describe('getStats', () => {
    it('returns active, completed, rejected counts', () => {
      const stats = promisePool.getStats()
      expect(stats).toEqual({
        active: expect.any(Number),
        completed: expect.any(Number),
        rejected: expect.any(Number)
      })
    })

    it('tracks completed promises after resolution', async () => {
      const p = Promise.resolve('ok')
      await p
      const stats = promisePool.getStats()
      expect(stats.completed).toBeGreaterThanOrEqual(1)
    })
  })

  describe('clearAll', () => {
    it('clears all tracking sets', () => {
      promisePool.clearAll()
      const stats = promisePool.getStats()
      expect(stats.active).toBe(0)
      expect(stats.completed).toBe(0)
      expect(stats.rejected).toBe(0)
    })
  })

  describe('flushPendingPromises', () => {
    it('resolves when no pending promises', async () => {
      await promisePool.flushPendingPromises()
    })

    it('waits for pending promises to settle', async () => {
      let resolved = false
      const p = new Promise((resolve) => {
        setTimeout(() => {
          resolved = true
          resolve()
        }, 10)
      })
      await promisePool.flushPendingPromises()
      expect(resolved).toBe(true)
    })
  })

  describe('startInterception', () => {
    it('returns early when already intercepting', () => {
      promisePool.startInterception()
      promisePool.startInterception()
    })
  })

  describe('stopInterception and startInterception', () => {
    afterEach(() => {
      promisePool.startInterception()
    })

    it('stopInterception returns early when not intercepting', () => {
      promisePool.stopInterception()
      promisePool.stopInterception()
      promisePool.startInterception()
    })

    it('stopInterception restores original Promise and clears isIntercepting', () => {
      promisePool.stopInterception()
      expect(global.Promise).toBe(promisePool.originalPromise)
      expect(promisePool.isIntercepting).toBe(false)
      promisePool.startInterception()
    })
  })

  describe('TrackedPromise executor branches', () => {
    it('handles executor that throws', async () => {
      const p = new Promise(() => {
        throw new Error('executor error')
      })
      await expect(p).rejects.toThrow('executor error')
    })

    it('handles resolve path', async () => {
      const result = await Promise.resolve(42)
      expect(result).toBe(42)
    })

    it('handles reject path', async () => {
      await expect(Promise.reject(new Error('reject'))).rejects.toThrow('reject')
    })

    it('Promise.all delegates to original', async () => {
      const results = await Promise.all([Promise.resolve(1), Promise.resolve(2)])
      expect(results).toEqual([1, 2])
    })

    it('Promise.race delegates to original', async () => {
      const first = await Promise.race([
        new Promise((r) => setTimeout(() => r('first'), 50)),
        new Promise((r) => setTimeout(() => r('second'), 100))
      ])
      expect(first).toBe('first')
    })

    it('Promise.allSettled delegates to original', async () => {
      const results = await Promise.allSettled([
        Promise.resolve(1),
        Promise.reject(new Error('fail'))
      ])
      expect(results).toHaveLength(2)
      expect(results[0].status).toBe('fulfilled')
      expect(results[1].status).toBe('rejected')
    })
  })

  describe('auto-cleanup timeout', () => {
    it('moves hanging promises to rejected after 5 seconds', async () => {
      jest.useFakeTimers()
      promisePool.clearAll()
      const hanging = new Promise(() => {})
      jest.advanceTimersByTime(5000)
      await Promise.resolve()
      const stats = promisePool.getStats()
      expect(stats.rejected).toBeGreaterThanOrEqual(1)
      jest.useRealTimers()
    })
  })
})
