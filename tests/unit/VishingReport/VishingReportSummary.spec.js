import { createLocalVue, shallowMount } from '@vue/test-utils'
import VishingReportSummary from '@/components/VishingReport/VishingReportSummary.vue'
import { getVishingReportSummary, getVishingTemplateLanguages } from '@/api/vishing'

jest.mock('@/api/vishing', () => ({
  getVishingReportSummary: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  getVishingTemplateLanguages: jest.fn(() => Promise.resolve({ data: { data: [] } }))
}))

describe('VishingReportSummary.vue', () => {
  const localVue = createLocalVue()
  let store

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    store = {
      dispatch: jest.fn()
    }
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportSummary, {
      localVue,
      propsData: { id: 'v1', vishingName: 'Test Campaign', ...propsData },
      mocks: { $store: store, $route: { params: { id: 'v1' } } },
      stubs: {
        VishingReportSummaryHeader: true,
        VishingReportSummaryCards: true,
        VishingReportCampaignInfo: true,
        VishingReportDelivery: true,
        VishingReportTemplate: true,
        DatatableLoading: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('has correct component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('VishingReportSummary')
  })

  it('getCardsData returns default structure when vishingSummary is empty', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getCardsData).toEqual({
      answered: { userCount: 0, userPercent: '0' },
      vished: { userCount: 0, userPercent: '0' },
      noResponse: { userCount: 0, userPercent: '0' }
    })
  })

  it('getCardsData maps vishingSummary to cards format', () => {
    const wrapper = mountComponent()
    wrapper.vm.vishingSummary = {
      answeredCount: 5,
      answeredPercent: 25,
      vishedCount: 10,
      vishedPercent: 50,
      noResponseCount: 3,
      noResponsePercent: 15
    }
    expect(wrapper.vm.getCardsData.answered).toEqual({ userCount: 5, userPercent: '25' })
    expect(wrapper.vm.getCardsData.vished).toEqual({ userCount: 10, userPercent: '50' })
    expect(wrapper.vm.getCardsData.noResponse).toEqual({ userCount: 3, userPercent: '15' })
  })

  it('getVishingDeliveryData returns delivery info', () => {
    const wrapper = mountComponent()
    wrapper.vm.vishingSummary = {
      callerPhoneNumber: '+441234',
      startTime: '2024-01-01',
      endTime: '2024-01-02'
    }
    expect(wrapper.vm.getVishingDeliveryData['Caller Phone Number']).toBe('+441234')
    expect(wrapper.vm.getVishingDeliveryData['Delivery Start-End Date']).toContain('2024-01-01')
  })

  it('getVishingDeliveryData uses In Progress when endTime missing', () => {
    const wrapper = mountComponent()
    wrapper.vm.vishingSummary = { startTime: '2024-01-01' }
    expect(wrapper.vm.getVishingDeliveryData['Delivery Start-End Date']).toContain('In Progress')
  })

  it('getResendDialogItems maps summary counts', () => {
    const wrapper = mountComponent()
    wrapper.vm.vishingSummary = {
      answeredCount: 5,
      noResponseCount: 2,
      errorTargetUserCount: 1
    }
    expect(wrapper.vm.getResendDialogItems).toEqual({
      answered: 5,
      noResponse: 2,
      callingError: 1
    })
  })

  it('callForData does not fetch when id is missing', () => {
    const wrapper = mountComponent({ id: undefined })
    wrapper.vm.callForData()
    expect(getVishingReportSummary).not.toHaveBeenCalled()
  })

  it('callForData assigns vishingSummary when API resolves', async () => {
    getVishingReportSummary.mockResolvedValue({ data: { data: { targetUserCount: 10 } } })
    const wrapper = mountComponent()
    wrapper.vm.callForData(true)
    await new Promise((r) => setImmediate(r))
    expect(getVishingReportSummary).toHaveBeenCalledWith('v1')
    expect(wrapper.vm.vishingSummary.targetUserCount).toBe(10)
  })

  it('callForLanguages assigns languageItems when API resolves', async () => {
    getVishingTemplateLanguages.mockResolvedValue({
      data: { data: [{ resourceId: 'r1', name: 'English' }] }
    })
    const wrapper = mountComponent()
    wrapper.vm.callForLanguages()
    await new Promise((r) => setImmediate(r))
    expect(wrapper.vm.languageItems).toHaveLength(1)
    expect(wrapper.vm.languageItems[0].name).toBe('English')
  })
})
