import QuishingCampaignManagerReport from '@/views/QuishingCampaignManagerReport.vue'
import QuishingService from '@/api/quishing'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import labels from '@/model/constants/labels'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    getCampaignJobSummary: jest.fn(),
    getCampaignManagerJobFormDetails: jest.fn()
  }
}))

jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const getStore = () => ({
  getters: {
    'permissions/getQuishingCampaignReportsGetPermissions': true,
    'permissions/getQuishingCampaignReportsOpenedPermissions': true,
    'permissions/getQuishingCampaignReportsClickedPermissions': true,
    'permissions/getQuishingCampaignReportsSubmittedDataPermissions': true,
    'permissions/getQuishingCampaignReportsNoResponsePermissions': true,
    'permissions/getQuishingCampaignReportsPhishingReporterPermissions': true,
    'permissions/getQuishingCampaignReportsSendingReportPermissions': true,
    'permissions/getQuishingCampaignReportsOpenedAttachmentPermissions': true
  },
  state: { common: { activePageRouterName: 'QCM Report' } }
})

const buildCtx = () => {
  const ctx = {
    $store: getStore(),
    $route: { params: { id: 'job-1', instanceGroup: 'ig-1' } }
  }
  Object.assign(ctx, QuishingCampaignManagerReport.data.call(ctx))
  return ctx
}

describe('QuishingCampaignManagerReport.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('callForCustomFields and callForFormDetails map api data', async () => {
    getTargetUserCustomFieldsByCompanyId.mockResolvedValueOnce({ data: { data: [{ key: 'dept' }] } })
    QuishingService.getCampaignManagerJobFormDetails.mockResolvedValueOnce({
      data: { data: { n: 1 } }
    })
    const ctx = buildCtx()

    QuishingCampaignManagerReport.methods.callForCustomFields.call(ctx)
    QuishingCampaignManagerReport.methods.callForFormDetails.call(ctx)
    await flushPromises()

    expect(ctx.customFields).toEqual([{ key: 'dept' }])
    expect(ctx.formDetails).toEqual({ n: 1 })
  })

  it('setMultipleType marks clicked, submitted and mfa branches', () => {
    const ctx = buildCtx()

    QuishingCampaignManagerReport.methods.setMultipleType.call(ctx, [
      { scenarioInfo: { methodTypeId: 1 } },
      { scenarioInfo: { methodTypeId: 2 } },
      {
        scenarioInfo: { methodTypeId: 4 },
        landingPageTemplateInfo: { methodTypeId: 2 }
      }
    ])

    expect(ctx.multipleType).toEqual([true, true, undefined, true])
    expect(ctx.renderClickedTab).toBe(true)
  })

  it('setTabStatus removes clicked/submitted and inserts attachment+mfa tabs by multipleType', () => {
    const ctx = buildCtx()
    ctx.multipleType = [false, false, true, true]
    ctx.renderClickedTab = false

    QuishingCampaignManagerReport.methods.setTabStatus.call(ctx)

    expect(ctx.tabItems.find((t) => t.name === labels.Clicked)).toBeUndefined()
    expect(ctx.tabItems.find((t) => t.name === labels.SubmittedData)).toBeUndefined()
    expect(ctx.tabItems.some((t) => t.name === labels.OpenedAttachment)).toBe(true)
    expect(ctx.tabItems.some((t) => t.name === labels.SubmittedMFACode)).toBe(true)
  })

  it('setSubmittedDataTabLabel returns early when id or instanceGroup is missing', () => {
    const ctx = buildCtx()
    ctx.$route.params.id = ''
    ctx.$route.params.instanceGroup = ''

    Object.defineProperty(ctx, 'id', { get: () => '' })
    Object.defineProperty(ctx, 'instanceGroup', { get: () => '' })

    QuishingCampaignManagerReport.methods.setSubmittedDataTabLabel.call(ctx)

    expect(QuishingService.getCampaignJobSummary).not.toHaveBeenCalled()
  })

  it('setSubmittedDataTabLabel maps methodTypeId 3 into opened-attachment and removes clicked', async () => {
    QuishingService.getCampaignJobSummary.mockResolvedValueOnce({
      data: {
        data: {
          campaignDurationExpired: true,
          scenarios: [
            {
              scenarioInfo: {
                methodTypeId: 3,
                templateType: 'normal'
              }
            }
          ]
        }
      }
    })

    const ctx = buildCtx()
    Object.defineProperty(ctx, 'id', { get: () => 'job-1' })
    Object.defineProperty(ctx, 'instanceGroup', { get: () => 'ig-1' })

    QuishingCampaignManagerReport.methods.setSubmittedDataTabLabel.call(ctx)
    await flushPromises()

    expect(ctx.campaignDurationExpired).toBe(true)
    expect(ctx.tabItems.some((t) => t.name === labels.Clicked)).toBe(false)
    expect(ctx.tabItems.some((t) => t.name === labels.OpenedAttachment)).toBe(true)
    expect(ctx.isLoading).toBe(false)
  })
})
