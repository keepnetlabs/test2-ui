import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryPhishingEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryPhishingEmail'
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

describe('CampaignManagerReportSummaryPhishingEmail.vue (extra branch coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryPhishingEmail, {
      propsData: {
        formData: { resourceId: 'email-1', name: 'Phishing Template A' },
        isFetchingSummary: false,
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        EmailTemplateMultipleLanguagePreviewDialog: true
      }
    })

  it('getTitle fallback with missing formData.name', () => {
    const wrapper = createWrapper({ formData: {} })
    expect(wrapper.vm.getTitle).toBe('Email Template: ')
  })

  it('watcher does not set selected row when opened without resourceId', async () => {
    const wrapper = createWrapper({ formData: { name: 'Only Name' } })
    await wrapper.setData({ isShowEmailTemplate: true })
    expect(wrapper.vm.emailTemplatePreviewSelectedRow).toBe(null)
  })

  it('watcher ignores false state and keeps existing selected row', async () => {
    const wrapper = createWrapper()
    wrapper.setData({ emailTemplatePreviewSelectedRow: { resourceId: 'old', name: 'Old' } })
    await wrapper.setData({ isShowEmailTemplate: false })
    expect(wrapper.vm.emailTemplatePreviewSelectedRow).toEqual({ resourceId: 'old', name: 'Old' })
  })

  it('callForLanguages maps empty array when lookup is undefined', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce(undefined)
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.vm.languageOptions).toEqual([])
  })
})
