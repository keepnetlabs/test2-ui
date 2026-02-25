import CampaignManagerReportSummary from '@/components/QuishingCampaignManagerReport/Summary/CampaignManagerReportSummary.vue'

describe('CampaignManagerReportSummary.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportSummary.name).toBe('CampaignManagerReportSummary')
  })

  it('computed getChartData returns empty for zero stats and values for non-zero stats', () => {
    const zeroCtx = { campaignSummary: { scenarioStats: { scenarioStats: { openedEmail: 0 } } } }
    expect(CampaignManagerReportSummary.computed.getChartData.call(zeroCtx)).toEqual([])

    const ctx = {
      campaignSummary: {
        scenarioStats: {
          openedEmail: 2,
          clickedEmail: 1,
          submittedEmail: 1,
          noResponseEmail: 0,
          notDelivered: 0,
          attachmentOpenedEmail: 0,
          reportedEmail: 0,
          mfa: 0
        }
      }
    }
    expect(CampaignManagerReportSummary.computed.getChartData.call(ctx)).toEqual([
      2,
      1,
      1,
      0,
      0,
      0,
      0,
      0
    ])
  })

  it('computed getCardsData calculates percentages and map keys', () => {
    const ctx = {
      getChartData: [10, 20, 30, 40, 0, 0, 0, 0],
      getTotalUsers: 100
    }
    const cards = CampaignManagerReportSummary.computed.getCardsData.call(ctx)
    expect(cards.noResponse.userPercent).toBe('40')
    expect(cards.openedEmail.userPercent).toBe('10')
    expect(cards.submittedEmail.userPercent).toBe('30')
  })

  it('email and landing page template computeds map active scenario', () => {
    const ctx = {
      isQuishingTypePrintout: false,
      languageOptions: [{ text: 'English', languageShortCode: 'en' }],
      getActiveScenario: {
        scenarioInfo: { languageShortCode: 'en' },
        emailTemplateInfo: { resourceId: 'e1', name: 'Email T', phishingFileName: 'a.pdf' },
        landingPageTemplateInfo: { resourceId: 'l1', name: 'Landing T' }
      },
      id: 'job-1',
      instanceGroup: 'ig-1'
    }
    const emailData = CampaignManagerReportSummary.computed.getEmailTemplateData.call(ctx)
    const landingData = CampaignManagerReportSummary.computed.getLandingPageTemplateData.call(ctx)
    expect(emailData.resourceId).toBe('e1')
    expect(emailData.languageShortCode).toBe('English')
    expect(landingData.resourceId).toBe('l1')
    expect(landingData.jobResourceId).toBe('job-1')
  })

  it('setCampaignSummary builds training report items and active tab keys', () => {
    const ctx = {
      campaignSummary: {},
      trainingReportDialogItems: [],
      customKeys: [],
      selectedScenarioTab: '',
      languageOptions: [{ text: 'English', languageShortCode: 'en' }],
      $store: { dispatch: jest.fn() }
    }
    CampaignManagerReportSummary.methods.setCampaignSummary.call(ctx, {
      data: {
        data: {
          quishingCampaignName: 'Q-Camp',
          scenarios: [
            {
              scenarioInfo: { name: 'Scenario A' },
              trainingInfo: {
                name: 'Training A',
                languageList: [{ languageShortCode: 'en' }]
              },
              enrollmentInfo: { enrollmentId: 'enr-1' }
            }
          ]
        }
      }
    })

    expect(ctx.trainingReportDialogItems).toHaveLength(1)
    expect(ctx.customKeys).toHaveLength(1)
    expect(ctx.selectedScenarioTab).toBeTruthy()
    expect(ctx.$store.dispatch).toHaveBeenCalledWith('common/setActivePageRouterName', 'Q-Camp')
  })

  it('setScenarioDetail updates activeScenarioIndex', () => {
    const ctx = { activeScenarioIndex: 0 }
    CampaignManagerReportSummary.methods.setScenarioDetail.call(ctx, { index: 2 })
    expect(ctx.activeScenarioIndex).toBe(2)
  })
})
