import CampaignManagerReportSummary from '@/components/CallbackReport/Summary/CampaignManagerReportSummary.vue'
import CallbackService from '@/api/callback'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'

jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    getCampaignSummary: jest.fn().mockResolvedValue({ data: { data: { scenarios: [] } } }),
    getCampaignSummaryTargetGroups: jest.fn().mockResolvedValue({ data: { data: [] } }),
    getCallbackTemplatePreview: jest.fn().mockResolvedValue({
      data: {
        data: {
          vishingLanguageResourceId: 'lang-1',
          steps: [{ inputType: 'TextToSpeech' }, { inputType: 'Pause' }, { inputType: 'FileUpload' }]
        }
      }
    })
  }
}))

jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: {
    getSingle: jest.fn().mockResolvedValue([])
  }
}))

jest.mock('@/utils/functions', () => ({
  ...jest.requireActual('@/utils/functions'),
  createRandomCryptStringNumber: jest.fn(() => 'rnd')
}))

describe('CampaignManagerReportSummary.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSummary.name).toBe('CampaignManagerReportSummary')
  })

  it('getEmailDeliveryData covers saved-for-later branch', () => {
    const ctx = {
      campaignSummary: { campaignInfo: { scheduleTypeId: 2, emailDeliveryDuration: 7 } }
    }
    expect(CampaignManagerReportSummary.computed.getEmailDeliveryData.call(ctx)).toEqual({
      'Delivery Start - End': 'Saved for later',
      Duration: '7',
      'Delivery Status': ''
    })
  })

  it('getEmailDeliveryData covers scheduled and default branches', () => {
    const scheduledCtx = {
      campaignSummary: {
        campaignInfo: { scheduledDate: '2026-02-25', emailDeliveryDuration: 1, frequency: 1 }
      }
    }
    const normalCtx = {
      campaignSummary: {
        campaignInfo: {
          emailDeliveryStartDate: '2026-01-01',
          emailDeliveryEndDate: '2026-01-02',
          emailDeliveryDuration: 1
        }
      }
    }

    expect(CampaignManagerReportSummary.computed.getEmailDeliveryData.call(scheduledCtx)).toEqual({
      'Scheduled Date': '2026-02-25',
      Duration: '1',
      'Delivery Status': ''
    })
    expect(CampaignManagerReportSummary.computed.getEmailDeliveryData.call(normalCtx)).toEqual({
      'Delivery Start - End': '2026-01-01 - 2026-01-02',
      Duration: '1',
      'Delivery Status': ''
    })
  })

  it('getChartData returns empty for all-zero stats and values otherwise', () => {
    const zeroCtx = { campaignSummary: { stats: { openedEmail: 0 } } }
    const dataCtx = {
      campaignSummary: {
        stats: {
          openedEmail: 1,
          calledBack: 2,
          enteredDigits: 3,
          reportedEmail: 4,
          noResponseEmail: 5,
          notDelivered: 6,
          failedToSend: 7
        }
      }
    }
    expect(CampaignManagerReportSummary.computed.getChartData.call(zeroCtx)).toEqual([])
    expect(CampaignManagerReportSummary.computed.getChartData.call(dataCtx)).toEqual([
      1, 2, 3, 4, 5, 6, 7
    ])
  })

  it('getCardsData returns empty object when chart data is empty', () => {
    const ctx = { getChartData: [] }
    expect(CampaignManagerReportSummary.computed.getCardsData.call(ctx)).toEqual({})
  })

  it('getCardsData computes percentages for populated chart data', () => {
    const ctx = {
      getChartData: [1, 1, 1, 1, 2, 2, 2],
      getTotalUsers: 10
    }
    const cards = CampaignManagerReportSummary.computed.getCardsData.call(ctx)
    expect(cards.openedEmail.userPercent).toBe('10')
    expect(cards.noResponse.userPercent).toBe('20')
  })

  it('getEmailTemplateData returns null on empty active scenario and maps language label', () => {
    const nullCtx = { getActiveScenario: null }
    expect(CampaignManagerReportSummary.computed.getEmailTemplateData.call(nullCtx)).toBeNull()

    const ctx = {
      getActiveScenario: {
        emailTemplateResourceId: 'tmpl-1',
        languageShortCode: 'en',
        callbackNumber: '+1'
      },
      languageOptions: [{ languageShortCode: 'en', text: 'English' }],
      id: 'cmp-1',
      instanceGroup: 9
    }
    expect(CampaignManagerReportSummary.computed.getEmailTemplateData.call(ctx)).toEqual({
      resourceId: 'tmpl-1',
      languageShortCode: 'English',
      callbackNumber: '+1',
      campaignResourceId: 'cmp-1',
      instanceGroup: 9
    })
  })

  it('getCallbackTemplateData returns null for empty object and template otherwise', () => {
    expect(
      CampaignManagerReportSummary.computed.getCallbackTemplateData.call({ callbackTemplate: {} })
    ).toBeNull()
    expect(
      CampaignManagerReportSummary.computed.getCallbackTemplateData.call({
        callbackTemplate: { name: 'a' }
      })
    ).toEqual({ template: { name: 'a' } })
  })

  it('callForLanguages maps lookup data', async () => {
    LookupLocalStorage.getSingle.mockResolvedValueOnce([
      { isoFriendlyName: 'English', name: 'English Voice', description: 'en', resourceId: '1' }
    ])
    const ctx = { languageOptions: [] }
    CampaignManagerReportSummary.methods.callForLanguages.call(ctx)
    await Promise.resolve()
    expect(ctx.languageOptions).toEqual([
      { text: 'English', languageTypeName: 'English Voice', languageShortCode: 'en', value: '1' }
    ])
  })

  it('callForData uses callApis when apiResponse is present', () => {
    const ctx = { apiResponse: { data: true }, callApis: jest.fn(), setLoading: jest.fn(), callForTargetGroups: jest.fn() }
    CampaignManagerReportSummary.methods.callForData.call(ctx)
    expect(ctx.callApis).toHaveBeenCalledWith(true)
  })

  it('callForData uses loading+targetGroups flow when apiResponse is empty', () => {
    const ctx = { apiResponse: {}, callApis: jest.fn(), setLoading: jest.fn(), callForTargetGroups: jest.fn() }
    CampaignManagerReportSummary.methods.callForData.call(ctx)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
    expect(ctx.callForTargetGroups).toHaveBeenCalled()
  })

  it('callApis fetches summary and target groups', async () => {
    jest.useFakeTimers()
    const ctx = {
      id: 'cmp-1',
      instanceGroup: 1,
      setLoading: jest.fn(),
      setCampaignSummary: jest.fn(),
      callForTargetGroups: jest.fn()
    }
    CampaignManagerReportSummary.methods.callApis.call(ctx, true)
    await Promise.resolve()
    await Promise.resolve()
    jest.runAllTimers()
    expect(CallbackService.getCampaignSummary).toHaveBeenCalledWith('cmp-1', 1)
    expect(ctx.setCampaignSummary).toHaveBeenCalled()
    expect(ctx.callForTargetGroups).toHaveBeenCalled()
    jest.useRealTimers()
  })

  it('setCampaignSummary maps languages, initializes keys, and dispatches title', () => {
    const dispatch = jest.fn()
    const ctx = {
      languageOptions: [{ languageShortCode: 'en', text: 'English' }],
      customKeys: [],
      selectedScenarioTab: '',
      trainingReportDialogItems: [],
      $store: { dispatch }
    }
    CampaignManagerReportSummary.methods.setCampaignSummary.call(ctx, {
      data: {
        data: {
          campaignName: 'Campaign A',
          scenarios: [
            {
              name: 'S1',
              languageShortCode: 'en',
              trainingInfo: { languageList: [{ languageShortCode: 'en' }] },
              enrollmentInfo: {}
            }
          ]
        }
      }
    })
    expect(ctx.customKeys.length).toBe(1)
    expect(ctx.selectedScenarioTab).toBe('key-rnd')
    expect(ctx.campaignSummary.scenarios[0].trainingInfo.languages).toBe('English')
    expect(dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Campaign A')
  })

  it('callForTargetGroups sets response data', async () => {
    CallbackService.getCampaignSummaryTargetGroups.mockResolvedValueOnce({
      data: { data: ['tg-1'] }
    })
    const ctx = { id: 'cmp-1', instanceGroup: 2, targetGroups: [] }
    CampaignManagerReportSummary.methods.callForTargetGroups.call(ctx)
    await Promise.resolve()
    expect(ctx.targetGroups).toEqual(['tg-1'])
  })

  it('setScenarioDetail sets active index', () => {
    const ctx = { activeScenarioIndex: 0 }
    CampaignManagerReportSummary.methods.setScenarioDetail.call(ctx, { index: 3 })
    expect(ctx.activeScenarioIndex).toBe(3)
  })
})
