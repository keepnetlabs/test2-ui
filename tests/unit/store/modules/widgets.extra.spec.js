import widgetsStore from '@/store/modules/widgets'

jest.mock('@/api/widgets', () => ({
  getSummary: jest.fn().mockResolvedValue({
    data: {
      dashboardSummary: { data: {} },
      dashboardTopRules: { data: [] },
      runningInvestigations: { data: [] },
      topReporters: { data: [] },
      reportedEmailTrends: { data: [] },
      recentPhishingCampaigns: { data: [] },
      mostPhishedUsers: { data: [] },
      phishingCampaignTrends: { data: [] },
      mostEngagedCampaigns: { data: [] },
      topPhishingSimulationReporters: { data: [] }
    }
  })
}))

describe('widgets store (extra coverage)', () => {
  let state

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(widgetsStore.state))
  })

  describe('getters', () => {
    it('getIsLoading returns state', () => {
      state.isLoading = true
      expect(widgetsStore.getters.getIsLoading(state)).toBe(true)
    })
    it('getInvestigationCard returns state', () => {
      state.investigationCard = { count: 5 }
      expect(widgetsStore.getters.getInvestigationCard(state)).toEqual({ count: 5 })
    })
    it('getRecentCampaignsCard maps Click-Only method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Click-Only',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalClickedCount: 3
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 3, 2])
    })
    it('getRecentCampaignsCard maps Attachment method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Attachment',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalAttachmentOpenedCount: 4
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 2, 4])
    })
    it('getRecentCampaignsCard maps Data Submission method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Data Submission',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalClickedCount: 3,
          totalSubmittedCount: 5
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 3, 2, 5])
    })
    it('getRecentCampaignsCard maps MFA method', () => {
      state.recentCampaignsCard = [
        {
          method: 'MFA',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalSubmittedMFACount: 6
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 2, 6])
    })
    it('getRecentCampaignsCard maps Multiple Method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Multiple Method',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalClickedCount: 3,
          totalSubmittedCount: 4,
          totalAttachmentOpenedCount: 5
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 3, 2, 4, 5])
    })
    it('getRecentCampaignsCard handles unknown method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Other',
          totalNoResponseCount: 1,
          totalOpenedCount: 2
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([1, 2])
    })

    it('getRecentCampaignsCard keeps row fields and maps multiple rows independently', () => {
      state.recentCampaignsCard = [
        {
          id: 'row-1',
          method: 'Click-Only',
          totalNoResponseCount: 1,
          totalOpenedCount: 2,
          totalClickedCount: 3
        },
        {
          id: 'row-2',
          method: 'Attachment',
          totalNoResponseCount: 4,
          totalOpenedCount: 5,
          totalAttachmentOpenedCount: 6
        }
      ]

      const result = widgetsStore.getters.getRecentCampaignsCard(state)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(expect.objectContaining({ id: 'row-1', campaignStatus: [1, 3, 2] }))
      expect(result[1]).toEqual(expect.objectContaining({ id: 'row-2', campaignStatus: [4, 5, 6] }))
      expect(state.recentCampaignsCard[0]).not.toHaveProperty('campaignStatus')
      expect(state.recentCampaignsCard[1]).not.toHaveProperty('campaignStatus')
    })

    it('getRecentCampaignsCard tolerates missing count fields', () => {
      state.recentCampaignsCard = [
        {
          method: 'Data Submission',
          totalNoResponseCount: 1
        }
      ]

      const result = widgetsStore.getters.getRecentCampaignsCard(state)

      expect(result[0].campaignStatus).toEqual([1, undefined, undefined, undefined])
    })
  })

  describe('getters - all cards', () => {
    it('getIncidentAnalysisCard returns state', () => {
      state.incidentAnalysisCard = { total: 10 }
      expect(widgetsStore.getters.getIncidentAnalysisCard(state)).toEqual({ total: 10 })
    })
    it('getPhishingReporterCard returns state', () => {
      state.phishingReporterCard = { active: 5 }
      expect(widgetsStore.getters.getPhishingReporterCard(state)).toEqual({ active: 5 })
    })
    it('getROISummaryCard returns state', () => {
      state.roiSummaryCard = { roi: 100 }
      expect(widgetsStore.getters.getROISummaryCard(state)).toEqual({ roi: 100 })
    })
    it('getTopRulesCard returns state', () => {
      state.topRulesCard = [{ id: 1 }]
      expect(widgetsStore.getters.getTopRulesCard(state)).toEqual([{ id: 1 }])
    })
    it('getRecentInvestigationsCard returns state', () => {
      state.recentInvestigationsCard = [{ id: 1 }]
      expect(widgetsStore.getters.getRecentInvestigationsCard(state)).toEqual([{ id: 1 }])
    })
    it('getReportersCard returns state', () => {
      state.reportersCard = [{ id: 1 }]
      expect(widgetsStore.getters.getReportersCard(state)).toEqual([{ id: 1 }])
    })
    it('getReportedEmailTrendsCard returns state', () => {
      state.reportedEmailTrendsCard = [{ month: 'Jan' }]
      expect(widgetsStore.getters.getReportedEmailTrendsCard(state)).toEqual([{ month: 'Jan' }])
    })
    it('getMostPhishedUsersCard returns state', () => {
      state.mostPhishedUsers = [{ email: 'a@b.com' }]
      expect(widgetsStore.getters.getMostPhishedUsersCard(state)).toEqual([{ email: 'a@b.com' }])
    })
    it('getPhishingCampaignTrendsCard returns state', () => {
      state.phishingCampaignTrends = [{ month: 'Feb' }]
      expect(widgetsStore.getters.getPhishingCampaignTrendsCard(state)).toEqual([{ month: 'Feb' }])
    })
    it('getMostEngagedCampaignsCard returns state', () => {
      state.mostEngagedCampaigns = [{ name: 'C1' }]
      expect(widgetsStore.getters.getMostEngagedCampaignsCard(state)).toEqual([{ name: 'C1' }])
    })
    it('getTopPhishingSimulationReportersCard returns state', () => {
      state.topPhishingSimulationReporters = [{ id: 1 }]
      expect(widgetsStore.getters.getTopPhishingSimulationReportersCard(state)).toEqual([
        { id: 1 }
      ])
    })
  })

  describe('mutations', () => {
    it('SET_LOADING updates state', () => {
      widgetsStore.mutations.SET_LOADING(state, true)
      expect(state.isLoading).toBe(true)
    })
    it('SET_TOP_RULES updates state', () => {
      widgetsStore.mutations.SET_TOP_RULES(state, [{ id: 1 }])
      expect(state.topRulesCard).toEqual([{ id: 1 }])
    })
    it('SET_INVESTIGATION_CARD updates state', () => {
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, { count: 5 })
      expect(state.investigationCard).toEqual({ count: 5 })
    })
    it('SET_INCIDENT_ANALYSIS_CARD updates state', () => {
      widgetsStore.mutations.SET_INCIDENT_ANALYSIS_CARD(state, { total: 10 })
      expect(state.incidentAnalysisCard).toEqual({ total: 10 })
    })
    it('SET_PHISHING_REPORTER_CARD updates state', () => {
      widgetsStore.mutations.SET_PHISHING_REPORTER_CARD(state, { active: 3 })
      expect(state.phishingReporterCard).toEqual({ active: 3 })
    })
    it('SET_ROI_SUMMARY updates state', () => {
      widgetsStore.mutations.SET_ROI_SUMMARY(state, { roi: 250 })
      expect(state.roiSummaryCard).toEqual({ roi: 250 })
    })
    it('SET_RECENT_INVESTIGATIONS updates state', () => {
      widgetsStore.mutations.SET_RECENT_INVESTIGATIONS(state, [{ id: 1 }])
      expect(state.recentInvestigationsCard).toEqual([{ id: 1 }])
    })
    it('SET_REPORTERS updates state', () => {
      widgetsStore.mutations.SET_REPORTERS(state, [{ id: 1 }])
      expect(state.reportersCard).toEqual([{ id: 1 }])
    })
    it('SET_REPORTED_EMAIL_TRENDS updates state', () => {
      widgetsStore.mutations.SET_REPORTED_EMAIL_TRENDS(state, [{ month: 'Jan' }])
      expect(state.reportedEmailTrendsCard).toEqual([{ month: 'Jan' }])
    })
    it('SET_RECENT_CAMPAIGNS updates state', () => {
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, [{ id: 1 }])
      expect(state.recentCampaignsCard).toEqual([{ id: 1 }])
    })
    it('SET_MOST_PHISHED_USERS updates state', () => {
      widgetsStore.mutations.SET_MOST_PHISHED_USERS(state, [{ email: 'x@y.com' }])
      expect(state.mostPhishedUsers).toEqual([{ email: 'x@y.com' }])
    })
    it('SET_PHISHING_CAMPAIGN_TRENDS updates state', () => {
      widgetsStore.mutations.SET_PHISHING_CAMPAIGN_TRENDS(state, [{ month: 'Mar' }])
      expect(state.phishingCampaignTrends).toEqual([{ month: 'Mar' }])
    })
    it('SET_MOST_ENGAGED_CAMPAIGNS updates state', () => {
      widgetsStore.mutations.SET_MOST_ENGAGED_CAMPAIGNS(state, [{ name: 'Campaign' }])
      expect(state.mostEngagedCampaigns).toEqual([{ name: 'Campaign' }])
    })
    it('SET_TOP_PHISHING_SIMULATION_REPORTERS updates state', () => {
      widgetsStore.mutations.SET_TOP_PHISHING_SIMULATION_REPORTERS(state, [{ id: 2 }])
      expect(state.topPhishingSimulationReporters).toEqual([{ id: 2 }])
    })
  })

  describe('actions', () => {
    it('callForWidgets commits SET_LOADING and fetches', async () => {
      const commit = jest.fn()
      const { getSummary } = require('@/api/widgets')
      await widgetsStore.actions.callForWidgets({ commit })
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(getSummary).toHaveBeenCalledWith({}, true)
    })

    it('callForWidgets passes undefined loading flag when payload is empty object', async () => {
      const commit = jest.fn()
      const { getSummary } = require('@/api/widgets')
      await widgetsStore.actions.callForWidgets({ commit }, {})
      expect(getSummary).toHaveBeenCalledWith({}, undefined)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets passes undefined loading flag when payload is null', async () => {
      const commit = jest.fn()
      const { getSummary } = require('@/api/widgets')
      await widgetsStore.actions.callForWidgets({ commit }, null)
      expect(getSummary).toHaveBeenCalledWith({}, undefined)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets passes explicit isLoading false flag', async () => {
      const commit = jest.fn()
      const { getSummary } = require('@/api/widgets')
      await widgetsStore.actions.callForWidgets({ commit }, { isLoading: false })
      expect(getSummary).toHaveBeenCalledWith({}, false)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets resolves with original response', async () => {
      const { getSummary } = require('@/api/widgets')
      const mockedResponse = {
        data: {
          dashboardSummary: { data: {} },
          dashboardTopRules: { data: [] },
          runningInvestigations: { data: [] },
          topReporters: { data: [] },
          reportedEmailTrends: { data: [] },
          recentPhishingCampaigns: { data: [] },
          mostPhishedUsers: { data: [] },
          phishingCampaignTrends: { data: [] },
          mostEngagedCampaigns: { data: [] },
          topPhishingSimulationReporters: { data: [] }
        }
      }
      getSummary.mockResolvedValueOnce(mockedResponse)
      const commit = jest.fn()

      const result = await widgetsStore.actions.callForWidgets({ commit })

      expect(result).toBe(mockedResponse)
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets propagates error and still turns loading off in finally', async () => {
      const { getSummary } = require('@/api/widgets')
      const commit = jest.fn()
      getSummary.mockRejectedValueOnce(new Error('widgets-error'))

      await expect(widgetsStore.actions.callForWidgets({ commit })).rejects.toThrow('widgets-error')
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })
    it('callForWidgets commits all card mutations from full response', async () => {
      const { getSummary } = require('@/api/widgets')
      getSummary.mockResolvedValueOnce({
        data: {
          dashboardSummary: {
            data: {
              investigationTypeCount: { a: 1 },
              notifiedEmailResultCount: { b: 2 },
              phishingReporterUserStatusCount: { c: 3 },
              roiSummary: { roi: 100 }
            }
          },
          dashboardTopRules: { data: [{ id: 1 }] },
          runningInvestigations: { data: [{ id: 2 }] },
          topReporters: { data: [{ id: 3 }] },
          reportedEmailTrends: { data: [{ month: 'Jan' }] },
          recentPhishingCampaigns: { data: [{ id: 4 }] },
          mostPhishedUsers: { data: [{ email: 'u@x.com' }] },
          phishingCampaignTrends: { data: [{ m: 1 }] },
          mostEngagedCampaigns: { data: [{ n: 1 }] },
          topPhishingSimulationReporters: { data: [{ id: 5 }] }
        }
      })
      const commit = jest.fn()
      await widgetsStore.actions.callForWidgets({ commit })
      expect(commit).toHaveBeenCalledWith('SET_INVESTIGATION_CARD', { a: 1 })
      expect(commit).toHaveBeenCalledWith('SET_INCIDENT_ANALYSIS_CARD', { b: 2 })
      expect(commit).toHaveBeenCalledWith('SET_PHISHING_REPORTER_CARD', { c: 3 })
      expect(commit).toHaveBeenCalledWith('SET_ROI_SUMMARY', { roi: 100 })
      expect(commit).toHaveBeenCalledWith('SET_TOP_RULES', [{ id: 1 }])
      expect(commit).toHaveBeenCalledWith('SET_RECENT_INVESTIGATIONS', [{ id: 2 }])
      expect(commit).toHaveBeenCalledWith('SET_REPORTERS', [{ id: 3 }])
      expect(commit).toHaveBeenCalledWith('SET_REPORTED_EMAIL_TRENDS', [{ month: 'Jan' }])
      expect(commit).toHaveBeenCalledWith('SET_RECENT_CAMPAIGNS', [{ id: 4 }])
      expect(commit).toHaveBeenCalledWith('SET_MOST_PHISHED_USERS', [{ email: 'u@x.com' }])
      expect(commit).toHaveBeenCalledWith('SET_PHISHING_CAMPAIGN_TRENDS', [{ m: 1 }])
      expect(commit).toHaveBeenCalledWith('SET_MOST_ENGAGED_CAMPAIGNS', [{ n: 1 }])
      expect(commit).toHaveBeenCalledWith('SET_TOP_PHISHING_SIMULATION_REPORTERS', [{ id: 5 }])
    })

    it('callForWidgets commits empty-array defaults when nested cards are missing', async () => {
      const { getSummary } = require('@/api/widgets')
      getSummary.mockResolvedValueOnce({
        data: {
          dashboardSummary: { data: {} },
          dashboardTopRules: {},
          runningInvestigations: {},
          topReporters: {},
          reportedEmailTrends: {},
          recentPhishingCampaigns: {},
          mostPhishedUsers: {},
          phishingCampaignTrends: {},
          mostEngagedCampaigns: {},
          topPhishingSimulationReporters: {}
        }
      })
      const commit = jest.fn()

      await widgetsStore.actions.callForWidgets({ commit })

      expect(commit).toHaveBeenCalledWith('SET_RECENT_CAMPAIGNS', [])
      expect(commit).toHaveBeenCalledWith('SET_MOST_PHISHED_USERS', [])
      expect(commit).toHaveBeenCalledWith('SET_PHISHING_CAMPAIGN_TRENDS', [])
      expect(commit).toHaveBeenCalledWith('SET_MOST_ENGAGED_CAMPAIGNS', [])
      expect(commit).toHaveBeenCalledWith('SET_TOP_PHISHING_SIMULATION_REPORTERS', [])
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets rejects when dashboardTopRules is missing but still resets loading', async () => {
      const { getSummary } = require('@/api/widgets')
      getSummary.mockResolvedValueOnce({
        data: {
          dashboardSummary: { data: {} },
          // dashboardTopRules intentionally missing to hit destructuring failure branch
          runningInvestigations: { data: [] },
          topReporters: { data: [] },
          reportedEmailTrends: { data: [] },
          recentPhishingCampaigns: { data: [] },
          mostPhishedUsers: { data: [] },
          phishingCampaignTrends: { data: [] },
          mostEngagedCampaigns: { data: [] },
          topPhishingSimulationReporters: { data: [] }
        }
      })
      const commit = jest.fn()

      await expect(widgetsStore.actions.callForWidgets({ commit })).rejects.toBeDefined()
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })

    it('callForWidgets rejects when topReporters is missing but still resets loading', async () => {
      const { getSummary } = require('@/api/widgets')
      getSummary.mockResolvedValueOnce({
        data: {
          dashboardSummary: { data: {} },
          dashboardTopRules: { data: [] },
          runningInvestigations: { data: [] },
          // topReporters intentionally missing
          reportedEmailTrends: { data: [] },
          recentPhishingCampaigns: { data: [] },
          mostPhishedUsers: { data: [] },
          phishingCampaignTrends: { data: [] },
          mostEngagedCampaigns: { data: [] },
          topPhishingSimulationReporters: { data: [] }
        }
      })
      const commit = jest.fn()

      await expect(widgetsStore.actions.callForWidgets({ commit })).rejects.toBeDefined()
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })
  })
})
