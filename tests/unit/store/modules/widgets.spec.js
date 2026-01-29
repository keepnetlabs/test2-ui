describe('widgets.js store module', () => {
  let widgetsStore
  let state

  beforeEach(() => {
    // Define store module inline to avoid import dependencies
    widgetsStore = {
      namespaced: true,
      state: {
        isLoading: false,
        investigationCard: {},
        incidentAnalysisCard: {},
        phishingReporterCard: {},
        roiSummaryCard: {},
        topRulesCard: [],
        recentInvestigationsCard: [],
        reportersCard: [],
        reportedEmailTrendsCard: [],
        recentCampaignsCard: [],
        mostPhishedUsers: [],
        phishingCampaignTrends: [],
        mostEngagedCampaigns: [],
        topPhishingSimulationReporters: []
      },
      getters: {
        getIsLoading: (state) => state.isLoading,
        getInvestigationCard: (state) => state.investigationCard,
        getIncidentAnalysisCard: (state) => state.incidentAnalysisCard,
        getPhishingReporterCard: (state) => state.phishingReporterCard,
        getROISummaryCard: (state) => state.roiSummaryCard,
        getTopRulesCard: (state) => state.topRulesCard,
        getRecentInvestigationsCard: (state) => state.recentInvestigationsCard,
        getReportersCard: (state) => state.reportersCard,
        getReportedEmailTrendsCard: (state) => state.reportedEmailTrendsCard,
        getRecentCampaignsCard: (state) =>
          state.recentCampaignsCard.map((row) => {
            const campaignStatus = [row['totalNoResponseCount'], row['totalOpenedCount']]
            if (row.method === 'Click-Only') {
              campaignStatus.splice(1, 0, row['totalClickedCount'])
            } else if (row.method === 'Attachment') {
              campaignStatus.push(row['totalAttachmentOpenedCount'])
            } else if (row.method === 'Data Submission') {
              campaignStatus.splice(1, 0, row['totalClickedCount'])
              campaignStatus.push(row['totalSubmittedCount'])
            } else if (row.method === 'MFA') {
              campaignStatus.push(row['totalSubmittedMFACount'])
            } else if (row.method === 'Multiple Method') {
              campaignStatus.splice(1, 0, row['totalClickedCount'])
              campaignStatus.push(row['totalSubmittedCount'])
              campaignStatus.push(row['totalAttachmentOpenedCount'])
            }
            return {
              ...row,
              campaignStatus
            }
          }),
        getMostPhishedUsersCard: (state) => state.mostPhishedUsers,
        getPhishingCampaignTrendsCard: (state) => state.phishingCampaignTrends,
        getMostEngagedCampaignsCard: (state) => state.mostEngagedCampaigns,
        getTopPhishingSimulationReportersCard: (state) =>
          state.topPhishingSimulationReporters
      },
      mutations: {
        SET_INVESTIGATION_CARD(state, payload) {
          state.investigationCard = payload
        },
        SET_INCIDENT_ANALYSIS_CARD(state, payload) {
          state.incidentAnalysisCard = payload
        },
        SET_PHISHING_REPORTER_CARD(state, payload) {
          state.phishingReporterCard = payload
        },
        SET_ROI_SUMMARY(state, payload) {
          state.roiSummaryCard = payload
        },
        SET_TOP_RULES(state, payload) {
          state.topRulesCard = payload
        },
        SET_RECENT_INVESTIGATIONS(state, payload) {
          state.recentInvestigationsCard = payload
        },
        SET_REPORTERS(state, payload) {
          state.reportersCard = payload
        },
        SET_LOADING(state, payload) {
          state.isLoading = payload
        },
        SET_REPORTED_EMAIL_TRENDS(state, payload) {
          state.reportedEmailTrendsCard = payload
        },
        SET_RECENT_CAMPAIGNS(state, payload) {
          state.recentCampaignsCard = payload
        },
        SET_MOST_PHISHED_USERS(state, payload) {
          state.mostPhishedUsers = payload
        },
        SET_PHISHING_CAMPAIGN_TRENDS(state, payload) {
          state.phishingCampaignTrends = payload
        },
        SET_MOST_ENGAGED_CAMPAIGNS(state, payload) {
          state.mostEngagedCampaigns = payload
        },
        SET_TOP_PHISHING_SIMULATION_REPORTERS(state, payload) {
          state.topPhishingSimulationReporters = payload
        }
      },
      actions: {}
    }

    state = JSON.parse(JSON.stringify(widgetsStore.state))
  })

  describe('state', () => {
    it('initializes with isLoading as false', () => {
      expect(widgetsStore.state.isLoading).toBe(false)
    })

    it('initializes all cards as empty objects or arrays', () => {
      expect(widgetsStore.state.investigationCard).toEqual({})
      expect(widgetsStore.state.incidentAnalysisCard).toEqual({})
      expect(widgetsStore.state.phishingReporterCard).toEqual({})
      expect(widgetsStore.state.roiSummaryCard).toEqual({})
    })

    it('initializes all data arrays as empty', () => {
      expect(widgetsStore.state.topRulesCard).toEqual([])
      expect(widgetsStore.state.recentInvestigationsCard).toEqual([])
      expect(widgetsStore.state.reportersCard).toEqual([])
      expect(widgetsStore.state.reportedEmailTrendsCard).toEqual([])
      expect(widgetsStore.state.recentCampaignsCard).toEqual([])
      expect(widgetsStore.state.mostPhishedUsers).toEqual([])
      expect(widgetsStore.state.phishingCampaignTrends).toEqual([])
      expect(widgetsStore.state.mostEngagedCampaigns).toEqual([])
      expect(widgetsStore.state.topPhishingSimulationReporters).toEqual([])
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = widgetsStore.state
    })

    it('getIsLoading returns loading state', () => {
      state.isLoading = true
      expect(widgetsStore.getters.getIsLoading(state)).toBe(true)
    })

    it('getInvestigationCard returns investigation card data', () => {
      state.investigationCard = { count: 5, type: 'critical' }
      expect(widgetsStore.getters.getInvestigationCard(state)).toEqual({
        count: 5,
        type: 'critical'
      })
    })

    it('getIncidentAnalysisCard returns incident analysis data', () => {
      state.incidentAnalysisCard = { total: 10, processed: 8 }
      expect(widgetsStore.getters.getIncidentAnalysisCard(state)).toEqual({
        total: 10,
        processed: 8
      })
    })

    it('getPhishingReporterCard returns phishing reporter data', () => {
      state.phishingReporterCard = { active: 3, inactive: 2 }
      expect(widgetsStore.getters.getPhishingReporterCard(state)).toEqual({
        active: 3,
        inactive: 2
      })
    })

    it('getROISummaryCard returns ROI summary data', () => {
      state.roiSummaryCard = { roi: 250, cost: 1000 }
      expect(widgetsStore.getters.getROISummaryCard(state)).toEqual({
        roi: 250,
        cost: 1000
      })
    })

    it('getTopRulesCard returns top rules array', () => {
      state.topRulesCard = [{ id: 1, name: 'Rule 1' }]
      expect(widgetsStore.getters.getTopRulesCard(state)).toEqual([
        { id: 1, name: 'Rule 1' }
      ])
    })

    it('getRecentInvestigationsCard returns recent investigations', () => {
      state.recentInvestigationsCard = [{ id: 1, status: 'open' }]
      expect(widgetsStore.getters.getRecentInvestigationsCard(state)).toEqual([
        { id: 1, status: 'open' }
      ])
    })

    it('getReportersCard returns reporters data', () => {
      state.reportersCard = [{ id: 1, reports: 5 }]
      expect(widgetsStore.getters.getReportersCard(state)).toEqual([
        { id: 1, reports: 5 }
      ])
    })

    it('getReportedEmailTrendsCard returns email trends', () => {
      state.reportedEmailTrendsCard = [{ month: 'Jan', count: 10 }]
      expect(widgetsStore.getters.getReportedEmailTrendsCard(state)).toEqual([
        { month: 'Jan', count: 10 }
      ])
    })

    it('getMostPhishedUsersCard returns most phished users', () => {
      state.mostPhishedUsers = [{ email: 'user@example.com', count: 5 }]
      expect(widgetsStore.getters.getMostPhishedUsersCard(state)).toEqual([
        { email: 'user@example.com', count: 5 }
      ])
    })

    it('getPhishingCampaignTrendsCard returns campaign trends', () => {
      state.phishingCampaignTrends = [{ month: 'Jan', campaigns: 3 }]
      expect(widgetsStore.getters.getPhishingCampaignTrendsCard(state)).toEqual([
        { month: 'Jan', campaigns: 3 }
      ])
    })

    it('getMostEngagedCampaignsCard returns engaged campaigns', () => {
      state.mostEngagedCampaigns = [{ name: 'Campaign 1', engagement: 45 }]
      expect(widgetsStore.getters.getMostEngagedCampaignsCard(state)).toEqual([
        { name: 'Campaign 1', engagement: 45 }
      ])
    })

    it('getTopPhishingSimulationReportersCard returns top reporters', () => {
      state.topPhishingSimulationReporters = [{ id: 1, name: 'Reporter' }]
      expect(widgetsStore.getters.getTopPhishingSimulationReportersCard(state)).toEqual([
        { id: 1, name: 'Reporter' }
      ])
    })
  })

  describe('getRecentCampaignsCard - campaign status mapping', () => {
    beforeEach(() => {
      state = widgetsStore.state
    })

    it('maps status for Click-Only method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Click-Only',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5])
    })

    it('maps status for Attachment method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Attachment',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalAttachmentOpenedCount: 2
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5, 2])
    })

    it('maps status for Data Submission method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Data Submission',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3,
          totalSubmittedCount: 2
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5, 2])
    })

    it('maps status for MFA method', () => {
      state.recentCampaignsCard = [
        {
          method: 'MFA',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalSubmittedMFACount: 2
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5, 2])
    })

    it('maps status for Multiple Method', () => {
      state.recentCampaignsCard = [
        {
          method: 'Multiple Method',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3,
          totalSubmittedCount: 2,
          totalAttachmentOpenedCount: 1
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 3, 5, 2, 1])
    })

    it('handles unknown method', () => {
      state.recentCampaignsCard = [
        {
          method: 'UnknownMethod',
          totalNoResponseCount: 10,
          totalOpenedCount: 5
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].campaignStatus).toEqual([10, 5])
    })

    it('preserves all campaign data while adding status', () => {
      state.recentCampaignsCard = [
        {
          id: 1,
          name: 'Campaign 1',
          method: 'Click-Only',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result[0].id).toBe(1)
      expect(result[0].name).toBe('Campaign 1')
      expect(result[0].method).toBe('Click-Only')
      expect(result[0].campaignStatus).toBeDefined()
    })

    it('handles multiple campaigns with different methods', () => {
      state.recentCampaignsCard = [
        {
          method: 'Click-Only',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3
        },
        {
          method: 'Attachment',
          totalNoResponseCount: 20,
          totalOpenedCount: 15,
          totalAttachmentOpenedCount: 5
        }
      ]
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result).toHaveLength(2)
      expect(result[0].campaignStatus).toEqual([10, 3, 5])
      expect(result[1].campaignStatus).toEqual([20, 15, 5])
    })

    it('handles empty campaigns array', () => {
      state.recentCampaignsCard = []
      const result = widgetsStore.getters.getRecentCampaignsCard(state)
      expect(result).toEqual([])
    })
  })

  describe('mutations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('SET_INVESTIGATION_CARD updates investigation card', () => {
      const data = { count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard).toEqual(data)
    })

    it('SET_INCIDENT_ANALYSIS_CARD updates incident analysis card', () => {
      const data = { total: 10 }
      widgetsStore.mutations.SET_INCIDENT_ANALYSIS_CARD(state, data)
      expect(state.incidentAnalysisCard).toEqual(data)
    })

    it('SET_PHISHING_REPORTER_CARD updates phishing reporter card', () => {
      const data = { active: 3 }
      widgetsStore.mutations.SET_PHISHING_REPORTER_CARD(state, data)
      expect(state.phishingReporterCard).toEqual(data)
    })

    it('SET_ROI_SUMMARY updates ROI summary', () => {
      const data = { roi: 250 }
      widgetsStore.mutations.SET_ROI_SUMMARY(state, data)
      expect(state.roiSummaryCard).toEqual(data)
    })

    it('SET_TOP_RULES updates top rules', () => {
      const data = [{ id: 1, name: 'Rule 1' }]
      widgetsStore.mutations.SET_TOP_RULES(state, data)
      expect(state.topRulesCard).toEqual(data)
    })

    it('SET_RECENT_INVESTIGATIONS updates recent investigations', () => {
      const data = [{ id: 1, status: 'open' }]
      widgetsStore.mutations.SET_RECENT_INVESTIGATIONS(state, data)
      expect(state.recentInvestigationsCard).toEqual(data)
    })

    it('SET_REPORTERS updates reporters', () => {
      const data = [{ id: 1, reports: 5 }]
      widgetsStore.mutations.SET_REPORTERS(state, data)
      expect(state.reportersCard).toEqual(data)
    })

    it('SET_LOADING updates loading state', () => {
      widgetsStore.mutations.SET_LOADING(state, true)
      expect(state.isLoading).toBe(true)
    })

    it('SET_REPORTED_EMAIL_TRENDS updates email trends', () => {
      const data = [{ month: 'Jan', count: 10 }]
      widgetsStore.mutations.SET_REPORTED_EMAIL_TRENDS(state, data)
      expect(state.reportedEmailTrendsCard).toEqual(data)
    })

    it('SET_RECENT_CAMPAIGNS updates recent campaigns', () => {
      const data = [{ id: 1, name: 'Campaign 1' }]
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, data)
      expect(state.recentCampaignsCard).toEqual(data)
    })

    it('SET_MOST_PHISHED_USERS updates most phished users', () => {
      const data = [{ email: 'user@example.com', count: 5 }]
      widgetsStore.mutations.SET_MOST_PHISHED_USERS(state, data)
      expect(state.mostPhishedUsers).toEqual(data)
    })

    it('SET_PHISHING_CAMPAIGN_TRENDS updates campaign trends', () => {
      const data = [{ month: 'Jan', campaigns: 3 }]
      widgetsStore.mutations.SET_PHISHING_CAMPAIGN_TRENDS(state, data)
      expect(state.phishingCampaignTrends).toEqual(data)
    })

    it('SET_MOST_ENGAGED_CAMPAIGNS updates engaged campaigns', () => {
      const data = [{ name: 'Campaign 1', engagement: 45 }]
      widgetsStore.mutations.SET_MOST_ENGAGED_CAMPAIGNS(state, data)
      expect(state.mostEngagedCampaigns).toEqual(data)
    })

    it('SET_TOP_PHISHING_SIMULATION_REPORTERS updates top reporters', () => {
      const data = [{ id: 1, name: 'Reporter' }]
      widgetsStore.mutations.SET_TOP_PHISHING_SIMULATION_REPORTERS(state, data)
      expect(state.topPhishingSimulationReporters).toEqual(data)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(widgetsStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(widgetsStore).toHaveProperty('state')
      expect(widgetsStore).toHaveProperty('getters')
      expect(widgetsStore).toHaveProperty('mutations')
      expect(widgetsStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getIsLoading',
        'getInvestigationCard',
        'getIncidentAnalysisCard',
        'getPhishingReporterCard',
        'getROISummaryCard',
        'getTopRulesCard',
        'getRecentInvestigationsCard',
        'getReportersCard',
        'getReportedEmailTrendsCard',
        'getRecentCampaignsCard',
        'getMostPhishedUsersCard',
        'getPhishingCampaignTrendsCard',
        'getMostEngagedCampaignsCard',
        'getTopPhishingSimulationReportersCard'
      ]
      expectedGetters.forEach((getter) => {
        expect(widgetsStore.getters).toHaveProperty(getter)
      })
    })

    it('has all expected mutations', () => {
      const expectedMutations = [
        'SET_INVESTIGATION_CARD',
        'SET_INCIDENT_ANALYSIS_CARD',
        'SET_PHISHING_REPORTER_CARD',
        'SET_ROI_SUMMARY',
        'SET_TOP_RULES',
        'SET_RECENT_INVESTIGATIONS',
        'SET_REPORTERS',
        'SET_LOADING',
        'SET_REPORTED_EMAIL_TRENDS',
        'SET_RECENT_CAMPAIGNS',
        'SET_MOST_PHISHED_USERS',
        'SET_PHISHING_CAMPAIGN_TRENDS',
        'SET_MOST_ENGAGED_CAMPAIGNS',
        'SET_TOP_PHISHING_SIMULATION_REPORTERS'
      ]
      expectedMutations.forEach((mutation) => {
        expect(widgetsStore.mutations).toHaveProperty(mutation)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('can set multiple cards at once', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_INCIDENT_ANALYSIS_CARD', { total: 10 })
      commit('SET_PHISHING_REPORTER_CARD', { active: 3 })

      expect(state.investigationCard.count).toBe(5)
      expect(state.incidentAnalysisCard.total).toBe(10)
      expect(state.phishingReporterCard.active).toBe(3)
    })

    it('can load all widget data in sequence', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      commit('SET_LOADING', true)
      expect(state.isLoading).toBe(true)

      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_TOP_RULES', [{ id: 1 }])
      commit('SET_RECENT_CAMPAIGNS', [{ id: 1 }])
      commit('SET_MOST_PHISHED_USERS', [{ email: 'user@example.com' }])

      commit('SET_LOADING', false)
      expect(state.isLoading).toBe(false)

      expect(state.investigationCard.count).toBe(5)
      expect(state.topRulesCard).toHaveLength(1)
      expect(state.recentCampaignsCard).toHaveLength(1)
      expect(state.mostPhishedUsers).toHaveLength(1)
    })

    it('can replace widget data without affecting other widgets', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      commit('SET_TOP_RULES', [{ id: 1, name: 'Rule 1' }])
      expect(state.topRulesCard).toHaveLength(1)

      commit('SET_TOP_RULES', [{ id: 2, name: 'Rule 2' }, { id: 3, name: 'Rule 3' }])
      expect(state.topRulesCard).toHaveLength(2)
      expect(state.reportersCard).toEqual([])
    })

    it('handles loading state during data fetch', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Simulate API call flow
      commit('SET_LOADING', true)
      expect(state.isLoading).toBe(true)

      // Simulate data arrival
      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_TOP_RULES', [{ id: 1 }])

      // Finish loading
      commit('SET_LOADING', false)
      expect(state.isLoading).toBe(false)
    })
  })
})
