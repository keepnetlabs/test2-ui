jest.mock('@/api/smishing', () => ({
  __esModule: true,
  default: {
    getCampaignJobSummary: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    getCampaignJobSummaryTargetGroups: jest.fn(() =>
      Promise.resolve({ data: { data: { groups: [] } } })
    )
  }
}))

jest.mock('@/utils/functions', () => ({
  __esModule: true,
  ...jest.requireActual('@/utils/functions'),
  createRandomCryptStringNumber: jest.fn(() => 'rnd')
}))

import CampaignManagerReportSummary from '@/components/SmishingReport/Summary/CampaignManagerReportSummary.vue'

describe('CampaignManagerReportSummary.vue', () => {
  it('getChartData returns empty array when all values are zero', () => {
    const ctx = {
      campaignSummary: {
        scenarioStats: {
          clickedSms: 0,
          noResponseSms: 0,
          notDelivered: 0,
          submittedSms: 0,
          mfaSubmittedSms: 0
        }
      }
    }
    expect(CampaignManagerReportSummary.computed.getChartData.call(ctx)).toEqual([])
  })

  it('getCardsData computes percentages from chart data and total users', () => {
    const ctx = {
      getChartData: [10, 20, 30, 5, 35],
      getTotalUsers: 100
    }
    expect(CampaignManagerReportSummary.computed.getCardsData.call(ctx)).toEqual(
      expect.objectContaining({
        clicked: expect.objectContaining({ userPercent: '20' }),
        submittedMFA: expect.objectContaining({ userPercent: '5' }),
        noResponse: expect.objectContaining({ userPercent: '35' })
      })
    )
  })

  it('getCampaignMethodTypes returns method availability flags', () => {
    const ctx = {
      phishingScenarios: [
        { landingPageTemplateInfo: { methodTypeId: 1 }, scenarioInfo: { methodTypeId: 2 } },
        { landingPageTemplateInfo: { methodTypeId: 2 }, scenarioInfo: { methodTypeId: 4 } }
      ]
    }
    expect(CampaignManagerReportSummary.computed.getCampaignMethodTypes.call(ctx)).toEqual([
      true,
      true,
      true
    ])
  })

  it('setScenarioDetail updates activeScenarioIndex', () => {
    const ctx = { activeScenarioIndex: 0 }
    CampaignManagerReportSummary.methods.setScenarioDetail.call(ctx, { index: 2 })
    expect(ctx.activeScenarioIndex).toBe(2)
  })

  it('setCampaignSummary builds training dialog items and sets default selected tab', () => {
    const ctx = {
      campaignSummary: {},
      customKeys: [],
      selectedScenarioTab: '',
      languageOptions: [{ languageShortCode: 'en', text: 'English' }],
      $store: { dispatch: jest.fn() }
    }

    CampaignManagerReportSummary.methods.setCampaignSummary.call(ctx, {
      data: {
        data: {
          smishingCampaignName: 'Campaign A',
          scenarios: [
            {
              scenarioInfo: { name: 'S1' },
              enrollmentInfo: { enrollmentId: 'e1' },
              trainingInfo: {
                name: 'T1',
                languageList: [{ languageShortCode: 'en' }]
              }
            }
          ]
        }
      }
    })

    expect(ctx.trainingReportDialogItems).toHaveLength(1)
    expect(ctx.customKeys).toEqual(['key-rnd'])
    expect(ctx.selectedScenarioTab).toBe('key-rnd')
    expect(ctx.$store.dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Campaign A')
  })
})
