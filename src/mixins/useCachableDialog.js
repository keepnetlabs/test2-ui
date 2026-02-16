/**
 * useCachableDialog Mixin
 * Provides functionality to show dialogs only once per 24 hours using localStorage cache
 * Storage key should be company-specific to avoid cross-company caching issues
 *
 * Usage:
 * import useCachableDialog from '@/mixins/useCachableDialog'
 *
 * mixins: [useCachableDialog]
 *
 * Then use with company-specific key:
 * const companyId = this.$store.getters['login/getCurrentCompany']?.resourceId
 * const storageKey = `licenseExceededDialog_${companyId}`
 *
 * if (this.canShowCachableDialog(storageKey)) {
 *   this.showDialog()
 *   this.saveCachableDialogTimestamp(storageKey)
 * }
 */

export default {
  methods: {
    /**
     * Check if a dialog can be shown (24 hours must have passed since last show)
     * @param {string} storageKey - Unique key for the dialog in localStorage
     * @returns {boolean} - True if dialog can be shown, false if still in 24-hour cache
     */
    canShowCachableDialog(storageKey) {
      const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
      const lastShownTime = localStorage.getItem(storageKey)

      if (!lastShownTime) {
        return true
      }

      const currentTime = new Date().getTime()
      const lastShownTimeMs = Number.parseInt(lastShownTime, 10)

      // Guard against corrupted data in localStorage
      if (isNaN(lastShownTimeMs)) {
        return true
      }

      const timeDifference = currentTime - lastShownTimeMs

      return timeDifference > TWENTY_FOUR_HOURS_MS
    },

    /**
     * Save the current timestamp for a dialog to localStorage
     * @param {string} storageKey - Unique key for the dialog in localStorage
     */
    saveCachableDialogTimestamp(storageKey) {
      localStorage.setItem(storageKey, new Date().getTime().toString())
    }
  }
}
