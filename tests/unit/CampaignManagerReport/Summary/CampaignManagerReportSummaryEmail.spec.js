import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'

jest.mock('@/api/phishingsimulator', () => ({
  getCampaignManagerEmailTemplatePreviewContent: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          template: '<html>Email</html>',
          difficultyResourceId: 'diff-1',
          categoryResourceId: 'method-1',
          fromName: 'Security Team',
          fromAddress: 'security@company.com',
          name: 'Template A',
          isAssistedByAI: true
        }
      }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  getDifficultyBadgeColor: jest.fn((text) => `color-${text}`)
}))

const { getCampaignManagerEmailTemplatePreviewContent } = require('@/api/phishingsimulator')

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummaryEmail.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(CampaignManagerReportSummaryEmail, {
      propsData: {
        formData: {
          resourceId: 'temp-1',
          campaignResourceId: 'camp-1',
          instanceGroup: 'ig-1',
          languageShortCode: 'EN'
        },
        difficulties: [{ value: 'diff-1', text: 'Hard' }],
        methods: [{ value: 'method-1', text: 'Credential Harvesting' }],
        isFetchingSummary: false,
        ...propsData
      },
      stubs: {
        CampaignManagerSummaryCard: true,
        Badge: true,
        KEmailPreview: true,
        DatatableLoading: true,
        AttachmentsPreview: true,
        VTooltip: true,
        VIcon: true,
        VBtn: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads and maps template fields from API response', async () => {
    const wrapper = createWrapper()

    wrapper.vm.callForTemplate(false)
    await flushPromises()

    expect(getCampaignManagerEmailTemplatePreviewContent).toHaveBeenCalledWith('temp-1', 'camp-1', 'ig-1')
    expect(wrapper.vm.emailTemplate).toBe('<html>Email</html>')
    expect(wrapper.vm.difficulty).toBe('Hard')
    expect(wrapper.vm.method).toBe('Credential Harvesting')
    expect(wrapper.vm.fromName).toBe('Security Team')
    expect(wrapper.vm.fromAddress).toBe('security@company.com')
    expect(wrapper.vm.name).toBe('Template A')
    expect(wrapper.vm.isAssistedByAI).toBe(true)
  })

  it('watcher calls template API when email preview is opened and no cached template', async () => {
    const wrapper = createWrapper()
    const spy = jest.spyOn(wrapper.vm, 'callForTemplate')
    wrapper.setData({ emailTemplate: null })

    await wrapper.setData({ isShowEmailTemplate: true })

    expect(spy).toHaveBeenCalled()
  })

  it('resourceId watcher calls callForTemplate with showLoader false', () => {
    const wrapper = createWrapper()
    const spy = jest.spyOn(wrapper.vm, 'callForTemplate')

    wrapper.vm.$options.watch['formData.resourceId'].call(wrapper.vm)

    expect(spy).toHaveBeenCalledWith(false)
  })

  it('returns formData length and badge text passthrough helper', () => {
    const wrapper = createWrapper({
      formData: { resourceId: 'x', campaignResourceId: 'y', instanceGroup: 'z' }
    })

    expect(wrapper.vm.isFormData).toBe(3)
    expect(wrapper.vm.getBadgeText('Medium')).toBe('Medium')
  })
})
