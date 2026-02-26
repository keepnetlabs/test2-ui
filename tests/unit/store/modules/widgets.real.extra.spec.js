jest.mock('@/api/widgets', () => ({
  getSummary: jest.fn().mockResolvedValue({
    data: {
      dashboardSummary: { data: { investigationTypeCount: {}, notifiedEmailResultCount: {}, phishingReporterUserStatusCount: {}, roiSummary: {} } },
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

import widgets from '@/store/modules/widgets'
import * as widgetsApi from '@/api/widgets'

const createState = () => JSON.parse(JSON.stringify(widgets.state))

describe('widgets store module (real)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('module structure', () => {
    it('should have state, getters, mutations, actions', () => {
      expect(widgets.state).toBeDefined()
      expect(widgets.getters).toBeDefined()
      expect(widgets.mutations).toBeDefined()
      expect(widgets.actions).toBeDefined()
    })
    it('should be namespaced', () => {
      expect(widgets.namespaced).toBe(true)
    })
  })

  describe('getters', () => {
    it('getIsLoading returns loading state', () => {
      const state = createState()
      state.isLoading = true
      expect(widgets.getters.getIsLoading(state)).toBe(true)
    })
    it('getRecentCampaignsCard maps Click-Only method', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'Click-Only',
        totalNoResponseCount: 10,
        totalOpenedCount: 5,
        totalClickedCount: 3
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5])
    })
    it('getRecentCampaignsCard maps Attachment method', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'Attachment',
        totalNoResponseCount: 10,
        totalOpenedCount: 5,
        totalAttachmentOpenedCount: 2
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5, 2])
    })
    it('getRecentCampaignsCard maps MFA method', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'MFA',
        totalNoResponseCount: 10,
        totalOpenedCount: 5,
        totalSubmittedMFACount: 2
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5, 2])
    })
    it('getRecentCampaignsCard maps Data Submission method', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'Data Submission',
        totalNoResponseCount: 10,
        totalOpenedCount: 5,
        totalClickedCount: 3,
        totalSubmittedCount: 2
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5, 2])
    })
    it('getRecentCampaignsCard maps Multiple Method', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'Multiple Method',
        totalNoResponseCount: 10,
        totalOpenedCount: 5,
        totalClickedCount: 3,
        totalSubmittedCount: 2,
        totalAttachmentOpenedCount: 1
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5, 2, 1])
    })
    it('getRecentCampaignsCard maps unknown method to base status only', () => {
      const state = createState()
      state.recentCampaignsCard = [{
        method: 'Unknown',
        totalNoResponseCount: 10,
        totalOpenedCount: 5
      }]
      const result = widgets.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5])
    })
  })

  describe('mutations', () => {
    it('SET_INVESTIGATION_CARD updates state', () => {
      const state = createState()
      widgets.mutations.SET_INVESTIGATION_CARD(state, { count: 5 })
      expect(state.investigationCard).toEqual({ count: 5 })
    })
    it('SET_LOADING updates isLoading', () => {
      const state = createState()
      widgets.mutations.SET_LOADING(state, true)
      expect(state.isLoading).toBe(true)
    })
  })

  describe('actions', () => {
    it('callForWidgets fetches and commits data', async () => {
      const commit = jest.fn()
      await widgets.actions.callForWidgets({ commit })
      expect(commit).toHaveBeenCalledWith('SET_LOADING', true)
      expect(widgetsApi.getSummary).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('SET_INVESTIGATION_CARD', expect.any(Object))
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })
    it('callForWidgets handles partial response', async () => {
      widgetsApi.getSummary.mockResolvedValueOnce({
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
      await widgets.actions.callForWidgets({ commit })
      expect(commit).toHaveBeenCalledWith('SET_RECENT_CAMPAIGNS', [])
    })
    it('callForWidgets passes isLoading option', async () => {
      const commit = jest.fn()
      await widgets.actions.callForWidgets({ commit }, { isLoading: false })
      expect(widgetsApi.getSummary).toHaveBeenCalledWith({}, false)
    })
    it('callForWidgets runs finally on rejection', async () => {
      widgetsApi.getSummary.mockRejectedValueOnce(new Error('network error'))
      const commit = jest.fn()
      await expect(widgets.actions.callForWidgets({ commit })).rejects.toThrow('network error')
      expect(commit).toHaveBeenCalledWith('SET_LOADING', false)
    })
  })
})
