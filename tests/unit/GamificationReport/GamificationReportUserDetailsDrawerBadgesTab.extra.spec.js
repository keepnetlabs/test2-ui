import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerBadgesTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerBadgesTab.vue'

describe('GamificationReportUserDetailsDrawerBadgesTab.vue (extra)', () => {
  const createWrapper = (propsData = {}, storeOverrides = {}) =>
    shallowMount(GamificationReportUserDetailsDrawerBadgesTab, {
      localVue: createLocalVue(),
      propsData: {
        selectedRow: {
          firstName: 'Jane',
          lastName: 'Doe',
          resourceId: 'r1',
          targetUserResourceId: 'r1'
        },
        ...propsData
      },
      stubs: { ElTabs: true, ElTabPane: true, VTooltip: true, VIcon: true, VSkeletonLoader: true },
      mocks: {
        $store: {
          dispatch: jest.fn(),
          getters: {
            'gamificationBadges/getAllBadgesForUser': () => [],
            'gamificationBadges/hasValidCache': () => true,
            'gamificationBadges/isCalculating': false,
            'gamificationBadges/isFetching': false,
            'usersDashboard/getLabels': {
              yourBadgesEarned: 'Earned',
              yourBadgesNotEarnedYet: 'Not earned yet',
              yourBadgesEarnedOn: (d) => `Earned on ${d}`
            },
            'usersDashboard/getLanguage': 'en',
            ...storeOverrides
          }
        }
      }
    })

  it('targetUserResourceId uses targetUserResourceId when present', () => {
    const wrapper = createWrapper({
      selectedRow: { targetUserResourceId: 't1', resourceId: 'r1' }
    })
    expect(wrapper.vm.targetUserResourceId).toBe('t1')
  })

  it('targetUserResourceId falls back to resourceId', () => {
    const wrapper = createWrapper({
      selectedRow: { resourceId: 'r1', firstName: 'X', lastName: 'Y' }
    })
    expect(wrapper.vm.targetUserResourceId).toBe('r1')
  })

  it('normalizeBadge returns empty object for null', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.normalizeBadge(null)).toEqual({})
  })

  it('normalizeBadge maps badgeName/name and badgeType/type', () => {
    const wrapper = createWrapper()
    const result = wrapper.vm.normalizeBadge({
      badgeName: 'B1',
      badgeType: 'gold',
      level: 2,
      description: 'Desc'
    })
    expect(result).toEqual({ name: 'B1', type: 'gold', level: 2, description: 'Desc' })
  })

  it('getBadgeKey uses badgeType or type', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getBadgeKey({ badgeType: 'gold', level: 1 }, 0)).toContain('gold')
    expect(wrapper.vm.getBadgeKey({ type: 'silver', level: 2 }, 1)).toContain('silver')
  })

  it('formatBadgeEarnedDate returns empty for invalid date', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.formatBadgeEarnedDate('invalid')).toBe('')
  })

  it('formatBadgeEarnedDate parses DD/MM/YYYY format', () => {
    const wrapper = createWrapper()
    const result = wrapper.vm.formatBadgeEarnedDate('15/03/2024')
    expect(result).toMatch(/\d{2}\/\d{2}\/2024/)
  })

  it('isLoading is false when target user id is missing', () => {
    const wrapper = createWrapper({
      selectedRow: { firstName: 'No', lastName: 'Id' }
    })
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('isLoading is true when cache is invalid and calculating/fetching is active', () => {
    const wrapper = createWrapper(
      {},
      {
        'gamificationBadges/hasValidCache': () => false,
        'gamificationBadges/isCalculating': true,
        'gamificationBadges/isFetching': false
      }
    )
    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('getBadgeStatus returns yourBadgesEarned when earned date is missing', () => {
    const wrapper = createWrapper(
      {},
      {
        'usersDashboard/getLabels': {
          yourBadgesEarned: 'Earned Label',
          yourBadgesNotEarnedYet: 'Not yet'
        }
      }
    )

    expect(wrapper.vm.getBadgeStatus({ earned: true })).toBe('Earned Label')
  })

  it('getBadgeStatus uses yourBadgesEarnedOn callback with createdAt alias', () => {
    const wrapper = createWrapper(
      {},
      {
        'usersDashboard/getLabels': {
          yourBadgesEarned: 'Earned',
          yourBadgesNotEarnedYet: 'Not yet',
          yourBadgesEarnedOn: (d) => `Earned At ${d}`
        }
      }
    )

    const status = wrapper.vm.getBadgeStatus({
      earned: true,
      createdAt: '2025-03-20T00:00:00Z'
    })

    expect(status).toBe('Earned At 20/03/2025')
  })

  it('getBadgeStatus supports earned_at/dateEarned aliases', () => {
    const wrapper = createWrapper()

    const statusEarnedAt = wrapper.vm.getBadgeStatus({
      earned: true,
      earned_at: '2025-05-01T00:00:00Z'
    })
    const statusDateEarned = wrapper.vm.getBadgeStatus({
      earned: true,
      dateEarned: '2025-05-02T00:00:00Z'
    })

    expect(statusEarnedAt).toContain('01/05/2025')
    expect(statusDateEarned).toContain('02/05/2025')
  })

  it('getBadgeStatus returns fallback "Not earned yet" when labels are missing', () => {
    const wrapper = createWrapper(
      {},
      {
        'usersDashboard/getLabels': {}
      }
    )

    expect(wrapper.vm.getBadgeStatus({ earned: false })).toBe('Not earned yet')
  })

  it('getBadgeType returns empty string for nullish badge and honors badgeType over type', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getBadgeType(null)).toBe('')
    expect(wrapper.vm.getBadgeType({ badgeType: 'gold', type: 'silver' })).toBe('gold')
    expect(wrapper.vm.getBadgeType({ type: 'bronze' })).toBe('bronze')
  })

  it('getTooltipContent prefers description and falls back to display name', () => {
    const wrapper = createWrapper()
    wrapper.vm.getBadgeDescription = jest.fn(() => 'Desc from mixin')
    wrapper.vm.getBadgeDisplayName = jest.fn(() => 'Fallback Name')

    expect(wrapper.vm.getTooltipContent({ badgeName: 'A' })).toBe('Desc from mixin')

    wrapper.vm.getBadgeDescription = jest.fn(() => '')
    expect(wrapper.vm.getTooltipContent({ badgeName: 'A' })).toBe('Fallback Name')
  })

  it('formatBadgeEarnedDate handles thrown errors and returns empty string', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.formatBadgeEarnedDate(Symbol('bad-date'))).toBe('')
  })

  it('created hook dispatches fetch action when target user id exists', () => {
    const wrapper = createWrapper({
      selectedRow: {
        firstName: 'Jane',
        lastName: 'Doe',
        targetUserResourceId: 'target-1'
      }
    })

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'gamificationBadges/fetchBadgesForTable',
      ['target-1']
    )
  })

  it('created hook does not dispatch when user id is missing', () => {
    const wrapper = createWrapper({
      selectedRow: { firstName: 'No', lastName: 'Id' }
    })

    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('allBadges returns empty array when store getter does not return an array', () => {
    const wrapper = createWrapper(
      {},
      {
        'gamificationBadges/getAllBadgesForUser': () => null
      }
    )

    expect(wrapper.vm.allBadges).toEqual([])
  })

  it('getBadgesByLevel compares numeric levels and defaults missing level to 1', () => {
    const wrapper = createWrapper(
      {},
      {
        'gamificationBadges/getAllBadgesForUser': () => [
          { badgeName: 'default-level', level: undefined },
          { badgeName: 'level-2', level: '2' },
          { badgeName: 'level-3', level: 3 }
        ]
      }
    )

    expect(wrapper.vm.getBadgesByLevel(1).map((b) => b.badgeName)).toEqual(['default-level'])
    expect(wrapper.vm.getBadgesByLevel(2).map((b) => b.badgeName)).toEqual(['level-2'])
    expect(wrapper.vm.getBadgesByLevel(3).map((b) => b.badgeName)).toEqual(['level-3'])
  })

  it('getBadgeDisplayName falls back when getBadgeName throws', () => {
    const wrapper = createWrapper()
    wrapper.vm.getBadgeName = jest.fn(() => {
      throw new Error('boom')
    })

    expect(wrapper.vm.getBadgeDisplayName({ badgeName: 'Badge A' })).toBe('Badge A')
    expect(wrapper.vm.getBadgeDisplayName({ name: 'Badge B' })).toBe('Badge B')
  })

  it('getBadgeStatus falls back to "Earned" when labels and formatted date are missing', () => {
    const wrapper = createWrapper(
      {},
      {
        'usersDashboard/getLabels': {}
      }
    )

    expect(wrapper.vm.getBadgeStatus({ earned: true, earnedDate: 'invalid-date' })).toBe('Earned')
  })

  it('getBadgeStatus falls back to default "Earned on {date}" when labels callback is missing', () => {
    const wrapper = createWrapper(
      {},
      {
        'usersDashboard/getLabels': {
          yourBadgesEarned: 'Earned'
        }
      }
    )

    const text = wrapper.vm.getBadgeStatus({
      earned: true,
      earnedOn: '2025-08-14T00:00:00Z'
    })

    expect(text).toBe('Earned on 14/08/2025')
  })

  it('getBadgeDisplayName returns getBadgeName value when it is available', () => {
    const wrapper = createWrapper()
    wrapper.vm.getBadgeName = jest.fn(() => 'Resolved Name')

    expect(wrapper.vm.getBadgeDisplayName({ badgeName: 'Raw Name' })).toBe('Resolved Name')
  })

  it('getBadgeType returns empty when both badgeType and type are nullish', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getBadgeType({ badgeType: null, type: undefined })).toBe('')
  })

  it('getTooltipContent returns empty string when description and display name are empty', () => {
    const wrapper = createWrapper()
    wrapper.vm.getBadgeDescription = jest.fn(() => '')
    wrapper.vm.getBadgeDisplayName = jest.fn(() => '')

    expect(wrapper.vm.getTooltipContent({})).toBe('')
  })
})
