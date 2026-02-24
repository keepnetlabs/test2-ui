import { createLocalVue, shallowMount } from '@vue/test-utils'
import GamificationReportUserDetailsDrawerSummaryTab from '@/components/GamificationReport/GamificationReportUserDetailsDrawer/GamificationReportUserDetailsDrawerSummaryTab'
import { getUserTimeline } from '@/api/reports'

jest.mock('@/api/reports', () => ({
  getUserTimeline: jest.fn()
}))

describe('GamificationReportUserDetailsDrawerSummaryTab.vue (extra coverage)', () => {
  const localVue = createLocalVue()
  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(GamificationReportUserDetailsDrawerSummaryTab, {
      localVue,
      propsData: {
        selectedRow: { firstName: 'John', lastName: 'Doe', resourceId: '123' },
        datePayload: { datePeriod: 'CUSTOM', startDate: '2025-01-01', endDate: '2025-02-17' },
        overallScore: {},
        productScores: [],
        isPerformanceRatesLoading: false,
        ...propsData
      },
      stubs: {
        VTooltip: true,
        VIcon: true,
        VSkeletonLoader: true,
        DatatableLoading: true
      },
      mocks: {
        $store: {
          getters: {
            'gamificationBadges/getBadgesForUser': () => [],
            'gamificationBadges/hasValidCache': () => false,
            'gamificationBadges/isCalculating': false,
            'gamificationBadges/isFetching': false,
            'usersDashboard/getLabels': {},
            'usersDashboard/getLanguage': 'en'
          }
        }
      },
      ...options
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getUserTimeline.mockResolvedValue({ data: { data: { results: [] } } })
  })

  it('badges computed falls back to empty array when getter does not return array', () => {
    const wrapper = mountComponent({}, {
      mocks: {
        $store: {
          getters: {
            'gamificationBadges/getBadgesForUser': () => null,
            'gamificationBadges/hasValidCache': () => false,
            'gamificationBadges/isCalculating': false,
            'gamificationBadges/isFetching': false,
            'usersDashboard/getLabels': {},
            'usersDashboard/getLanguage': 'en'
          }
        }
      }
    })

    expect(wrapper.vm.badges).toEqual([])
  })

  it('isBadgesLoading is false when target user id is missing', () => {
    const wrapper = mountComponent({ selectedRow: { firstName: 'No', lastName: 'Id' } })

    expect(wrapper.vm.targetUserResourceId).toBeUndefined()
    expect(wrapper.vm.isBadgesLoading).toBe(false)
  })

  it('callForTimelinePreview resets loading state even when API fails', async () => {
    getUserTimeline.mockResolvedValueOnce({ data: { data: { results: [] } } })
    const wrapper = mountComponent()
    await flushPromises()

    getUserTimeline.mockRejectedValueOnce(new Error('timeline failed'))
    wrapper.vm.timelinePreview = [{ id: 'old' }]
    wrapper.vm.callForTimelinePreview()
    await flushPromises()

    expect(wrapper.vm.isTimelineLoading).toBe(false)
    expect(wrapper.vm.timelinePreview).toEqual([{ id: 'old' }])
  })

  it('getBadgeEarnedDateFormatted uses alternate date aliases', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.getBadgeEarnedDateFormatted({ earned_at: '2025-04-11T00:00:00Z' })).toBe(
      '11/04/2025'
    )
    expect(wrapper.vm.getBadgeEarnedDateFormatted({ dateEarned: '2025-04-12T00:00:00Z' })).toBe(
      '12/04/2025'
    )
  })

  it('isProductAwareness and getProductType handle all product branches', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.isProductAwareness({ productType: 'AWARENESS EDUCATOR - BASIC' })).toBe(true)
    expect(wrapper.vm.isProductAwareness({ productType: 'SECURITY AWARENESS' })).toBe(true)
    expect(wrapper.vm.isProductAwareness({ productType: 'PHISHING SIMULATOR - EASY' })).toBe(false)

    expect(wrapper.vm.getProductType({ productType: 'PHISHING SIMULATOR - X' })).toBe(
      'phishing campaign'
    )
    expect(wrapper.vm.getProductType({ productType: 'SMISHING SIMULATOR - X' })).toBe(
      'smishing campaign'
    )
    expect(wrapper.vm.getProductType({ productType: 'CALLBACK SIMULATOR - X' })).toBe(
      'callback campaign'
    )
    expect(wrapper.vm.getProductType({ productType: 'VISHING SIMULATOR - X' })).toBe(
      'vishing campaign'
    )
    expect(wrapper.vm.getProductType({ productType: 'QUISHING SIMULATOR - X' })).toBe(
      'quishing campaign'
    )
    expect(wrapper.vm.getProductType({ productType: 'UNKNOWN - X' })).toBe('')
  })

  it('getProductIconPath resolves icon for opened/fail/neutral/default branches', () => {
    const wrapper = mountComponent()

    expect(
      wrapper.vm.getProductIconPath({
        productType: 'PHISHING SIMULATOR - TEST',
        ActionType: 'Opened Email'
      })
    ).toBeDefined()

    expect(
      wrapper.vm.getProductIconPath({
        productType: 'SECURITY AWARENESS - TEST',
        ActionType: 'Clicked Link'
      })
    ).toBeDefined()

    expect(
      wrapper.vm.getProductIconPath({
        productType: 'CALLBACK SIMULATOR - TEST',
        ActionType: 'Email Sent'
      })
    ).toBeDefined()

    expect(
      wrapper.vm.getProductIconPath({
        productType: 'UNKNOWN PRODUCT - TEST',
        ActionType: 'Anything'
      })
    ).toBeDefined()
  })
})
