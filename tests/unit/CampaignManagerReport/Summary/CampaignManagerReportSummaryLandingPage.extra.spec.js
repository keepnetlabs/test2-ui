import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  getSingle: jest.fn(() =>
    Promise.resolve([
      {
        isoFriendlyName: 'English',
        name: 'English',
        resourceId: 'lang-1',
        description: 'en'
      }
    ])
  )
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummaryLandingPage.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryLandingPage, {
      propsData: {
        formData: { resourceId: 'lp-1', name: 'Landing A' },
        isFetchingSummary: false,
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonSimulatorLandingPageTemplatesPreviewDialog: true
      }
    })

  it('getTitle falls back to empty name when formData.name is missing', () => {
    const wrapper = createWrapper({ formData: {} })
    expect(wrapper.vm.getTitle).toBe('Landing Page: ')
  })

  it('watcher does not set selected row when dialog opens without resourceId', async () => {
    const wrapper = createWrapper({ formData: { name: 'Landing X' } })
    await wrapper.setData({ isShowLandingPageTemplate: true })
    expect(wrapper.vm.landingPagePreviewSelectedRow).toBe(null)
  })

  it('watcher ignores false dialog state', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ landingPagePreviewSelectedRow: { resourceId: 'old', name: 'Old' } })
    await wrapper.setData({ isShowLandingPageTemplate: false })
    expect(wrapper.vm.landingPagePreviewSelectedRow).toEqual({ resourceId: 'old', name: 'Old' })
  })

  it('callForLanguages maps empty list when lookup response is undefined', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(undefined)
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.languageOptions).toEqual([])
  })
})
