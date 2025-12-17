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
      // Training Streak has level-based images
      if (badge.name === 'Training Streak' && badge.level) {
        const trainingStreakLevelMap = {
          1: require('@/assets/img/training-streak-level-1.svg'),
          2: require('@/assets/img/training-streak-level-2.svg'),
          3: require('@/assets/img/training-streak-level-3.svg')
        }
        return (
          trainingStreakLevelMap[badge.level] || require('@/assets/img/training-streak-level-1.svg')
        )
      }

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

      // Zero Click Champion has level-based images
      if (badge.name === 'Zero Click Champion' && badge.level) {
        const zeroClickChampionLevelMap = {
          1: require('@/assets/img/zero-level-champion-level-1.svg'),
          2: require('@/assets/img/zero-level-champion-level-2.svg'),
          3: require('@/assets/img/zero-level-champion-level-3.svg')
        }
        return (
          zeroClickChampionLevelMap[badge.level] ||
          require('@/assets/img/zero-level-champion-level-1.svg')
        )
      }

      // Cyber Guardian has level-based images
      if (badge.name === 'Cyber Guardian' && badge.level) {
        const cyberGuardianLevelMap = {
          1: require('@/assets/img/cyber-guardian-level-1.svg'),
          2: require('@/assets/img/cyber-guardian-level-2.svg'),
          3: require('@/assets/img/cyber-guardian-level-3.svg')
        }
        return (
          cyberGuardianLevelMap[badge.level] || require('@/assets/img/cyber-guardian-level-1.svg')
        )
      }

      // Rapid Reporter has level-based images
      if (badge.name === 'Rapid Reporter' && badge.level) {
        const rapidReporterLevelMap = {
          1: require('@/assets/img/rapid-reporter-level-1.svg'),
          2: require('@/assets/img/rapid-reporter-level-2.svg'),
          3: require('@/assets/img/rapid-reporter-level-3.svg')
        }
        return (
          rapidReporterLevelMap[badge.level] || require('@/assets/img/rapid-reporter-level-1.svg')
        )
      }

      // Real Phishing Defender has level-based images
      if (badge.name === 'Real Phishing Defender' && badge.level) {
        const realPhishingDefenderLevelMap = {
          1: require('@/assets/img/real-phishing-defender-level-1.svg'),
          2: require('@/assets/img/real-phishing-defender-level-2.svg'),
          3: require('@/assets/img/real-phishing-defender-level-3.svg')
        }
        return (
          realPhishingDefenderLevelMap[badge.level] ||
          require('@/assets/img/real-phishing-defender-level-1.svg')
        )
      }

      // Map by badgeName first (more flexible)
      const nameImageMap = {
        'First Training Completed': require('@/assets/img/first-training-completed.svg'),
        'Training Streak': require('@/assets/img/training-streak-level-1.svg'), // Fallback if no level
        'Training Master': require('@/assets/img/training-master-level-1.svg'), // Fallback if no level
        'Perfect Score': require('@/assets/img/perfect-score-level-1.svg'), // Fallback if no level
        'Security Champion': require('@/assets/img/security-champion-level-1.svg'), // Fallback if no level
        'First Phishing Report': require('@/assets/img/first-phishing-report.svg'),
        'Phishing Hunter': require('@/assets/img/phishing-hunter-level-1.svg'), // Fallback if no level
        'Zero Click Champion': require('@/assets/img/zero-level-champion-level-1.svg'), // Fallback if no level
        'Cyber Guardian': require('@/assets/img/cyber-guardian-level-1.svg'), // Fallback if no level
        'Rapid Reporter': require('@/assets/img/rapid-reporter-level-1.svg'), // Fallback if no level
        'Real Phishing Defender': require('@/assets/img/real-phishing-defender-level-1.svg') // Fallback if no level
      }

      if (nameImageMap[badge.name]) {
        return nameImageMap[badge.name]
      }

      // Fallback to badgeType mapping
      const typeImageMap = {
        1: require('@/assets/img/first-training-completed.svg'),
        2: require('@/assets/img/training-master-level-1.svg'),
        4: require('@/assets/img/training-streak-level-1.svg'), // Default level 1 for Training Streak // Default level 1 for Training Master
        3: require('@/assets/img/perfect-score-level-1.svg'), // Default level 1 for Perfect Score
        5: require('@/assets/img/security-champion-level-1.svg'), // Default level 1 for Security Champion
        6: require('@/assets/img/first-phishing-report.svg'), // First Phishing Report
        7: require('@/assets/img/phishing-hunter-level-1.svg'), // Default level 1 for Phishing Hunter
        8: require('@/assets/img/zero-level-champion-level-1.svg'), // Default level 1 for Zero Click Champion
        9: require('@/assets/img/cyber-guardian-level-1.svg'), // Default level 1 for Cyber Guardian
        10: require('@/assets/img/rapid-reporter-level-1.svg'), // Default level 1 for Rapid Reporter
        11: require('@/assets/img/real-phishing-defender-level-1.svg') // Default level 1 for Real Phishing Defender
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
        4: 'mdi-fire', // Training Streak
        3: 'mdi-star', // Perfect Score
        5: 'mdi-shield-check', // Security Champion
        6: 'mdi-email-alert', // First Phishing Report
        7: 'mdi-shield-search', // Phishing Hunter
        8: 'mdi-mouse-off', // Zero Click Champion
        9: 'mdi-shield-account', // Cyber Guardian
        10: 'mdi-flash', // Rapid Reporter
        11: 'mdi-email-check' // Real Phishing Defender
      }
      return iconMap[badgeType] || 'mdi-trophy'
    }
  }
}
