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
  })

  describe('actions', () => {
    it('callForWidgets commits SET_LOADING and fetches', async () => {
      const commit = jest.fn()
      const { getSummary } = require('@/api/widgets')
      await widgetsStore.actions.callForWidgets({ commit })
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(getSummary).toHaveBeenCalled()
    })
  })
})
