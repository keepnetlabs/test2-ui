/**
 * Badge utility mixin for Users Dashboard components
 * Provides common badge-related methods: image, description, icon
 */
export default {
  methods: {
    /**
     * Get badge image path based on badge name and level
     * @param {Object} badge - Badge object with name, type, and level
     * @returns {string|null} Image path or null if not found
     */
    getBadgeImage(badge) {
      // Training Master has level-based images
      if (badge.name === 'Training Master' && badge.level) {
        const trainingMasterLevelMap = {
          1: require('@/assets/img/training-master-level-1.svg'),
          2: require('@/assets/img/training-master-level-2.svg'),
          3: require('@/assets/img/training-master-level-3.svg')
        }
        return (
          trainingMasterLevelMap[badge.level] || require('@/assets/img/training-master-level-1.svg')
        )
      }

      // Perfect Score has level-based images
      if (badge.name === 'Perfect Score' && badge.level) {
        const perfectScoreLevelMap = {
          1: require('@/assets/img/perfect-score-level-1.svg'),
          2: require('@/assets/img/perfect-score-level-2.svg'),
          3: require('@/assets/img/perfect-score-level-3.svg')
        }
        return (
          perfectScoreLevelMap[badge.level] || require('@/assets/img/perfect-score-level-1.svg')
        )
      }

      // Security Champion has level-based images
      if (badge.name === 'Security Champion' && badge.level) {
        const securityChampionLevelMap = {
          1: require('@/assets/img/security-champion-level-1.svg'),
          2: require('@/assets/img/security-champion-level-2.svg'),
          3: require('@/assets/img/security-champion-level-3.svg')
        }
        return (
          securityChampionLevelMap[badge.level] ||
          require('@/assets/img/security-champion-level-1.svg')
        )
      }

      // Phishing Hunter has level-based images
      if (badge.name === 'Phishing Hunter' && badge.level) {
        const phishingHunterLevelMap = {
          1: require('@/assets/img/phishing-hunter-level-1.svg'),
          2: require('@/assets/img/phishing-hunter-level-2.svg'),
          3: require('@/assets/img/phishing-hunter-level-3.svg')
        }
        return (
          phishingHunterLevelMap[badge.level] || require('@/assets/img/phishing-hunter-level-1.svg')
        )
      }

      // Map by badgeName first (more flexible)
      const nameImageMap = {
        'First Training Completed': require('@/assets/img/first-training-completed.svg'),
        'Training Master': require('@/assets/img/training-master-level-1.svg'), // Fallback if no level
        'Perfect Score': require('@/assets/img/perfect-score-level-1.svg'), // Fallback if no level
        'Security Champion': require('@/assets/img/security-champion-level-1.svg'), // Fallback if no level
        'First Phishing Report': null, // No image yet, will use icon
        'Phishing Hunter': require('@/assets/img/phishing-hunter-level-1.svg') // Fallback if no level
      }

      if (nameImageMap[badge.name]) {
        return nameImageMap[badge.name]
      }

      // Fallback to badgeType mapping
      const typeImageMap = {
        1: require('@/assets/img/first-training-completed.svg'),
        2: require('@/assets/img/training-master-level-1.svg'), // Default level 1 for Training Master
        3: require('@/assets/img/perfect-score-level-1.svg'), // Default level 1 for Perfect Score
        5: require('@/assets/img/security-champion-level-1.svg'), // Default level 1 for Security Champion
        6: null, // First Phishing Report - no image yet, will use icon
        7: require('@/assets/img/phishing-hunter-level-1.svg') // Default level 1 for Phishing Hunter
      }

      return typeImageMap[badge.type] || null
    },

    /**
     * Get badge name based on language
     * For en-GB and en-US: uses API badgeName directly
     * For other languages: uses label translations
     * @param {Object} badge - Badge object with type, level, badgeName
     * @returns {string} Badge name
     */
    getBadgeName(badge) {
      // For en-GB and en-US, use API badgeName directly
      if (this.language === 'en-GB' || this.language === 'en-US') {
        return badge.badgeName || badge.name || ''
      }

      // For other languages, use label translations
      const level = badge.level || 0
      const labelKey = `badgeName_${badge.type}_${level}`
      const name = this.labels[labelKey]

      // Fallback to API badgeName if label not found
      return name || badge.badgeName || badge.name || ''
    },

    /**
     * Get badge description based on language
     * For en-GB and en-US: uses API description directly
     * For other languages: uses label translations
     * @param {Object} badge - Badge object with type, level, description
     * @returns {string} Badge description
     */
    getBadgeDescription(badge) {
      // For en-GB and en-US, use API description directly
      if (this.language === 'en-GB' || this.language === 'en-US') {
        return badge.description || ''
      }

      // For other languages, use label translations
      const level = badge.level || 0
      const labelKey = `badgeDescription_${badge.type}_${level}`
      const description = this.labels[labelKey]

      // Fallback to API description if label not found
      return description || badge.description || ''
    },

    /**
     * Get badge icon based on badge type
     * @param {number} badgeType - Badge type number
     * @returns {string} Material Design Icon name
     */
    getBadgeIcon(badgeType) {
      // Map badgeType (number) to icon
      const iconMap = {
        1: 'mdi-school', // First Training Completed
        2: 'mdi-book-open-variant', // Training Master
        3: 'mdi-star', // Perfect Score
        5: 'mdi-shield-check', // Security Champion
        6: 'mdi-email-alert', // First Phishing Report
        7: 'mdi-shield-search' // Phishing Hunter
      }
      return iconMap[badgeType] || 'mdi-trophy'
    }
  }
}
