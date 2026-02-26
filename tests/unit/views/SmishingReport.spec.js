import SmishingReport from '@/views/SmishingReport.vue'
import SmishingService from '@/api/smishing'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import labels from '@/model/constants/labels'

jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getCampaignFormDetails: jest.fn(),
    getCampaignJobSummary: jest.fn()
  }
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetUsers: jest.fn(),
  searchTargetGroups: jest.fn(),
  getTargetUserCustomFieldsByCompanyId: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SmishingReport.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed route/store helpers return expected values', () => {
    const ctx = {
      $route: { params: { id: 'cmp-1', instanceGroup: 'grp-1' } },
      $store: { state: { common: { activePageRouterName: 'Scenario A' } } }
    }

    expect(SmishingReport.computed.id.call(ctx)).toBe('cmp-1')
    expect(SmishingReport.computed.instanceGroup.call(ctx)).toBe('grp-1')
    expect(SmishingReport.computed.getPhishingScenarioName.call(ctx)).toBe('Scenario A')
  })

  it('computed helpers return safe fallback values for missing route/store data', () => {
    expect(SmishingReport.computed.id.call({ $route: {} })).toBeUndefined()
    expect(SmishingReport.computed.instanceGroup.call({ $route: {} })).toBeUndefined()
    expect(SmishingReport.computed.getPhishingScenarioName.call({ $store: { state: {} } })).toBe('')
  })

  it('watch route id calls setSubmittedDataTabLabel when id exists', () => {
    const ctx = { setSubmittedDataTabLabel: jest.fn() }

    SmishingReport.watch['$route.params.id'].handler.call(ctx, 'id-1')
    expect(ctx.setSubmittedDataTabLabel).toHaveBeenCalledTimes(1)

    ctx.setSubmittedDataTabLabel.mockClear()
    SmishingReport.watch['$route.params.id'].handler.call(ctx, '')
    expect(ctx.setSubmittedDataTabLabel).not.toHaveBeenCalled()
  })

  it('callForCustomFields and callForFormDetails map api payloads', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({ data: { data: [{ id: 'cf-1' }] } })
    SmishingService.getCampaignFormDetails.mockResolvedValueOnce({ data: { data: { title: 'Form A' } } })

    const ctx = {
      customFields: [],
      formDetails: null
    }

    SmishingReport.methods.callForCustomFields.call(ctx)
    SmishingReport.methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(ctx.customFields).toEqual([{ id: 'cf-1' }])
    expect(ctx.formDetails).toEqual({ title: 'Form A' })
  })

  it('setSubmittedDataTabLabel returns early when id or instanceGroup is missing', async () => {
    const ctx = {
      id: '',
      instanceGroup: 'grp-1',
      tabItems: [],
      $store: { getters: { 'permissions/getSmishingReportSearchTypePermissions': true } },
      isLoading: true
    }

    SmishingReport.methods.setSubmittedDataTabLabel.call(ctx)
    await flushPromises()

    expect(SmishingService.getCampaignJobSummary).not.toHaveBeenCalled()
    expect(ctx.isLoading).toBe(true)
  })

  it('setSubmittedDataTabLabel updates response flags and inserts submitted tabs by scenario types', async () => {
    SmishingService.getCampaignJobSummary.mockResolvedValueOnce({
      data: {
        data: {
          campaignDurationExpired: true,
          scenarios: [
            {
              landingPageTemplateInfo: { methodTypeId: 2 },
              scenarioInfo: { methodTypeId: 1 }
            },
            {
              landingPageTemplateInfo: { methodTypeId: 1 },
              scenarioInfo: { methodTypeId: 4 }
            }
          ]
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 'grp-1',
      isLoading: true,
      apiResponse: {},
      campaignDurationExpired: false,
      tabItems: [
        { name: labels.Summary },
        { name: labels.Clicked },
        { name: labels.NoResponse },
        { name: labels.SendingReport }
      ],
      $store: { getters: { 'permissions/getSmishingReportSearchTypePermissions': true } }
    }

    SmishingReport.methods.setSubmittedDataTabLabel.call(ctx)
    await flushPromises()

    expect(SmishingService.getCampaignJobSummary).toHaveBeenCalledWith('cmp-1', 'grp-1')
    expect(ctx.apiResponse).toEqual(
      expect.objectContaining({ data: expect.objectContaining({ data: expect.any(Object) }) })
    )
    expect(ctx.campaignDurationExpired).toBe(true)

    const tabNames = ctx.tabItems.map((item) => item.name)
    expect(tabNames).toContain(labels.SubmittedData)
    expect(tabNames).toContain('Submitted MFA Code')
    expect(ctx.isLoading).toBe(false)
  })

  it('setSubmittedDataTabLabel keeps tabs unchanged when scenario list is empty', async () => {
    SmishingService.getCampaignJobSummary.mockResolvedValueOnce({
      data: { data: { campaignDurationExpired: false, scenarios: [] } }
    })
    const initialTabs = [{ name: labels.Summary }, { name: labels.Clicked }]
    const ctx = {
      id: 'cmp-2',
      instanceGroup: 'grp-2',
      isLoading: true,
      apiResponse: {},
      campaignDurationExpired: true,
      tabItems: [...initialTabs],
      $store: { getters: { 'permissions/getSmishingReportSearchTypePermissions': true } }
    }

    SmishingReport.methods.setSubmittedDataTabLabel.call(ctx)
    await flushPromises()

    expect(ctx.tabItems).toEqual(initialTabs)
    expect(ctx.campaignDurationExpired).toBe(false)
    expect(ctx.isLoading).toBe(false)
  })
})
