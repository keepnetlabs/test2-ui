import { createLocalVue, shallowMount } from '@vue/test-utils'
import LeaderboardBadgesColumn from '@/components/GamificationReport/LeaderboardBadgesColumn'
import usersDashboardBadgeMixin from '@/mixins/usersDashboardBadgeMixin'

jest.mock('@/mixins/usersDashboardBadgeMixin', () => ({
  methods: {
    getBadgeImage: jest.fn((badge) => {
      if (badge && badge.type === 'gold') return '/images/gold-badge.png'
      if (badge && badge.type === 'silver') return '/images/silver-badge.png'
      return null
    })
  }
}))

describe('LeaderboardBadgesColumn.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    badges: [
      { badgeName: 'Expert', badgeType: 'gold', level: 3 },
      { badgeName: 'Intermediate', badgeType: 'silver', level: 2 },
      { badgeName: 'Beginner', badgeType: 'bronze', level: 1 }
    ],
    maxVisible: 3,
    isLoading: false
  }

  const mountComponent = (propsData = {}) => {
    return shallowMount(LeaderboardBadgesColumn, {
      localVue,
      propsData: {
        ...defaultProps,
        ...propsData
      },
      mixins: [usersDashboardBadgeMixin],
      stubs: {
        VTooltip: true,
        VMenu: true,
        LeaderboardBadgesPopover: true
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('LeaderboardBadgesColumn')
    })

    it('should render main container div with class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.leaderboard-badges-column').exists()).toBe(true)
    })

    it('should have VMenu component for badge overflow', () => {
      const badges = Array.from({ length: 10 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 3 })
      expect(wrapper.findComponent({ name: 'VMenu' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept badges prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.badges).toBeDefined()
    })

    it('should accept maxVisible prop with default value 3', () => {
      const wrapper = shallowMount(LeaderboardBadgesColumn, {
        localVue,
        mixins: [usersDashboardBadgeMixin],
        stubs: {
          VTooltip: true,
          VMenu: true,
          LeaderboardBadgesPopover: true
        }
      })
      expect(wrapper.vm.maxVisible).toBe(3)
    })

    it('should accept isLoading prop with default value false', () => {
      const wrapper = shallowMount(LeaderboardBadgesColumn, {
        localVue,
        mixins: [usersDashboardBadgeMixin],
        stubs: {
          VTooltip: true,
          VMenu: true,
          LeaderboardBadgesPopover: true
        }
      })
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('badges prop should default to empty array', () => {
      const wrapper = shallowMount(LeaderboardBadgesColumn, {
        localVue,
        mixins: [usersDashboardBadgeMixin],
        stubs: {
          VTooltip: true,
          VMenu: true,
          LeaderboardBadgesPopover: true
        }
      })
      expect(wrapper.vm.badges).toEqual([])
    })

    it('should accept custom maxVisible value', () => {
      const wrapper = mountComponent({ maxVisible: 5 })
      expect(wrapper.vm.maxVisible).toBe(5)
    })

    it('should accept isLoading prop', () => {
      const wrapper = mountComponent({ isLoading: true })
      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('Computed Properties - totalBadgeCount', () => {
    it('should return correct count of badges', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.totalBadgeCount).toBe(3)
    })

    it('should return 0 for empty badges array', () => {
      const wrapper = mountComponent({ badges: [] })
      expect(wrapper.vm.totalBadgeCount).toBe(0)
    })

    it('should handle single badge', () => {
      const wrapper = mountComponent({ badges: [{ badgeName: 'Single' }] })
      expect(wrapper.vm.totalBadgeCount).toBe(1)
    })

    it('should handle large number of badges', () => {
      const badges = Array.from({ length: 100 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.totalBadgeCount).toBe(100)
    })

    it('should return 0 if badges is not an array', () => {
      const wrapper = mountComponent({ badges: null })
      expect(wrapper.vm.totalBadgeCount).toBe(0)
    })
  })

  describe('Computed Properties - visibleBadges', () => {
    it('should return all badges if count <= maxVisible', () => {
      const wrapper = mountComponent({ badges: [
        { badgeName: 'Badge1', level: 1 },
        { badgeName: 'Badge2', level: 2 }
      ]})
      expect(wrapper.vm.visibleBadges).toHaveLength(2)
    })

    it('should return only maxVisible badges if count > maxVisible', () => {
      const badges = Array.from({ length: 10 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 3 })
      expect(wrapper.vm.visibleBadges).toHaveLength(3)
    })

    it('should sort badges by level in descending order', () => {
      const badges = [
        { badgeName: 'Low', level: 1 },
        { badgeName: 'High', level: 10 },
        { badgeName: 'Mid', level: 5 }
      ]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.visibleBadges[0].level).toBe(10)
      expect(wrapper.vm.visibleBadges[1].level).toBe(5)
      expect(wrapper.vm.visibleBadges[2].level).toBe(1)
    })

    it('should handle badges without level property', () => {
      const badges = [
        { badgeName: 'NoLevel1' },
        { badgeName: 'NoLevel2', level: 5 }
      ]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.visibleBadges).toHaveLength(2)
    })

    it('should not mutate original badges array', () => {
      const badges = [
        { badgeName: 'Badge1', level: 1 },
        { badgeName: 'Badge2', level: 2 }
      ]
      const wrapper = mountComponent({ badges })
      wrapper.vm.visibleBadges
      expect(badges[0].badgeName).toBe('Badge1')
    })
  })

  describe('Computed Properties - overflowBadges', () => {
    it('should return empty array if count <= maxVisible', () => {
      const wrapper = mountComponent({ badges: [
        { badgeName: 'Badge1', level: 1 },
        { badgeName: 'Badge2', level: 2 }
      ]})
      expect(wrapper.vm.overflowBadges).toHaveLength(0)
    })

    it('should return badges that exceed maxVisible', () => {
      const badges = Array.from({ length: 10 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 3 })
      expect(wrapper.vm.overflowBadges).toHaveLength(7)
    })

    it('should sort overflow badges by level descending', () => {
      const badges = [
        { badgeName: 'Low1', level: 1 },
        { badgeName: 'Low2', level: 2 },
        { badgeName: 'High', level: 100 },
        { badgeName: 'Mid', level: 50 }
      ]
      const wrapper = mountComponent({ badges, maxVisible: 1 })
      const overflow = wrapper.vm.overflowBadges
      expect(overflow[0].level).toBe(50)
      expect(overflow[1].level).toBe(2)
      expect(overflow[2].level).toBe(1)
    })

    it('should return empty array if badges is null', () => {
      const wrapper = mountComponent({ badges: null })
      expect(wrapper.vm.overflowBadges).toHaveLength(0)
    })
  })

  describe('Computed Properties - overflowCount', () => {
    it('should return correct overflow count', () => {
      const badges = Array.from({ length: 10 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 3 })
      expect(wrapper.vm.overflowCount).toBe(7)
    })

    it('should return 0 if no overflow', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.overflowCount).toBe(0)
    })

    it('should equal overflowBadges length', () => {
      const badges = Array.from({ length: 15 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 5 })
      expect(wrapper.vm.overflowCount).toBe(wrapper.vm.overflowBadges.length)
    })
  })

  describe('Methods - normalizeBadgeForMixin', () => {
    it('should normalize badge with badgeName and badgeType', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Expert', badgeType: 'gold', level: 3 }
      const normalized = wrapper.vm.normalizeBadgeForMixin(badge)
      expect(normalized.name).toBe('Expert')
      expect(normalized.type).toBe('gold')
      expect(normalized.level).toBe(3)
    })

    it('should use name and type if badgeName not present', () => {
      const wrapper = mountComponent()
      const badge = { name: 'Intermediate', type: 'silver', level: 2 }
      const normalized = wrapper.vm.normalizeBadgeForMixin(badge)
      expect(normalized.name).toBe('Intermediate')
      expect(normalized.type).toBe('silver')
    })

    it('should handle null badge', () => {
      const wrapper = mountComponent()
      const normalized = wrapper.vm.normalizeBadgeForMixin(null)
      expect(normalized).toEqual({})
    })

    it('should handle badge with only level', () => {
      const wrapper = mountComponent()
      const badge = { level: 5 }
      const normalized = wrapper.vm.normalizeBadgeForMixin(badge)
      expect(normalized.level).toBe(5)
    })
  })

  describe('Methods - getBadgeKey', () => {
    it('should generate unique key for badge', () => {
      const wrapper = mountComponent()
      const badge = { badgeType: 'gold', level: 3 }
      const key = wrapper.vm.getBadgeKey(badge, 0)
      expect(key).toContain('gold')
      expect(key).toContain('3')
      expect(key).toContain('0')
    })

    it('should use type if badgeType not present', () => {
      const wrapper = mountComponent()
      const badge = { type: 'silver', level: 2 }
      const key = wrapper.vm.getBadgeKey(badge, 1)
      expect(key).toContain('silver')
    })

    it('should handle missing level', () => {
      const wrapper = mountComponent()
      const badge = { badgeType: 'gold' }
      const key = wrapper.vm.getBadgeKey(badge, 0)
      expect(key).toContain('gold')
      expect(key).toContain('0')
    })

    it('should handle null badge', () => {
      const wrapper = mountComponent()
      const key = wrapper.vm.getBadgeKey(null, 0)
      expect(key).toBeDefined()
    })
  })

  describe('Methods - getBadgeFallbackText', () => {
    it('should return badgeName if present', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Expert' }
      expect(wrapper.vm.getBadgeFallbackText(badge)).toBe('Expert')
    })

    it('should return name if badgeName not present', () => {
      const wrapper = mountComponent()
      const badge = { name: 'Intermediate' }
      expect(wrapper.vm.getBadgeFallbackText(badge)).toBe('Intermediate')
    })

    it('should return text if neither badgeName nor name present', () => {
      const wrapper = mountComponent()
      const badge = { text: 'Beginner' }
      expect(wrapper.vm.getBadgeFallbackText(badge)).toBe('Beginner')
    })

    it('should return bullet point if nothing present', () => {
      const wrapper = mountComponent()
      const badge = {}
      expect(wrapper.vm.getBadgeFallbackText(badge)).toBe('•')
    })

    it('should return question mark for null badge', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBadgeFallbackText(null)).toBe('?')
    })
  })

  describe('Methods - getBadgeTooltipText', () => {
    it('should return description if present', () => {
      const wrapper = mountComponent()
      const badge = { description: 'Expert level achievement' }
      expect(wrapper.vm.getBadgeTooltipText(badge)).toBe('Expert level achievement')
    })

    it('should return badgeName if description not present', () => {
      const wrapper = mountComponent()
      const badge = { badgeName: 'Expert' }
      expect(wrapper.vm.getBadgeTooltipText(badge)).toBe('Expert')
    })

    it('should return name if neither description nor badgeName present', () => {
      const wrapper = mountComponent()
      const badge = { name: 'Badge' }
      expect(wrapper.vm.getBadgeTooltipText(badge)).toBe('Badge')
    })

    it('should return empty string if nothing present', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBadgeTooltipText({})).toBe('')
    })

    it('should return empty string for null badge', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.getBadgeTooltipText(null)).toBe('')
    })
  })

  describe('Methods - handleCloseBadgesPopover', () => {
    it('should set isBadgesPopoverOpen to false', () => {
      const wrapper = mountComponent()
      wrapper.vm.isBadgesPopoverOpen = true
      wrapper.vm.handleCloseBadgesPopover()
      expect(wrapper.vm.isBadgesPopoverOpen).toBe(false)
    })

    it('should work when popover is already closed', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.isBadgesPopoverOpen).toBe(false)
      wrapper.vm.handleCloseBadgesPopover()
      expect(wrapper.vm.isBadgesPopoverOpen).toBe(false)
    })
  })

  describe('Loading State', () => {
    it('should render skeleton when isLoading is true', () => {
      const wrapper = mountComponent({ isLoading: true })
      expect(wrapper.find('.leaderboard-badges-column__skeleton').exists()).toBe(true)
    })

    it('should not render badge container when isLoading is true', () => {
      const wrapper = mountComponent({ isLoading: true })
      expect(wrapper.find('.leaderboard-badges-column__container').exists()).toBe(false)
    })

    it('should render badges when isLoading is false', () => {
      const wrapper = mountComponent({ isLoading: false })
      expect(wrapper.find('.leaderboard-badges-column__container').exists()).toBe(true)
    })

    it('should show 3 skeleton items when loading', () => {
      const wrapper = mountComponent({ isLoading: true })
      const skeletons = wrapper.findAll('.leaderboard-badges-column__skeleton-item')
      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Empty State', () => {
    it('should not render container when no badges and not loading', () => {
      const wrapper = mountComponent({ badges: [], isLoading: false })
      expect(wrapper.find('.leaderboard-badges-column__container').exists()).toBe(false)
    })

    it('should render skeleton only when empty and loading', () => {
      const wrapper = mountComponent({ badges: [], isLoading: true })
      expect(wrapper.find('.leaderboard-badges-column__skeleton').exists()).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({
        badges: [{ badgeName: 'Badge1', level: 1 }]
      })
      const wrapper2 = mountComponent({
        badges: [
          { badgeName: 'Badge1', level: 1 },
          { badgeName: 'Badge2', level: 2 }
        ]
      })

      expect(wrapper1.vm.totalBadgeCount).toBe(1)
      expect(wrapper2.vm.totalBadgeCount).toBe(2)
    })

    it('multiple instances should maintain separate popover state', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.isBadgesPopoverOpen = true
      expect(wrapper2.vm.isBadgesPopoverOpen).toBe(false)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow with many badges', () => {
      const badges = Array.from({ length: 20 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        badgeType: i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'silver' : 'bronze',
        level: Math.floor(Math.random() * 10)
      }))
      const wrapper = mountComponent({ badges, maxVisible: 5 })

      expect(wrapper.vm.totalBadgeCount).toBe(20)
      expect(wrapper.vm.visibleBadges).toHaveLength(5)
      expect(wrapper.vm.overflowBadges).toHaveLength(15)
      expect(wrapper.vm.overflowCount).toBe(15)
    })

    it('complete workflow with loading state transition', async () => {
      const wrapper = mountComponent({ isLoading: true, badges: [] })
      expect(wrapper.find('.leaderboard-badges-column__skeleton').exists()).toBe(true)

      await wrapper.setProps({ isLoading: false, badges: defaultProps.badges })
      expect(wrapper.find('.leaderboard-badges-column__container').exists()).toBe(true)
      expect(wrapper.vm.visibleBadges).toHaveLength(3)
    })

    it('complete workflow with badge popover interaction', () => {
      const badges = Array.from({ length: 10 }, (_, i) => ({
        badgeName: `Badge ${i}`,
        level: i
      }))
      const wrapper = mountComponent({ badges, maxVisible: 3 })

      expect(wrapper.vm.overflowCount).toBe(7)
      wrapper.vm.isBadgesPopoverOpen = true
      expect(wrapper.vm.isBadgesPopoverOpen).toBe(true)
      wrapper.vm.handleCloseBadgesPopover()
      expect(wrapper.vm.isBadgesPopoverOpen).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle badges with duplicate levels', () => {
      const badges = [
        { badgeName: 'Badge1', level: 5 },
        { badgeName: 'Badge2', level: 5 },
        { badgeName: 'Badge3', level: 5 }
      ]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.visibleBadges).toHaveLength(3)
    })

    it('should handle badges with negative levels', () => {
      const badges = [
        { badgeName: 'Badge1', level: -1 },
        { badgeName: 'Badge2', level: 10 }
      ]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.visibleBadges[0].level).toBe(10)
    })

    it('should handle very large maxVisible value', () => {
      const wrapper = mountComponent({ maxVisible: 1000 })
      expect(wrapper.vm.overflowBadges).toHaveLength(0)
    })

    it('should handle special characters in badge names', () => {
      const badges = [
        { badgeName: 'Badge <with> & special' },
        { badgeName: 'Badge "quotes"' }
      ]
      const wrapper = mountComponent({ badges })
      expect(wrapper.vm.visibleBadges).toHaveLength(2)
    })

    it('should handle rapid badge updates', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        const badges = Array.from({ length: i + 1 }, (_, j) => ({
          badgeName: `Badge ${j}`,
          level: j
        }))
        await wrapper.setProps({ badges })
      }
      expect(wrapper.vm).toBeDefined()
    })
  })

})
