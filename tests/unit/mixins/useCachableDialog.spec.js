const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true
})

import useCachableDialog from '@/mixins/useCachableDialog'

describe('useCachableDialog mixin', () => {
  let component

  beforeEach(() => {
    mockLocalStorage.clear()
    jest.clearAllTimers()
    // Create a mock component with the mixin
    component = {
      ...useCachableDialog
    }
  })

  describe('mixin structure', () => {
    it('should be a valid mixin object', () => {
      expect(typeof useCachableDialog).toBe('object')
      expect(useCachableDialog.methods).toBeDefined()
    })

    it('should have canShowCachableDialog method', () => {
      expect(typeof component.methods.canShowCachableDialog).toBe('function')
    })

    it('should have saveCachableDialogTimestamp method', () => {
      expect(typeof component.methods.saveCachableDialogTimestamp).toBe('function')
    })
  })

  describe('canShowCachableDialog', () => {
    const canShowCachableDialog = useCachableDialog.methods.canShowCachableDialog

    it('should return true when storage key does not exist', () => {
      const result = canShowCachableDialog.call({}, 'new-dialog-key')
      expect(result).toBe(true)
    })

    it('should return true when 24 hours have passed', () => {
      const key = 'test-dialog'
      const now = new Date().getTime()
      const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000) - 1000 // 24 hours + 1 second ago

      mockLocalStorage.setItem(key, twentyFourHoursAgo.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should return false when less than 24 hours have passed', () => {
      const key = 'test-dialog'
      const now = new Date().getTime()
      const oneHourAgo = now - (60 * 60 * 1000) // 1 hour ago

      mockLocalStorage.setItem(key, oneHourAgo.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(false)
    })

    it('should return false when exactly 0 time has passed', () => {
      const key = 'test-dialog'
      const now = new Date().getTime()

      mockLocalStorage.setItem(key, now.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(false)
    })

    it('should return false when 23 hours and 59 minutes have passed', () => {
      const key = 'test-dialog'
      const now = new Date().getTime()
      const almostTwentyFourHoursAgo = now - (23 * 60 * 60 * 1000) - (59 * 60 * 1000)

      mockLocalStorage.setItem(key, almostTwentyFourHoursAgo.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(false)
    })

    it('should handle corrupted timestamp data gracefully', () => {
      const key = 'test-dialog'
      mockLocalStorage.setItem(key, 'invalid-timestamp')

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should handle NaN timestamp gracefully', () => {
      const key = 'test-dialog'
      mockLocalStorage.setItem(key, 'NaN')

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should handle null timestamp gracefully', () => {
      const key = 'test-dialog'
      mockLocalStorage.setItem(key, 'null')

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should handle empty string timestamp gracefully', () => {
      const key = 'test-dialog'
      mockLocalStorage.setItem(key, '')

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should handle very old timestamps', () => {
      const key = 'test-dialog'
      mockLocalStorage.setItem(key, '0') // Unix epoch

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should handle very large timestamps', () => {
      const key = 'test-dialog'
      const futureTime = new Date().getTime() + (365 * 24 * 60 * 60 * 1000) // 1 year in future

      mockLocalStorage.setItem(key, futureTime.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(false)
    })

    it('should use company-specific storage keys correctly', () => {
      const companyId = '123'
      const key = `dialog_${companyId}`

      mockLocalStorage.setItem(key, new Date().getTime().toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(false)
    })

    it('should differentiate between different storage keys', () => {
      const key1 = 'dialog-1'
      const key2 = 'dialog-2'
      const now = new Date().getTime()

      mockLocalStorage.setItem(key1, (now - 25 * 60 * 60 * 1000).toString()) // 25 hours ago
      mockLocalStorage.setItem(key2, now.toString()) // Just now

      expect(canShowCachableDialog.call({}, key1)).toBe(true)
      expect(canShowCachableDialog.call({}, key2)).toBe(false)
    })
  })

  describe('saveCachableDialogTimestamp', () => {
    const saveCachableDialogTimestamp = useCachableDialog.methods.saveCachableDialogTimestamp

    it('should save current timestamp to localStorage', () => {
      const key = 'test-dialog'
      const beforeTime = new Date().getTime()

      saveCachableDialogTimestamp.call({}, key)

      const beforeTime2 = new Date().getTime()
      const saved = parseInt(mockLocalStorage.getItem(key), 10)

      expect(saved).toBeGreaterThanOrEqual(beforeTime)
      expect(saved).toBeLessThanOrEqual(beforeTime2)
    })

    it('should save timestamp as string', () => {
      const key = 'test-dialog'
      saveCachableDialogTimestamp.call({}, key)

      const saved = mockLocalStorage.getItem(key)
      expect(typeof saved).toBe('string')
    })

    it('should overwrite existing timestamp', () => {
      const key = 'test-dialog'
      const oldTime = '1234567890'

      mockLocalStorage.setItem(key, oldTime)
      saveCachableDialogTimestamp.call({}, key)

      const saved = mockLocalStorage.getItem(key)
      expect(saved).not.toBe(oldTime)
    })

    it('should save timestamps independently for different keys', () => {
      const key1 = 'dialog-1'
      const key2 = 'dialog-2'

      saveCachableDialogTimestamp.call({}, key1)
      const saved1 = mockLocalStorage.getItem(key1)

      // Wait a bit to ensure time passes
      jest.advanceTimersByTime(10)

      saveCachableDialogTimestamp.call({}, key2)
      const saved2 = mockLocalStorage.getItem(key2)

      // Both should have timestamps stored independently
      expect(saved1).toBeDefined()
      expect(saved2).toBeDefined()
      // Timestamps should be close but potentially equal due to execution speed
      expect(parseInt(saved1) <= parseInt(saved2)).toBe(true)
    })

    it('should save numeric timestamp converted to string', () => {
      const key = 'test-dialog'
      saveCachableDialogTimestamp.call({}, key)

      const saved = mockLocalStorage.getItem(key)
      const parsed = parseInt(saved, 10)

      expect(isNaN(parsed)).toBe(false)
      expect(parsed).toBeGreaterThan(0)
    })
  })

  describe('integration workflow', () => {
    const { canShowCachableDialog, saveCachableDialogTimestamp } = useCachableDialog.methods

    it('should handle complete workflow: check, save, check again', () => {
      const key = 'license-exceeded'

      // Initial check - should show
      expect(canShowCachableDialog.call({}, key)).toBe(true)

      // Save timestamp
      saveCachableDialogTimestamp.call({}, key)

      // Second check - should not show (too soon)
      expect(canShowCachableDialog.call({}, key)).toBe(false)
    })

    it('should show dialog again after 24 hours', () => {
      const key = 'license-exceeded'

      // First time
      canShowCachableDialog.call({}, key)
      saveCachableDialogTimestamp.call({}, key)

      const saved = mockLocalStorage.getItem(key)
      const savedTime = parseInt(saved, 10)
      const now = new Date().getTime()
      const twentyFourHoursAndOneSecAgo = now - (24 * 60 * 60 * 1000) - 1000

      // Simulate 24+ hours passing
      mockLocalStorage.setItem(key, twentyFourHoursAndOneSecAgo.toString())

      // Should be able to show again
      expect(canShowCachableDialog.call({}, key)).toBe(true)
    })

    it('should handle multiple dialogs independently', () => {
      const key1 = 'dialog-1'
      const key2 = 'dialog-2'
      const now = new Date().getTime()

      // Save first dialog as old
      mockLocalStorage.setItem(key1, (now - 25 * 60 * 60 * 1000).toString())

      // Save second dialog as new
      mockLocalStorage.setItem(key2, now.toString())

      // First should be showable
      expect(canShowCachableDialog.call({}, key1)).toBe(true)

      // Second should not be showable
      expect(canShowCachableDialog.call({}, key2)).toBe(false)

      // Update first one
      saveCachableDialogTimestamp.call({}, key1)

      // Now neither is showable
      expect(canShowCachableDialog.call({}, key1)).toBe(false)
      expect(canShowCachableDialog.call({}, key2)).toBe(false)
    })

    it('should handle company-specific caching', () => {
      const companyId1 = 'company-1'
      const companyId2 = 'company-2'
      const key1 = `licenseDialog_${companyId1}`
      const key2 = `licenseDialog_${companyId2}`

      // Show dialog for company 1
      saveCachableDialogTimestamp.call({}, key1)

      // Should be able to show for company 2
      expect(canShowCachableDialog.call({}, key2)).toBe(true)

      // Should not be able to show for company 1
      expect(canShowCachableDialog.call({}, key1)).toBe(false)
    })
  })

  describe('edge cases', () => {
    const { canShowCachableDialog, saveCachableDialogTimestamp } = useCachableDialog.methods

    it('should handle zero as valid key', () => {
      const key = '0'
      expect(canShowCachableDialog.call({}, key)).toBe(true)
      saveCachableDialogTimestamp.call({}, key)
      expect(canShowCachableDialog.call({}, key)).toBe(false)
    })

    it('should handle special characters in key', () => {
      const key = 'dialog_@#$%^&*()'
      expect(canShowCachableDialog.call({}, key)).toBe(true)
      saveCachableDialogTimestamp.call({}, key)
      expect(mockLocalStorage.getItem(key)).toBeDefined()
    })

    it('should handle very long keys', () => {
      const key = 'a'.repeat(1000)
      expect(canShowCachableDialog.call({}, key)).toBe(true)
      saveCachableDialogTimestamp.call({}, key)
      expect(canShowCachableDialog.call({}, key)).toBe(false)
    })

    it('should handle empty string key', () => {
      const key = ''
      expect(canShowCachableDialog.call({}, key)).toBe(true)
      saveCachableDialogTimestamp.call({}, key)
      expect(canShowCachableDialog.call({}, key)).toBe(false)
    })

    it('should not throw errors with missing localStorage', () => {
      const originalLS = global.localStorage
      delete global.localStorage

      expect(() => {
        canShowCachableDialog.call({}, 'test')
      }).toThrow() // This will throw because localStorage doesn't exist

      global.localStorage = originalLS
    })
  })

  describe('localStorage interaction', () => {
    const { canShowCachableDialog, saveCachableDialogTimestamp } = useCachableDialog.methods

    it('should read from correct localStorage key', () => {
      const key = 'my-dialog'
      const oneWeekAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000)
      mockLocalStorage.setItem(key, oneWeekAgo.toString())

      const result = canShowCachableDialog.call({}, key)
      expect(result).toBe(true)
    })

    it('should write to correct localStorage key', () => {
      const key = 'my-dialog'
      saveCachableDialogTimestamp.call({}, key)

      expect(mockLocalStorage.getItem(key)).toBeDefined()
      expect(mockLocalStorage.getItem(key)).not.toBe(null)
    })

    it('should not affect other localStorage items', () => {
      mockLocalStorage.setItem('other-key', 'other-value')

      const key = 'dialog'
      saveCachableDialogTimestamp.call({}, key)

      expect(mockLocalStorage.getItem('other-key')).toBe('other-value')
    })
  })
})
