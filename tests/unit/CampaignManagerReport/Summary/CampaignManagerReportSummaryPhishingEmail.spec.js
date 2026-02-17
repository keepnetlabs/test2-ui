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

describe('CampaignManagerReportSummaryPhishingEmail.vue', () => {
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

  it('computes title using template name', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getTitle).toBe('Email Template: Phishing Template A')
  })

  it('loads language options on created', async () => {
    const wrapper = createWrapper()
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

  it('watcher sets selected row when preview dialog is opened', async () => {
    const wrapper = createWrapper()

    await wrapper.setData({ isShowEmailTemplate: true })

    expect(wrapper.vm.emailTemplatePreviewSelectedRow).toEqual({
      resourceId: 'email-1',
      name: 'Phishing Template A'
    })
  })
})
