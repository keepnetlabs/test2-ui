import { shallowMount } from '@vue/test-utils'
import UsersDashboardActivityTimeline from '@/components/UsersDashboard/UsersDashboardActivityTimeline.vue'
import { getUserTimeline } from '@/api/usersDashboard'

jest.mock('@/api/usersDashboard', () => ({
  getUserTimeline: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setImmediate(resolve))

describe('UsersDashboardActivityTimeline.vue', () => {
  const labels = {
    activityTimelineTitle: 'Timeline',
    activityTimelineSubtitle: 'Subtitle',
    activityTimelineEmptyMessage: 'No activity',
    activityTimelineLoadMore: 'Load More',
    activityTimelineCategory: 'Category.',
    activityTimelineDifficulty: 'Difficulty.',
    activityTimelineDifficulity: 'Difficulity',
    activityTimelineCampaignSentTo: () => 'campaign sent',
    actionTypeEmailSent: 'Email Sent Label',
    actionTypeClickedLink: 'Clicked Link Label'
  }

  const createWrapper = (getterOverrides = {}, routeOverrides = {}) =>
    shallowMount(UsersDashboardActivityTimeline, {
      stubs: {
        VCard: true,
        VBtn: true,
        ThreeListItemLoading: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLabels': labels,
            'usersDashboard/getUserInfo': { name: 'User Name', email: 'user@example.com' },
            ...getterOverrides
          }
        },
        $route: {
          query: {
            targetUserResourceId: 'RESOURCE-123',
            ...routeOverrides
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getUserTimeline.mockResolvedValue({
      data: {
        data: {
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1,
          results: []
        }
      }
    })
  })

  it('renders and has expected component name', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardActivityTimeline')
  })

  it('calls timeline API on created with current user resource id', async () => {
    createWrapper()
    await flushPromises()

    expect(getUserTimeline).toHaveBeenCalledTimes(1)
    expect(getUserTimeline.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        targetUserResourceId: 'RESOURCE-123'
      })
    )
  })

  it('returns fallback user resource id when query is missing', () => {
    const wrapper = createWrapper({}, { targetUserResourceId: undefined })
    expect(wrapper.vm.getCurrentUserResourceId()).toBe('4BCeEWHwAKME')
  })

  it('filters headers and slices timeline by displayedItemsCount', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.setData({
      timeline: [
        { type: 'header' },
        { type: 'item', id: 1, productType: 'PHISHING SIMULATOR - BASIC', ActionType: 'Email Sent' },
        { type: 'item', id: 2, productType: 'PHISHING SIMULATOR - BASIC', ActionType: 'Email Sent' },
        { type: 'item', id: 3, productType: 'PHISHING SIMULATOR - BASIC', ActionType: 'Email Sent' },
        { type: 'item', id: 4, productType: 'PHISHING SIMULATOR - BASIC', ActionType: 'Email Sent' }
      ],
      displayedItemsCount: 2
    })

    expect(wrapper.vm.filteredTimeline).toHaveLength(2)
    expect(wrapper.vm.filteredTimeline[0].id).toBe(1)
    expect(wrapper.vm.isLoadMoreVisible).toBe(true)
  })

  it('computes labels for category and difficulty', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.categoryLabel).toBe('Category')
    expect(wrapper.vm.difficultyLabel).toBe('Difficulty')
    expect(wrapper.vm.difficulityLabel).toBe('Difficulity')
  })

  it('maps action type label and falls back to action type text', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getActionTypeLabel('Email Sent')).toBe('Email Sent Label')
    expect(wrapper.vm.getActionTypeLabel('Unknown Action')).toBe('Unknown Action')
  })

  it('returns awareness check and product type mappings', () => {
    const wrapper = createWrapper()
    expect(
      wrapper.vm.isProductAwareness({
        productType: 'SECURITY AWARENESS - BASIC'
      })
    ).toBe(true)
    expect(
      wrapper.vm.getProductType({
        productType: 'SMISHING SIMULATOR - BASIC'
      })
    ).toBe('smishing campaign')
    expect(
      wrapper.vm.getProductType({
        productType: 'UNKNOWN PRODUCT'
      })
    ).toBe('')
  })

  it('increments displayed item count in handleLoadMore', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ displayedItemsCount: 3 })
    wrapper.vm.handleLoadMore()
    expect(wrapper.vm.displayedItemsCount).toBe(6)
  })
})
