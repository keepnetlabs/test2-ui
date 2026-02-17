import { shallowMount } from '@vue/test-utils'
import UsersDashboardRecentBadges from '@/components/UsersDashboard/UsersDashboardRecentBadges.vue'

describe('UsersDashboardRecentBadges.vue', () => {
  const labels = {
    recentBadgesTitle: 'Recent Badges',
    recentBadgesSubtitle: 'Subtitle',
    recentBadgesSeeAll: 'See all',
    recentBadgesNoBadges: 'No badges',
    yourBadgesEarnedOn: (date) => `Earned on ${date}`
  }

  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardRecentBadges, {
      stubs: {
        'v-card': true,
        'v-skeleton-loader': true,
        'v-tooltip': true,
        VIcon: true
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
    expect(wrapper.vm.$options.name).toBe('UsersDashboardRecentBadges')
  })

  it('returns loading state and badgeCount 3 while loading', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyBadgesLoading': true
    })

    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.vm.badgeCount).toBe(3)
  })

  it('filters earned badges, sorts by earnedDate and limits to 3', () => {
    const wrapper = createWrapper({
      'usersDashboard/getMyBadges': [
        {
          badgeType: 1,
          badgeName: 'B1',
          earned: true,
          earnedDate: '2026-01-01T10:00:00Z'
        },
        {
          badgeType: 2,
          badgeName: 'B2',
          earned: false,
          earnedDate: '2026-02-01T10:00:00Z'
        },
        {
          badgeType: 3,
          badgeName: 'B3',
          earned: true,
          earnedDate: '2026-03-01T10:00:00Z'
        },
        {
          badgeType: 4,
          badgeName: 'B4',
          earned: true,
          earnedDate: '2026-04-01T10:00:00Z'
        },
        {
          badgeType: 5,
          badgeName: 'B5',
          earned: true,
          earnedDate: '2026-05-01T10:00:00Z'
        }
      ]
    })

    expect(wrapper.vm.recentBadges).toHaveLength(3)
    expect(wrapper.vm.recentBadges[0].name).toBe('B5')
    expect(wrapper.vm.recentBadges[1].name).toBe('B4')
    expect(wrapper.vm.recentBadges[2].name).toBe('B3')
    expect(wrapper.vm.badgeCount).toBe(3)
  })

  it('formats earned date as dd/mm/yyyy', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.formatBadgeEarnedDate('2026-12-05T01:00:00Z')).toBe('05/12/2026')
    expect(wrapper.vm.formatBadgeEarnedDate('')).toBe('')
  })

  it('scrolls to your badges section when handleSeeAllBadges finds element', () => {
    const wrapper = createWrapper()
    const scrollIntoView = jest.fn()
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView
    })

    wrapper.vm.handleSeeAllBadges()

    expect(getElementByIdSpy).toHaveBeenCalledWith('users-dashboard-your-badges')
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })
    getElementByIdSpy.mockRestore()
  })
})
