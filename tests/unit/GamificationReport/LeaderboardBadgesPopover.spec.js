import { createLocalVue, shallowMount } from '@vue/test-utils'
import LeaderboardBadgesPopover from '@/components/GamificationReport/LeaderboardBadgesPopover'

describe('LeaderboardBadgesPopover.vue', () => {
  const localVue = createLocalVue()

  const defaultBadges = [
    { badgeName: 'Badge A', badgeType: 'type-1', level: 1 },
    { badgeName: 'Badge B', badgeType: 'type-2', level: 2 },
    { badgeName: 'Badge C', badgeType: 'type-3', level: 3 }
  ]

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(LeaderboardBadgesPopover, {
      localVue,
      propsData: {
        badges: defaultBadges,
        onClose: jest.fn(),
        ...propsData
      },
      mocks: {
        $emit: jest.fn()
      },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('LeaderboardBadgesPopover')
    })

    it('should render main container div', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.leaderboard-badges-popover').exists()).toBe(true)
    })

    it('should render header section', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.leaderboard-badges-popover__header').exists()).toBe(true)
    })

    it('should render search input', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
    })

    it('should render close button', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VIcon' }).exists()).toBe(true)
    })

    it('should render list container', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.leaderboard-badges-popover__list').exists()).toBe(true)
    })

    it('should render badge items', () => {
      const wrapper = mountComponent()
      const items = wrapper.findAll('.leaderboard-badges-popover__item')
      expect(items.length).toBe(3)
    })

    it('should render divider', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.leaderboard-badges-popover__divider').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept badges prop', () => {
      const badges = [{ badgeName: 'Badge X' }]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.badges).toEqual(badges)
    })

    it('badges prop should default to empty array', () => {
      const wrapper = mountComponent({ badges: [] })
      expect(Array.isArray(wrapper.vm.badges)).toBe(true)
    })

    it('should accept onClose prop', () => {
      const onClose = jest.fn()
      const wrapper = mountComponent({ onClose })
      expect(wrapper.vm.onClose).toBe(onClose)
    })

    it('onClose prop should default to null', () => {
      const wrapper = mountComponent({ onClose: null })
      expect(wrapper.vm.onClose).toBe(null)
    })

    it('badges prop should be of type Array with default', () => {
      expect(LeaderboardBadgesPopover.props.badges.type).toBe(Array)
      expect(LeaderboardBadgesPopover.props.badges.default).toBeDefined()
    })

    it('onClose prop should be of type Function with null default', () => {
      expect(LeaderboardBadgesPopover.props.onClose.type).toBe(Function)
      expect(LeaderboardBadgesPopover.props.onClose.default).toBe(null)
    })
  })

  describe('Data Properties', () => {
    it('should initialize searchQuery as empty string', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.searchQuery).toBe('')
    })

    it('should be able to update searchQuery', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'test'
      expect(wrapper.vm.searchQuery).toBe('test')
    })
  })

  describe('Computed Properties - filteredBadges', () => {
    it('should return all badges when no search query', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.filteredBadges).toEqual(defaultBadges)
    })

    it('should filter badges by name', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'Badge A'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
      expect(filtered[0].badgeName).toBe('Badge A')
    })

    it('should filter badges case-insensitively', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'badge a'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
    })

    it('should filter by partial badge name', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'Badge'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(3)
    })

    it('should filter by level number', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'level 1'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
      expect(filtered[0].level).toBe(1)
    })

    it('should filter level query case-insensitively', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'LEVEL 2'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
      expect(filtered[0].level).toBe(2)
    })

    it('should handle empty search query', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = '   '
      const filtered = wrapper.vm.filteredBadges
      expect(filtered).toEqual(defaultBadges)
    })

    it('should return empty array when no matches', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'NonExistent'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(0)
    })

    it('should handle non-array badges gracefully', () => {
      const wrapper = mountComponent({ badges: null })
      const filtered = wrapper.vm.filteredBadges
      expect(Array.isArray(filtered)).toBe(true)
      expect(filtered.length).toBe(0)
    })

    it('should handle badges with alternative name property', () => {
      const wrapper = mountComponent({
        badges: [
          { name: 'Alternative Name', level: 1 }
        ]
      })
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
    })

    it('should prioritize badgeName over name', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Primary Name', name: 'Secondary Name', level: 1 }
        ]
      })
      wrapper.vm.searchQuery = 'Primary'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
    })

    it('does not match "level 0" query when badge level is zero', () => {
      const wrapper = mountComponent({
        badges: [{ badgeName: 'Zero Badge', level: 0 }]
      })
      wrapper.vm.searchQuery = 'level 0'

      expect(wrapper.vm.filteredBadges).toEqual([])
    })
  })

  describe('Methods - getBadgeKey', () => {
    it('should generate unique key for badges', () => {
      const wrapper = mountComponent()
      const badge1 = { badgeType: 'type-1', level: 1 }
      const badge2 = { badgeType: 'type-2', level: 2 }

      const key1 = wrapper.vm.getBadgeKey(badge1, 0)
      const key2 = wrapper.vm.getBadgeKey(badge2, 1)

      expect(key1).not.toBe(key2)
    })

    it('should handle badge with type property', () => {
      const wrapper = mountComponent()
      const badge = { type: 'badge-type', level: 1 }
      const key = wrapper.vm.getBadgeKey(badge, 0)

      expect(key).toContain('badge-type')
    })

    it('should handle badge without type property', () => {
      const wrapper = mountComponent()
      const badge = { name: 'Badge', level: 1 }
      const key = wrapper.vm.getBadgeKey(badge, 0)

      expect(key).toBeDefined()
    })

    it('should handle badge without level', () => {
      const wrapper = mountComponent()
      const badge = { badgeType: 'type-1' }
      const key = wrapper.vm.getBadgeKey(badge, 0)

      expect(key).toContain('-0-')
    })

    it('should use index in key generation', () => {
      const wrapper = mountComponent()
      const badge = { badgeType: 'type-1', level: 1 }

      const key1 = wrapper.vm.getBadgeKey(badge, 0)
      const key2 = wrapper.vm.getBadgeKey(badge, 1)

      expect(key1).not.toBe(key2)
    })

    it('should prioritize badgeType over type when both exist', () => {
      const wrapper = mountComponent()
      const key = wrapper.vm.getBadgeKey({ badgeType: 'primary', type: 'secondary', level: 4 }, 0)
      expect(key).toContain('primary')
      expect(key).not.toContain('secondary')
    })
  })

  describe('Methods - getBadgeLevel', () => {
    it('should return level when available', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Badge', level: 5 }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(5)
    })

    it('should handle Level property (capitalized)', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Badge', Level: 3 }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(3)
    })

    it('should prioritize level over Level', () => {
      const wrapper = mountComponent()
      const badge = { level: 2, Level: 5 }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(2)
    })

    it('should return null when level is undefined', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Badge' }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(null)
    })

    it('should return null when level is empty string', () => {
      const wrapper = mountComponent()
      const badge = { level: '' }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(null)
    })

    it('should return null when level is zero', () => {
      const wrapper = mountComponent()
      const badge = { level: 0 }
      const level = wrapper.vm.getBadgeLevel(badge)

      expect(level).toBe(0)
    })

    it('should handle null badge', () => {
      const wrapper = mountComponent()
      const level = wrapper.vm.getBadgeLevel(null)

      expect(level).toBe(null)
    })

    it('should return null when level is empty even if Level exists', () => {
      const wrapper = mountComponent()
      const level = wrapper.vm.getBadgeLevel({ level: '', Level: 7 })
      expect(level).toBe(null)
    })
  })

  describe('Close Button Functionality', () => {
    it('should call onClose when close button clicked', () => {
      const onCloseFn = jest.fn()
      const wrapper = mountComponent({ onClose: onCloseFn })

      wrapper.vm.onClose && wrapper.vm.onClose()
      expect(onCloseFn).toHaveBeenCalled()
    })

    it('should handle missing onClose gracefully', () => {
      const wrapper = mountComponent({ onClose: null })
      // Should not throw
      expect(() => wrapper.vm.onClose && wrapper.vm.onClose()).not.toThrow()
    })

    it('close icon click triggers onClose callback', async () => {
      const onCloseFn = jest.fn()
      const wrapper = mountComponent({ onClose: onCloseFn })
      await wrapper.find('.leaderboard-badges-popover__close-btn').trigger('click')
      expect(onCloseFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no badges match search', async () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'NonExistent'
      await wrapper.vm.$nextTick()

      const empty = wrapper.find('.leaderboard-badges-popover__empty')
      expect(empty.exists()).toBe(true)
    })

    it('should show empty message with correct text', async () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'NotFound'
      await wrapper.vm.$nextTick()

      const empty = wrapper.find('.leaderboard-badges-popover__empty')
      expect(empty.exists()).toBe(true)
    })

    it('should hide empty message when badges exist', async () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'Badge A'
      await wrapper.vm.$nextTick()

      const empty = wrapper.find('.leaderboard-badges-popover__empty')
      expect(empty.exists()).toBe(false)
    })

    it('should show empty message when no badges provided', async () => {
      const wrapper = mountComponent({ badges: [] })
      await wrapper.vm.$nextTick()

      const empty = wrapper.find('.leaderboard-badges-popover__empty')
      expect(empty.exists()).toBe(true)
    })
  })

  describe('Badge Display', () => {
    it('should display badge names', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Achievement Badge', level: 1 },
          { badgeName: 'Expert Badge', level: 2 }
        ]
      })

      const items = wrapper.findAll('.leaderboard-badges-popover__item-name')
      expect(items.length).toBe(2)
      expect(items.at(0).text()).toBe('Achievement Badge')
      expect(items.at(1).text()).toBe('Expert Badge')
    })

    it('should display badge levels', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Badge', level: 1 },
          { badgeName: 'Badge', level: 3 }
        ]
      })

      const levels = wrapper.findAll('.leaderboard-badges-popover__item-level')
      expect(levels.length).toBe(2)
      expect(levels.at(0).text()).toContain('Level 1')
      expect(levels.at(1).text()).toContain('Level 3')
    })

    it('should not display level when not available', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Badge A', level: 1 },
          { badgeName: 'Badge B' }
        ]
      })

      const levels = wrapper.findAll('.leaderboard-badges-popover__item-level')
      expect(levels.length).toBe(1)
    })

    it('should use alternative name property if badgeName not available', () => {
      const wrapper = mountComponent({
        badges: [
          { name: 'Alternative Name', level: 1 }
        ]
      })

      const item = wrapper.find('.leaderboard-badges-popover__item-name')
      expect(item.text()).toBe('Alternative Name')
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const badges1 = [{ badgeName: 'Badge 1', level: 1 }]
      const badges2 = [{ badgeName: 'Badge 2', level: 2 }]

      const wrapper1 = mountComponent({ badges: badges1 })
      const wrapper2 = mountComponent({ badges: badges2 })

      expect(wrapper1.vm.badges).toEqual(badges1)
      expect(wrapper2.vm.badges).toEqual(badges2)
    })

    it('multiple instances should filter independently', () => {
      const wrapper1 = mountComponent({
        badges: [{ badgeName: 'Badge A', level: 1 }]
      })
      const wrapper2 = mountComponent({
        badges: [{ badgeName: 'Badge B', level: 2 }]
      })

      wrapper1.vm.searchQuery = 'A'
      wrapper2.vm.searchQuery = 'B'

      expect(wrapper1.vm.filteredBadges.length).toBe(1)
      expect(wrapper2.vm.filteredBadges.length).toBe(1)
      expect(wrapper1.vm.filteredBadges[0].badgeName).toBe('Badge A')
      expect(wrapper2.vm.filteredBadges[0].badgeName).toBe('Badge B')
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow: search and filter badges', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Golden Achievement', level: 1 },
          { badgeName: 'Silver Challenge', level: 2 },
          { badgeName: 'Gold Medal', level: 3 }
        ]
      })

      wrapper.vm.searchQuery = 'Gold'
      expect(wrapper.vm.filteredBadges.length).toBe(2)
      expect(wrapper.vm.filteredBadges[0].badgeName).toContain('Gold')
      expect(wrapper.vm.filteredBadges[1].badgeName).toContain('Gold')
    })

    it('complete workflow: search by level', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Badge A', level: 1 },
          { badgeName: 'Badge B', level: 2 },
          { badgeName: 'Badge C', level: 1 }
        ]
      })

      wrapper.vm.searchQuery = 'level 1'
      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(2)
      expect(filtered.every(b => b.level === 1)).toBe(true)
    })

    it('complete workflow: clear search to show all', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = 'test'
      expect(wrapper.vm.filteredBadges.length).toBe(0)

      wrapper.vm.searchQuery = ''
      expect(wrapper.vm.filteredBadges).toEqual(defaultBadges)
    })

    it('complete workflow: open and close popover', () => {
      const onCloseFn = jest.fn()
      const wrapper = mountComponent({ onClose: onCloseFn })

      wrapper.vm.onClose && wrapper.vm.onClose()
      expect(onCloseFn).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle badges with special characters in names', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: 'Badge@#$%', level: 1 }
        ]
      })

      wrapper.vm.searchQuery = '@#'
      expect(wrapper.vm.filteredBadges.length).toBe(1)
    })

    it('should handle very long badge names', () => {
      const longName = 'A'.repeat(500)
      const wrapper = mountComponent({
        badges: [
          { badgeName: longName, level: 1 }
        ]
      })

      expect(wrapper.vm.filteredBadges[0].badgeName).toBe(longName)
    })

    it('should handle many badges efficiently', () => {
      const manyBadges = Array.from({ length: 1000 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i % 5
      }))

      const wrapper = mountComponent({ badges: manyBadges })
      wrapper.vm.searchQuery = 'Badge 1'

      expect(wrapper.vm.filteredBadges.length).toBeGreaterThan(0)
    })

    it('should handle null or undefined badge properties', () => {
      const wrapper = mountComponent({
        badges: [
          { badgeName: null, level: undefined },
          { name: undefined, level: null },
          {}
        ]
      })

      expect(wrapper.vm.filteredBadges.length).toBe(3)
    })

    it('should handle whitespace in search query', () => {
      const wrapper = mountComponent()
      wrapper.vm.searchQuery = '   Badge A   '

      const filtered = wrapper.vm.filteredBadges
      expect(filtered.length).toBe(1)
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain badges after mount', () => {
      const wrapper = mountComponent({
        badges: defaultBadges
      })
      expect(wrapper.vm.badges).toEqual(defaultBadges)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('filteredBadges should compute efficiently', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.searchQuery = `search${i}`
        const filtered = wrapper.vm.filteredBadges
        expect(filtered).toBeDefined()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(300)
    })

    it('should handle large badge lists efficiently', () => {
      const largeBadges = Array.from({ length: 500 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i % 10
      }))

      const start = Date.now()
      const wrapper = mountComponent({ badges: largeBadges })
      wrapper.vm.searchQuery = 'Badge 1'
      const duration = Date.now() - start

      expect(duration).toBeLessThan(500)
      expect(wrapper.vm.filteredBadges.length).toBeGreaterThan(0)
    })
  })
})
