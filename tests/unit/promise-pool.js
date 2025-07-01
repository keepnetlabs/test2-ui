class PromisePool {
  constructor() {
    this.activePromises = new Set()
    this.completedPromises = new Set()
    this.rejectedPromises = new Set()
    this.originalPromise = Promise
    this.isIntercepting = false
  }

  startInterception() {
    if (this.isIntercepting) return

    this.isIntercepting = true
    const pool = this

    // Override global Promise constructor
    global.Promise = class TrackedPromise extends this.originalPromise {
      constructor(executor) {
        let resolveRef, rejectRef

        super((resolve, reject) => {
          resolveRef = resolve
          rejectRef = reject

          if (executor) {
            try {
              executor(
                (value) => {
                  pool.activePromises.delete(promise)
                  pool.completedPromises.add(promise)
                  resolve(value)
                },
                (reason) => {
                  pool.activePromises.delete(promise)
                  pool.rejectedPromises.add(promise)
                  reject(reason)
                }
              )
            } catch (error) {
              pool.activePromises.delete(promise)
              pool.rejectedPromises.add(promise)
              reject(error)
            }
          }
        })

        const promise = this
        pool.activePromises.add(promise)

        // Auto cleanup after 5 seconds (unit test appropriate)
        setTimeout(() => {
          if (pool.activePromises.has(promise)) {
            pool.activePromises.delete(promise)
            pool.rejectedPromises.add(promise)
          }
        }, 5000)
      }

      static resolve(value) {
        return new TrackedPromise((resolve) => resolve(value))
      }

      static reject(reason) {
        return new TrackedPromise((_, reject) => reject(reason))
      }

      static all(promises) {
        return pool.originalPromise.all(promises)
      }

      static race(promises) {
        return pool.originalPromise.race(promises)
      }

      static allSettled(promises) {
        return pool.originalPromise.allSettled(promises)
      }
    }
  }

  stopInterception() {
    if (!this.isIntercepting) return

    global.Promise = this.originalPromise
    this.isIntercepting = false
  }

  async flushPendingPromises() {
    // Wait for all active promises to settle
    const pendingPromises = Array.from(this.activePromises)

    if (pendingPromises.length > 0) {
      await this.originalPromise.allSettled(pendingPromises)
    }
  }

  clearAll() {
    this.activePromises.clear()
    this.completedPromises.clear()
    this.rejectedPromises.clear()
  }

  getStats() {
    return {
      active: this.activePromises.size,
      completed: this.completedPromises.size,
      rejected: this.rejectedPromises.size
    }
  }
}

// Export singleton instance
const promisePool = new PromisePool()

export default promisePool
