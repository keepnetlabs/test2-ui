import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'

describe('usersDashboardBadgeMixin', () => {
  let component

  beforeEach(() => {
    component = {
      ...usersDashboardBadgeMixin.methods,
      language: 'en-GB',
      labels: {
        badgeName_1_0: 'First Training Completed',
        badgeName_2_1: 'Training Master Level 1',
        badgeName_2_2: 'Training Master Level 2',
        badgeName_2_3: 'Training Master Level 3',
        badgeDescription_1_0: 'Completed first training',
        badgeDescription_2_1: 'Achieved training master level 1'
      }
    }
  })

  describe('mixin structure', () => {
    it('should be a valid mixin object', () => {
      expect(typeof usersDashboardBadgeMixin).toBe('object')
      expect(usersDashboardBadgeMixin.methods).toBeDefined()
    })

    it('should have getBadgeImage method', () => {
      expect(typeof usersDashboardBadgeMixin.methods.getBadgeImage).toBe('function')
    })

    it('should have getBadgeName method', () => {
      expect(typeof usersDashboardBadgeMixin.methods.getBadgeName).toBe('function')
    })

    it('should have getBadgeDescription method', () => {
      expect(typeof usersDashboardBadgeMixin.methods.getBadgeDescription).toBe('function')
    })

    it('should have getBadgeIcon method', () => {
      expect(typeof usersDashboardBadgeMixin.methods.getBadgeIcon).toBe('function')
    })
  })

  describe('getBadgeImage', () => {
    describe('Training Streak badge', () => {
      it('should return level 1 image for Training Streak', () => {
        const badge = { name: 'Training Streak', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Training Streak', () => {
        const badge = { name: 'Training Streak', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Training Streak', () => {
        const badge = { name: 'Training Streak', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should default to level 1 for Training Streak without level', () => {
        const badge = { name: 'Training Streak' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Training Master badge', () => {
      it('should return level 1 image for Training Master', () => {
        const badge = { name: 'Training Master', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Training Master', () => {
        const badge = { name: 'Training Master', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Training Master', () => {
        const badge = { name: 'Training Master', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Perfect Score badge', () => {
      it('should return level 1 image for Perfect Score', () => {
        const badge = { name: 'Perfect Score', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Perfect Score', () => {
        const badge = { name: 'Perfect Score', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Perfect Score', () => {
        const badge = { name: 'Perfect Score', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Security Champion badge', () => {
      it('should return level 1 image for Security Champion', () => {
        const badge = { name: 'Security Champion', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Security Champion', () => {
        const badge = { name: 'Security Champion', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Security Champion', () => {
        const badge = { name: 'Security Champion', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Phishing Hunter badge', () => {
      it('should return level 1 image for Phishing Hunter', () => {
        const badge = { name: 'Phishing Hunter', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Phishing Hunter', () => {
        const badge = { name: 'Phishing Hunter', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Phishing Hunter', () => {
        const badge = { name: 'Phishing Hunter', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Zero Click Champion badge', () => {
      it('should return level 1 image for Zero Click Champion', () => {
        const badge = { name: 'Zero Click Champion', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Zero Click Champion', () => {
        const badge = { name: 'Zero Click Champion', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Zero Click Champion', () => {
        const badge = { name: 'Zero Click Champion', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Cyber Guardian badge', () => {
      it('should return level 1 image for Cyber Guardian', () => {
        const badge = { name: 'Cyber Guardian', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Cyber Guardian', () => {
        const badge = { name: 'Cyber Guardian', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Cyber Guardian', () => {
        const badge = { name: 'Cyber Guardian', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Rapid Reporter badge', () => {
      it('should return level 1 image for Rapid Reporter', () => {
        const badge = { name: 'Rapid Reporter', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Rapid Reporter', () => {
        const badge = { name: 'Rapid Reporter', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Rapid Reporter', () => {
        const badge = { name: 'Rapid Reporter', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Real Phishing Defender badge', () => {
      it('should return level 1 image for Real Phishing Defender', () => {
        const badge = { name: 'Real Phishing Defender', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Real Phishing Defender', () => {
        const badge = { name: 'Real Phishing Defender', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Real Phishing Defender', () => {
        const badge = { name: 'Real Phishing Defender', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('Weekly Active User badge', () => {
      it('should return level 1 image for Weekly Active User', () => {
        const badge = { name: 'Weekly Active User', level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 2 image for Weekly Active User', () => {
        const badge = { name: 'Weekly Active User', level: 2 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should return level 3 image for Weekly Active User', () => {
        const badge = { name: 'Weekly Active User', level: 3 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('badge type mapping', () => {
      it('should map badge type 1 to First Training Completed', () => {
        const badge = { type: 1, name: 'First Training Completed' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 2 to Training Master', () => {
        const badge = { type: 2, name: 'Training Master' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 3 to Perfect Score', () => {
        const badge = { type: 3, name: 'Perfect Score' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 4 to Training Streak', () => {
        const badge = { type: 4, name: 'Training Streak' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 5 to Security Champion', () => {
        const badge = { type: 5, name: 'Security Champion' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 6 to First Phishing Report', () => {
        const badge = { type: 6, name: 'First Phishing Report' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 7 to Phishing Hunter', () => {
        const badge = { type: 7, name: 'Phishing Hunter' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 8 to Zero Click Champion', () => {
        const badge = { type: 8, name: 'Zero Click Champion' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 9 to Cyber Guardian', () => {
        const badge = { type: 9, name: 'Cyber Guardian' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 10 to Rapid Reporter', () => {
        const badge = { type: 10, name: 'Rapid Reporter' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 11 to Real Phishing Defender', () => {
        const badge = { type: 11, name: 'Real Phishing Defender' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should map badge type 12 to Weekly Active User', () => {
        const badge = { type: 12, name: 'Weekly Active User' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })

    describe('edge cases', () => {
      it('should return null for unknown badge type', () => {
        const badge = { type: 999, name: 'Unknown' }
        const result = component.getBadgeImage(badge)
        expect(result).toBeNull()
      })

      it('should handle empty badge object', () => {
        const badge = {}
        const result = component.getBadgeImage(badge)
        expect(result).toBeNull()
      })

      it('should prioritize name over type', () => {
        const badge = { name: 'Training Streak', type: 1, level: 1 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should handle level 0', () => {
        const badge = { name: 'Training Streak', level: 0 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })

      it('should handle level 4 (unsupported)', () => {
        const badge = { name: 'Training Streak', level: 4 }
        const result = component.getBadgeImage(badge)
        expect(result).toBeDefined()
      })
    })
  })

  describe('getBadgeName', () => {
    it('should return badgeName for en-GB language', () => {
      const badge = { badgeName: 'English Name', name: 'Name', type: 1 }
      component.language = 'en-GB'
      const result = component.getBadgeName(badge)
      expect(result).toBe('English Name')
    })

    it('should return badgeName for en-US language', () => {
      const badge = { badgeName: 'English Name', name: 'Name', type: 1 }
      component.language = 'en-US'
      const result = component.getBadgeName(badge)
      expect(result).toBe('English Name')
    })

    it('should use translated label for non-English languages', () => {
      const badge = { badgeName: 'English', name: 'Name', type: 2, level: 1 }
      component.language = 'de-DE'
      const result = component.getBadgeName(badge)
      // Should look for badgeName_2_1 in labels
      expect(typeof result).toBe('string')
    })

    it('should fallback to badgeName if label not found', () => {
      const badge = { badgeName: 'Fallback Name', type: 999, level: 0 }
      component.language = 'fr-FR'
      const result = component.getBadgeName(badge)
      expect(result).toBe('Fallback Name')
    })

    it('should handle missing badgeName', () => {
      const badge = { name: 'Badge Name', type: 1, level: 0 }
      component.language = 'en-GB'
      const result = component.getBadgeName(badge)
      expect(typeof result).toBe('string')
    })

    it('should handle empty badge object', () => {
      const badge = {}
      component.language = 'en-GB'
      const result = component.getBadgeName(badge)
      expect(result).toBe('')
    })

    it('should use level 0 for missing level', () => {
      const badge = { badgeName: 'Test', type: 1 }
      component.language = 'de-DE'
      const result = component.getBadgeName(badge)
      expect(typeof result).toBe('string')
    })
  })

  describe('getBadgeDescription', () => {
    it('should return description for en-GB language', () => {
      const badge = { description: 'English Description', type: 1 }
      component.language = 'en-GB'
      const result = component.getBadgeDescription(badge)
      expect(result).toBe('English Description')
    })

    it('should return description for en-US language', () => {
      const badge = { description: 'English Description', type: 1 }
      component.language = 'en-US'
      const result = component.getBadgeDescription(badge)
      expect(result).toBe('English Description')
    })

    it('should use translated label for non-English languages', () => {
      const badge = { description: 'English', type: 2, level: 1 }
      component.language = 'de-DE'
      const result = component.getBadgeDescription(badge)
      // Should look for badgeDescription_2_1 in labels
      expect(typeof result).toBe('string')
    })

    it('should fallback to description if label not found', () => {
      const badge = { description: 'Fallback Description', type: 999, level: 0 }
      component.language = 'fr-FR'
      const result = component.getBadgeDescription(badge)
      expect(result).toBe('Fallback Description')
    })

    it('should handle missing description', () => {
      const badge = { type: 1, level: 0 }
      component.language = 'en-GB'
      const result = component.getBadgeDescription(badge)
      expect(result).toBe('')
    })

    it('should handle empty badge object', () => {
      const badge = {}
      component.language = 'en-GB'
      const result = component.getBadgeDescription(badge)
      expect(result).toBe('')
    })

    it('should use level 0 for missing level', () => {
      const badge = { description: 'Test', type: 1 }
      component.language = 'de-DE'
      const result = component.getBadgeDescription(badge)
      expect(typeof result).toBe('string')
    })
  })

  describe('getBadgeIcon', () => {
    it('should return mdi-school for type 1', () => {
      const result = component.getBadgeIcon(1)
      expect(result).toBe('mdi-school')
    })

    it('should return mdi-book-open-variant for type 2', () => {
      const result = component.getBadgeIcon(2)
      expect(result).toBe('mdi-book-open-variant')
    })

    it('should return mdi-star for type 3', () => {
      const result = component.getBadgeIcon(3)
      expect(result).toBe('mdi-star')
    })

    it('should return mdi-fire for type 4', () => {
      const result = component.getBadgeIcon(4)
      expect(result).toBe('mdi-fire')
    })

    it('should return mdi-shield-check for type 5', () => {
      const result = component.getBadgeIcon(5)
      expect(result).toBe('mdi-shield-check')
    })

    it('should return mdi-email-alert for type 6', () => {
      const result = component.getBadgeIcon(6)
      expect(result).toBe('mdi-email-alert')
    })

    it('should return mdi-shield-search for type 7', () => {
      const result = component.getBadgeIcon(7)
      expect(result).toBe('mdi-shield-search')
    })

    it('should return mdi-mouse-off for type 8', () => {
      const result = component.getBadgeIcon(8)
      expect(result).toBe('mdi-mouse-off')
    })

    it('should return mdi-shield-account for type 9', () => {
      const result = component.getBadgeIcon(9)
      expect(result).toBe('mdi-shield-account')
    })

    it('should return mdi-flash for type 10', () => {
      const result = component.getBadgeIcon(10)
      expect(result).toBe('mdi-flash')
    })

    it('should return mdi-email-check for type 11', () => {
      const result = component.getBadgeIcon(11)
      expect(result).toBe('mdi-email-check')
    })

    it('should return mdi-calendar-week for type 12', () => {
      const result = component.getBadgeIcon(12)
      expect(result).toBe('mdi-calendar-week')
    })

    it('should return mdi-trophy for unknown type', () => {
      const result = component.getBadgeIcon(999)
      expect(result).toBe('mdi-trophy')
    })

    it('should handle null type', () => {
      const result = component.getBadgeIcon(null)
      expect(result).toBe('mdi-trophy')
    })

    it('should handle undefined type', () => {
      const result = component.getBadgeIcon(undefined)
      expect(result).toBe('mdi-trophy')
    })

    it('should handle zero type', () => {
      const result = component.getBadgeIcon(0)
      expect(result).toBe('mdi-trophy')
    })

    it('should handle string type (number-like)', () => {
      const result = component.getBadgeIcon('5')
      expect(typeof result).toBe('string')
    })

    it('should handle negative type', () => {
      const result = component.getBadgeIcon(-1)
      expect(result).toBe('mdi-trophy')
    })
  })

  describe('integration scenarios', () => {
    it('should work with complete badge object', () => {
      const badge = {
        name: 'Training Streak',
        type: 4,
        level: 2,
        badgeName: 'Streak Master',
        description: 'Maintain training streak'
      }

      component.language = 'en-GB'

      const image = component.getBadgeImage(badge)
      const name = component.getBadgeName(badge)
      const description = component.getBadgeDescription(badge)
      const icon = component.getBadgeIcon(badge.type)

      expect(image).toBeDefined()
      expect(name).toBeDefined()
      expect(description).toBeDefined()
      expect(icon).toBe('mdi-fire')
    })

    it('should handle badge with missing properties', () => {
      const badge = { type: 1 }

      const image = component.getBadgeImage(badge)
      const name = component.getBadgeName(badge)
      const description = component.getBadgeDescription(badge)
      const icon = component.getBadgeIcon(badge.type)

      expect(image).toBeDefined()
      expect(name).toBe('')
      expect(description).toBe('')
      expect(icon).toBe('mdi-school')
    })
  })
})
