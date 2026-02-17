import { shallowMount } from '@vue/test-utils'
import UsersDashboardYourBadges from '@/components/UsersDashboard/UsersDashboardYourBadges.vue'

describe('UsersDashboardYourBadges.vue', () => {
  const labels = {
    yourBadgesTitle: 'Your Badges',
    yourBadgesSubtitle: 'Subtitle',
    yourBadgesNoBadges: 'No badges',
    yourBadgesNotEarnedYet: 'Not earned yet',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`
  }

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardYourBadges, {
      stubs: {
        VCard: true,
        VIcon: true,
        'v-tooltip': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getMyBadges': [],
            'usersDashboard/getMyBadgesLoading': false,
            'usersDashboard/getLanguage': 'en-GB',
            ...getterOverrides
          }
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardYourBadges')
  })

  it('returns empty badges when source list is empty', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.badges).toEqual([])
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('maps and sorts badges with earned badges first', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyBadges': [
        {
          badgeType: 3,
          badgeName: 'Not Earned Badge',
          earned: false,
          level: 1
        },
        {
          badgeType: 1,
          badgeName: 'Earned Badge',
          earned: true,
          earnedDate: '2026-01-12T10:00:00Z',
          level: 2,
          description: 'desc'
        }
      ]
    })

    expect(wrapper.vm.badges).toHaveLength(2)
    expect(wrapper.vm.badges[0]).toEqual(
      expect.objectContaining({
        name: 'Earned Badge',
        type: 1,
        isEarned: true,
        level: 2,
        description: 'desc'
      })
    )
    expect(wrapper.vm.badges[1]).toEqual(
      expect.objectContaining({
        name: 'Not Earned Badge',
        isEarned: false
      })
    )
  })

  it('reflects loading state from store getter', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyBadgesLoading': true
    })
    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('returns earned status text with formatted date', () => {
    const wrapper = createWrapper()
    const result = wrapper.vm.getBadgeStatus({
      isEarned: true,
      earnedDate: '2026-03-05T09:00:00Z'
    })

    expect(result).toContain('Earned on')
    expect(result).toContain('05/03/2026')
  })

  it('returns empty string for earned badge without date', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getBadgeStatus({
        isEarned: true,
        earnedDate: null
      })
    ).toBe('')
  })

  it('returns not-earned label for non-earned badge', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.getBadgeStatus({
        isEarned: false
      })
    ).toBe(labels.yourBadgesNotEarnedYet)
  })
})
