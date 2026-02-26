import { createLocalVue, shallowMount } from '@vue/test-utils'
import LeaderboardBadgesColumn from '@/components/GamificationReport/LeaderboardBadgesColumn.vue'

describe('LeaderboardBadgesColumn.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(LeaderboardBadgesColumn, {
      localVue,
      propsData: {
        badges: [],
        maxVisible: 3,
        isLoading: false,
        ...propsData
      },
      stubs: {
        VTooltip: true,
        VMenu: true,
        LeaderboardBadgesPopover: true
      }
    })

  it('overflowTooltipText is empty when there is no overflow', () => {
    const wrapper = mountComponent({
      badges: [{ badgeName: 'A', level: 1 }, { badgeName: 'B', level: 2 }],
      maxVisible: 3
    })

    expect(wrapper.vm.overflowCount).toBe(0)
    expect(wrapper.vm.overflowTooltipText).toBe('')
  })

  it('overflowTooltipText joins fallback tooltip values for hidden badges', () => {
    const wrapper = mountComponent({
      badges: [
        { badgeName: 'Top', level: 9, description: 'Top Desc' },
        { badgeName: 'Second', level: 8, description: 'Second Desc' },
        { badgeName: 'Third', level: 7 },
        { name: 'Fourth', level: 6 }
      ],
      maxVisible: 2
    })

    expect(wrapper.vm.overflowBadges.map((b) => b.level)).toEqual([7, 6])
    expect(wrapper.vm.overflowTooltipText).toBe('Third, Fourth')
  })

  it('normalizeBadgeForMixin returns empty object for nullish badge', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.normalizeBadgeForMixin(null)).toEqual({})
    expect(wrapper.vm.normalizeBadgeForMixin(undefined)).toEqual({})
  })

  it('getBadgeFallbackText returns bullet when badge has no text fields', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getBadgeFallbackText({ level: 1 })).toBe('\u2022')
    expect(wrapper.vm.getBadgeFallbackText(null)).toBe('?')
  })

  it('handleCloseBadgesPopover closes popover state', () => {
    const wrapper = mountComponent()
    wrapper.vm.isBadgesPopoverOpen = true

    wrapper.vm.handleCloseBadgesPopover()

    expect(wrapper.vm.isBadgesPopoverOpen).toBe(false)
  })

  it('visibleBadges and overflowBadges respect maxVisible boundary exactly', () => {
    const wrapper = mountComponent({
      badges: [
        { badgeName: 'A', level: 3 },
        { badgeName: 'B', level: 2 },
        { badgeName: 'C', level: 1 }
      ],
      maxVisible: 3
    })

    expect(wrapper.vm.visibleBadges).toHaveLength(3)
    expect(wrapper.vm.overflowBadges).toEqual([])
  })

  it('normalizeBadgeForMixin prioritizes badgeName/badgeType over name/type', () => {
    const wrapper = mountComponent()
    const normalized = wrapper.vm.normalizeBadgeForMixin({
      badgeName: 'Primary',
      name: 'Fallback',
      badgeType: 'gold',
      type: 'silver',
      level: 4
    })

    expect(normalized).toEqual({
      name: 'Primary',
      type: 'gold',
      level: 4
    })
  })

  it('getBadgeTooltipText prioritizes description then badgeName then name', () => {
    const wrapper = mountComponent()

    expect(
      wrapper.vm.getBadgeTooltipText({
        description: 'Desc',
        badgeName: 'BadgeName',
        name: 'Name'
      })
    ).toBe('Desc')
    expect(wrapper.vm.getBadgeTooltipText({ badgeName: 'BadgeName', name: 'Name' })).toBe(
      'BadgeName'
    )
    expect(wrapper.vm.getBadgeTooltipText({ name: 'Name' })).toBe('Name')
  })

  it('getBadgeKey falls back to type and level default values', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getBadgeKey({ type: 'fallback-type' }, 1)).toBe('fallback-type-0-1')
    expect(wrapper.vm.getBadgeKey({}, 2)).toBe('-0-2')
  })

  it('totalBadgeCount returns 0 for non-array badges', () => {
    const wrapper = mountComponent({ badges: null })
    expect(wrapper.vm.totalBadgeCount).toBe(0)
  })
})
