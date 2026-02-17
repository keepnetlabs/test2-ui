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

describe('CampaignManagerReportSummaryLandingPage.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes title from formData name', () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryLandingPage, {
      propsData: {
        formData: { name: 'Landing A' },
        isFetchingSummary: false
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonSimulatorLandingPageTemplatesPreviewDialog: true
      }
    })

    expect(wrapper.vm.getTitle).toBe('Landing Page: Landing A')
  })

  it('loads languages on created and maps options', async () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryLandingPage, {
      propsData: {
        formData: { name: 'Landing A' }
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonSimulatorLandingPageTemplatesPreviewDialog: true
      }
    })
    await flushPromises()

    expect(LookupLocalStorage.getSingle).toHaveBeenCalledWith(21)
    expect(wrapper.vm.languageOptions).toEqual([
      {
        text: 'English',
        languageTypeName: 'English',
        value: 'lang-1',
        code: 'en'
      }
    ])
  })

  it('sets preview selected row when landing page dialog is opened', async () => {
    const wrapper = shallowMount(CampaignManagerReportSummaryLandingPage, {
      propsData: {
        formData: { resourceId: 'lp-1', name: 'Landing X' },
        isFetchingSummary: false
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        CommonSimulatorLandingPageTemplatesPreviewDialog: true
      }
    })

    await wrapper.setData({ isShowLandingPageTemplate: true })

    expect(wrapper.vm.landingPagePreviewSelectedRow).toEqual({
      resourceId: 'lp-1',
      name: 'Landing X'
    })
  })
})
