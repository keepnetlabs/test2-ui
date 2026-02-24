import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
import { getCampaignManagerEmailTemplatePreviewContent } from '@/api/phishingsimulator'
import { getDifficultyBadgeColor } from '@/utils/functions'

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
          isAssistedByAI: false
        }
      }
    })
  )
}))

jest.mock('@/utils/functions', () => ({
  getDifficultyBadgeColor: jest.fn((text) => `color-${text}`)
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerReportSummaryEmail.vue (extra branch coverage)', () => {
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

  it('isShowEmailTemplate watcher does not call template API when template is cached', async () => {
    const wrapper = createWrapper()
    const spy = jest.spyOn(wrapper.vm, 'callForTemplate')
    wrapper.setData({ emailTemplate: '<html>cached</html>' })

    await wrapper.setData({ isShowEmailTemplate: true })

    expect(spy).not.toHaveBeenCalled()
  })

  it('callForTemplate does not call API when required ids are missing', async () => {
    const wrapper = createWrapper({
      formData: { resourceId: 'x' }
    })

    wrapper.vm.callForTemplate(false)
    await flushPromises()

    expect(getCampaignManagerEmailTemplatePreviewContent).not.toHaveBeenCalled()
  })

  it('callForTemplate toggles loader when showLoader=true and maps AI fallback', async () => {
    const wrapper = createWrapper()
    const setLoadingSpy = jest.spyOn(wrapper.vm, 'setLoading')

    wrapper.vm.callForTemplate(true)
    await flushPromises()

    expect(setLoadingSpy).toHaveBeenCalled()
    expect(wrapper.vm.isAssistedByAI).toBe(false)
  })

  it('getBadgeColor delegates to utility and getBadgeText returns same text', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getBadgeColor('Hard')).toBe('color-Hard')
    expect(getDifficultyBadgeColor).toHaveBeenCalledWith('Hard')
    expect(wrapper.vm.getBadgeText('Medium')).toBe('Medium')
  })
})
