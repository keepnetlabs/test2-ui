jest.mock('@/api/phishingsimulator', () => ({
  searchUnscheduledCampaigns: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [{ resourceId: 'c1', targetUsers: '3', instanceCount: '2', failPercentageText: '10%', methodType: 'Click-Only' }] } } })
  ),
  getCampaignManagerPreview: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          phishingScenarioPreviewList: [{ name: 'Scenario 1', methodTypeId: 1, emailTemplate: {}, landingPageTemplate: { landingPages: [] } }]
        }
      }
    })
  ),
  searchCampaignPhishingJob: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [{ startDate: '2024-01-01', status: 'Completed', instanceGroup: 'g1' }] } } })
  ),
  getCampaignJobSummaryForTraining: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          campaignInfo: { totalTargetUserCount: 10 },
          scenarioStats: {
            attachmentOpenedEmail: 1,
            clickedEmail: 2,
            noResponseEmail: 3,
            failedToSend: 4,
            openedEmail: 5,
            reportedEmail: 6,
            submittedEmail: 7,
            mfa: 8
          },
          scenarios: [{ landingPageTemplateInfo: { methodTypeId: 2 } }]
        }
      }
    })
  ),
  getCampaignJobSummaryTargetGroups: jest.fn(() =>
    Promise.resolve({ data: { data: { groups: [{}, {}] } } })
  )
}))

import SendTrainingSelectUsersByCampaign from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsersByCampaign.vue'

describe('SendTrainingSelectUsersByCampaign.vue (extra branch coverage)', () => {
  it('computed empty state text/subtext changes with active filters', () => {
    const noFilterText = SendTrainingSelectUsersByCampaign.computed.getTableEmptyTextMessage.call({
      isFilterOrSearchActive: ''
    })
    expect(noFilterText).toContain('do not have any Campaigns')

    const filteredText = SendTrainingSelectUsersByCampaign.computed.getTableEmptyTextMessage.call({
      isFilterOrSearchActive: 'abc'
    })
    expect(filteredText).toContain('no results')
  })

  it('isLandingPageTabsVisible and getSingleTemplateDetails branches', () => {
    expect(
      SendTrainingSelectUsersByCampaign.computed.isLandingPageTabsVisible.call({
        landingPageTemplates: [{ content: 'a' }, { content: 'b' }]
      })
    ).toBe(true)
    expect(
      SendTrainingSelectUsersByCampaign.computed.getSingleTemplateDetails.call({
        landingPageTemplates: []
      })
    ).toBe('')
  })

  it('watchers update filter items and callForData', () => {
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      callForData: jest.fn(),
      debounce: (fn) => fn()
    }
    SendTrainingSelectUsersByCampaign.watch.search.call(ctx, 'keepnet')
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems.length).toBeGreaterThan(0)
    expect(ctx.callForData).toHaveBeenCalledWith(true)

    SendTrainingSelectUsersByCampaign.watch.language.call(ctx, 'en')
    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems[0].FieldName).toBe(
      'languageShortCode'
    )

    SendTrainingSelectUsersByCampaign.watch.scenarioType.call(ctx, 'MFA')
    const hasMethod = ctx.axiosPayload.filter.FilterGroups[0].FilterItems.some(
      (i) => i.FieldName === 'method'
    )
    expect(hasMethod).toBe(true)
  })

  it('handleScroll increases pageSize and triggers callForData near bottom', () => {
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { pageSize: 10 },
      debounce: (fn) => fn(),
      callForData
    }
    SendTrainingSelectUsersByCampaign.methods.handleScroll.call(ctx, {
      target: { scrollTop: 90, scrollHeight: 100, offsetHeight: 10 }
    })
    expect(ctx.axiosPayload.pageSize).toBe(20)
    expect(callForData).toHaveBeenCalled()
  })

  it('handleTabChange non-campaign-results keeps loading untouched', () => {
    const ctx = { selectedLandingPageTab: '3', isCampaignLoading: false }
    SendTrainingSelectUsersByCampaign.methods.handleTabChange.call(ctx, { label: 'Email' })
    expect(ctx.selectedLandingPageTab).toBe('1')
    expect(ctx.isCampaignLoading).toBe(false)
  })

  it('callForCampaignSummary sets totals and chart for Multiple Method', async () => {
    const ctx = {
      labels: {},
      campaignMethod: 'Multiple Method',
      methodTypeId: 1,
      isAttachmentBasedScenario: false,
      phishingCampaignResourceId: 'c1',
      phishingCampaignInstanceGroup: 'g1',
      chartOptions: {},
      pieData: [],
      totalCampaignUsers: 0,
      totalCampaignGroups: 0,
      isCampaignLoading: false
    }

    SendTrainingSelectUsersByCampaign.methods.callForCampaignSummary.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.totalCampaignUsers).toBe(10)
    expect(ctx.totalCampaignGroups).toBe(2)
    expect(Array.isArray(ctx.chartOptions.labels)).toBe(true)
    expect(Array.isArray(ctx.pieData)).toBe(true)
    expect(ctx.isCampaignLoading).toBe(false)
  })
})

