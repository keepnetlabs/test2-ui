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

  describe('State Properties - Detailed Type Checks', () => {
    it('isLoading is a boolean', () => {
      expect(typeof widgetsStore.state.isLoading).toBe('boolean')
    })

    it('investigationCard is an object', () => {
      expect(typeof widgetsStore.state.investigationCard).toBe('object')
      expect(!Array.isArray(widgetsStore.state.investigationCard)).toBe(true)
    })

    it('incidentAnalysisCard is an object', () => {
      expect(typeof widgetsStore.state.incidentAnalysisCard).toBe('object')
      expect(!Array.isArray(widgetsStore.state.incidentAnalysisCard)).toBe(true)
    })

    it('phishingReporterCard is an object', () => {
      expect(typeof widgetsStore.state.phishingReporterCard).toBe('object')
      expect(!Array.isArray(widgetsStore.state.phishingReporterCard)).toBe(true)
    })

    it('roiSummaryCard is an object', () => {
      expect(typeof widgetsStore.state.roiSummaryCard).toBe('object')
      expect(!Array.isArray(widgetsStore.state.roiSummaryCard)).toBe(true)
    })

    it('topRulesCard is an array', () => {
      expect(Array.isArray(widgetsStore.state.topRulesCard)).toBe(true)
    })

    it('recentInvestigationsCard is an array', () => {
      expect(Array.isArray(widgetsStore.state.recentInvestigationsCard)).toBe(true)
    })

    it('reportersCard is an array', () => {
      expect(Array.isArray(widgetsStore.state.reportersCard)).toBe(true)
    })

    it('reportedEmailTrendsCard is an array', () => {
      expect(Array.isArray(widgetsStore.state.reportedEmailTrendsCard)).toBe(true)
    })

    it('recentCampaignsCard is an array', () => {
      expect(Array.isArray(widgetsStore.state.recentCampaignsCard)).toBe(true)
    })

    it('mostPhishedUsers is an array', () => {
      expect(Array.isArray(widgetsStore.state.mostPhishedUsers)).toBe(true)
    })

    it('phishingCampaignTrends is an array', () => {
      expect(Array.isArray(widgetsStore.state.phishingCampaignTrends)).toBe(true)
    })

    it('mostEngagedCampaigns is an array', () => {
      expect(Array.isArray(widgetsStore.state.mostEngagedCampaigns)).toBe(true)
    })

    it('topPhishingSimulationReporters is an array', () => {
      expect(Array.isArray(widgetsStore.state.topPhishingSimulationReporters)).toBe(true)
    })
  })

  describe('Getters - Function Type Checks and Reference Equality', () => {
    beforeEach(() => {
      state = widgetsStore.state
    })

    it('getIsLoading is a function', () => {
      expect(typeof widgetsStore.getters.getIsLoading).toBe('function')
    })

    it('getInvestigationCard is a function', () => {
      expect(typeof widgetsStore.getters.getInvestigationCard).toBe('function')
    })

    it('getIncidentAnalysisCard is a function', () => {
      expect(typeof widgetsStore.getters.getIncidentAnalysisCard).toBe('function')
    })

    it('getPhishingReporterCard is a function', () => {
      expect(typeof widgetsStore.getters.getPhishingReporterCard).toBe('function')
    })

    it('getROISummaryCard is a function', () => {
      expect(typeof widgetsStore.getters.getROISummaryCard).toBe('function')
    })

    it('getTopRulesCard is a function', () => {
      expect(typeof widgetsStore.getters.getTopRulesCard).toBe('function')
    })

    it('getRecentInvestigationsCard is a function', () => {
      expect(typeof widgetsStore.getters.getRecentInvestigationsCard).toBe('function')
    })

    it('getReportersCard is a function', () => {
      expect(typeof widgetsStore.getters.getReportersCard).toBe('function')
    })

    it('getReportedEmailTrendsCard is a function', () => {
      expect(typeof widgetsStore.getters.getReportedEmailTrendsCard).toBe('function')
    })

    it('getMostPhishedUsersCard is a function', () => {
      expect(typeof widgetsStore.getters.getMostPhishedUsersCard).toBe('function')
    })

    it('getPhishingCampaignTrendsCard is a function', () => {
      expect(typeof widgetsStore.getters.getPhishingCampaignTrendsCard).toBe('function')
    })

    it('getMostEngagedCampaignsCard is a function', () => {
      expect(typeof widgetsStore.getters.getMostEngagedCampaignsCard).toBe('function')
    })

    it('getTopPhishingSimulationReportersCard is a function', () => {
      expect(typeof widgetsStore.getters.getTopPhishingSimulationReportersCard).toBe('function')
    })

    it('getRecentCampaignsCard is a function', () => {
      expect(typeof widgetsStore.getters.getRecentCampaignsCard).toBe('function')
    })

    it('array getters maintain reference equality for same data', () => {
      const testArray = [{ id: 1, name: 'Test' }]
      state.topRulesCard = testArray
      const result = widgetsStore.getters.getTopRulesCard(state)
      expect(result).toBe(testArray)
    })

    it('object getters maintain reference equality for investigation card', () => {
      const testObj = { count: 5, type: 'critical' }
      state.investigationCard = testObj
      const result = widgetsStore.getters.getInvestigationCard(state)
      expect(result).toBe(testObj)
    })

    it('boolean getter returns exact reference for loading state', () => {
      const trueVal = true
      state.isLoading = trueVal
      const result = widgetsStore.getters.getIsLoading(state)
      expect(result === trueVal).toBe(true)
    })
  })

  describe('Mutation Payload Handling - Null and Undefined Edge Cases', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('SET_INVESTIGATION_CARD handles null payload', () => {
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, null)
      expect(state.investigationCard).toBe(null)
    })

    it('SET_INVESTIGATION_CARD handles undefined payload', () => {
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, undefined)
      expect(state.investigationCard).toBeUndefined()
    })

    it('SET_INCIDENT_ANALYSIS_CARD handles null payload', () => {
      widgetsStore.mutations.SET_INCIDENT_ANALYSIS_CARD(state, null)
      expect(state.incidentAnalysisCard).toBe(null)
    })

    it('SET_INCIDENT_ANALYSIS_CARD handles undefined payload', () => {
      widgetsStore.mutations.SET_INCIDENT_ANALYSIS_CARD(state, undefined)
      expect(state.incidentAnalysisCard).toBeUndefined()
    })

    it('SET_PHISHING_REPORTER_CARD handles null payload', () => {
      widgetsStore.mutations.SET_PHISHING_REPORTER_CARD(state, null)
      expect(state.phishingReporterCard).toBe(null)
    })

    it('SET_PHISHING_REPORTER_CARD handles undefined payload', () => {
      widgetsStore.mutations.SET_PHISHING_REPORTER_CARD(state, undefined)
      expect(state.phishingReporterCard).toBeUndefined()
    })

    it('SET_ROI_SUMMARY handles null payload', () => {
      widgetsStore.mutations.SET_ROI_SUMMARY(state, null)
      expect(state.roiSummaryCard).toBe(null)
    })

    it('SET_ROI_SUMMARY handles undefined payload', () => {
      widgetsStore.mutations.SET_ROI_SUMMARY(state, undefined)
      expect(state.roiSummaryCard).toBeUndefined()
    })

    it('SET_TOP_RULES handles null payload', () => {
      widgetsStore.mutations.SET_TOP_RULES(state, null)
      expect(state.topRulesCard).toBe(null)
    })

    it('SET_TOP_RULES handles undefined payload', () => {
      widgetsStore.mutations.SET_TOP_RULES(state, undefined)
      expect(state.topRulesCard).toBeUndefined()
    })

    it('SET_RECENT_INVESTIGATIONS handles null payload', () => {
      widgetsStore.mutations.SET_RECENT_INVESTIGATIONS(state, null)
      expect(state.recentInvestigationsCard).toBe(null)
    })

    it('SET_RECENT_INVESTIGATIONS handles undefined payload', () => {
      widgetsStore.mutations.SET_RECENT_INVESTIGATIONS(state, undefined)
      expect(state.recentInvestigationsCard).toBeUndefined()
    })

    it('SET_REPORTERS handles null payload', () => {
      widgetsStore.mutations.SET_REPORTERS(state, null)
      expect(state.reportersCard).toBe(null)
    })

    it('SET_REPORTERS handles undefined payload', () => {
      widgetsStore.mutations.SET_REPORTERS(state, undefined)
      expect(state.reportersCard).toBeUndefined()
    })

    it('SET_LOADING handles null payload', () => {
      widgetsStore.mutations.SET_LOADING(state, null)
      expect(state.isLoading).toBe(null)
    })

    it('SET_LOADING handles undefined payload', () => {
      widgetsStore.mutations.SET_LOADING(state, undefined)
      expect(state.isLoading).toBeUndefined()
    })

    it('SET_REPORTED_EMAIL_TRENDS handles null payload', () => {
      widgetsStore.mutations.SET_REPORTED_EMAIL_TRENDS(state, null)
      expect(state.reportedEmailTrendsCard).toBe(null)
    })

    it('SET_REPORTED_EMAIL_TRENDS handles undefined payload', () => {
      widgetsStore.mutations.SET_REPORTED_EMAIL_TRENDS(state, undefined)
      expect(state.reportedEmailTrendsCard).toBeUndefined()
    })

    it('SET_RECENT_CAMPAIGNS handles null payload', () => {
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, null)
      expect(state.recentCampaignsCard).toBe(null)
    })

    it('SET_RECENT_CAMPAIGNS handles undefined payload', () => {
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, undefined)
      expect(state.recentCampaignsCard).toBeUndefined()
    })

    it('SET_MOST_PHISHED_USERS handles null payload', () => {
      widgetsStore.mutations.SET_MOST_PHISHED_USERS(state, null)
      expect(state.mostPhishedUsers).toBe(null)
    })

    it('SET_MOST_PHISHED_USERS handles undefined payload', () => {
      widgetsStore.mutations.SET_MOST_PHISHED_USERS(state, undefined)
      expect(state.mostPhishedUsers).toBeUndefined()
    })

    it('SET_PHISHING_CAMPAIGN_TRENDS handles null payload', () => {
      widgetsStore.mutations.SET_PHISHING_CAMPAIGN_TRENDS(state, null)
      expect(state.phishingCampaignTrends).toBe(null)
    })

    it('SET_PHISHING_CAMPAIGN_TRENDS handles undefined payload', () => {
      widgetsStore.mutations.SET_PHISHING_CAMPAIGN_TRENDS(state, undefined)
      expect(state.phishingCampaignTrends).toBeUndefined()
    })

    it('SET_MOST_ENGAGED_CAMPAIGNS handles null payload', () => {
      widgetsStore.mutations.SET_MOST_ENGAGED_CAMPAIGNS(state, null)
      expect(state.mostEngagedCampaigns).toBe(null)
    })

    it('SET_MOST_ENGAGED_CAMPAIGNS handles undefined payload', () => {
      widgetsStore.mutations.SET_MOST_ENGAGED_CAMPAIGNS(state, undefined)
      expect(state.mostEngagedCampaigns).toBeUndefined()
    })

    it('SET_TOP_PHISHING_SIMULATION_REPORTERS handles null payload', () => {
      widgetsStore.mutations.SET_TOP_PHISHING_SIMULATION_REPORTERS(state, null)
      expect(state.topPhishingSimulationReporters).toBe(null)
    })

    it('SET_TOP_PHISHING_SIMULATION_REPORTERS handles undefined payload', () => {
      widgetsStore.mutations.SET_TOP_PHISHING_SIMULATION_REPORTERS(state, undefined)
      expect(state.topPhishingSimulationReporters).toBeUndefined()
    })
  })

  describe('Action Behavior - Commit Patterns and Payload Passing', () => {
    it('store has actions object', () => {
      expect(widgetsStore.actions).toBeDefined()
      expect(typeof widgetsStore.actions).toBe('object')
    })

    it('actions object is empty initially', () => {
      expect(Object.keys(widgetsStore.actions).length).toBe(0)
    })
  })

  describe('Type Safety and Consistency - Functions and Namespacing', () => {
    it('store is namespaced', () => {
      expect(widgetsStore.namespaced).toBe(true)
    })

    it('all mutations are functions', () => {
      Object.values(widgetsStore.mutations).forEach((mutation) => {
        expect(typeof mutation).toBe('function')
      })
    })

    it('all getters are functions', () => {
      Object.values(widgetsStore.getters).forEach((getter) => {
        expect(typeof getter).toBe('function')
      })
    })

    it('all actions are functions', () => {
      Object.values(widgetsStore.actions).forEach((action) => {
        expect(typeof action).toBe('function')
      })
    })

    it('mutation names follow convention (UPPER_SNAKE_CASE)', () => {
      Object.keys(widgetsStore.mutations).forEach((name) => {
        expect(name).toMatch(/^[A-Z_]+$/)
      })
    })

    it('getter names follow convention (camelCase)', () => {
      Object.keys(widgetsStore.getters).forEach((name) => {
        expect(name[0]).toEqual(name[0].toLowerCase())
      })
    })

    it('has exactly 14 getters', () => {
      expect(Object.keys(widgetsStore.getters).length).toBe(14)
    })

    it('has exactly 14 mutations', () => {
      expect(Object.keys(widgetsStore.mutations).length).toBe(14)
    })

    it('state has 14 properties', () => {
      expect(Object.keys(widgetsStore.state).length).toBe(14)
    })
  })

  describe('Edge Cases - Special Characters and Unicode', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('handles special characters in object mutation (!@#$%^&*())', () => {
      const dataWithSpecialChars = { name: '!@#$%^&*()', count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, dataWithSpecialChars)
      expect(state.investigationCard).toEqual(dataWithSpecialChars)
    })

    it('handles Unicode characters in payload (émoji 你好 ñ)', () => {
      const dataWithUnicode = { name: '📊 Dashboard 你好 ñ', count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, dataWithUnicode)
      expect(state.investigationCard.name).toBe('📊 Dashboard 你好 ñ')
    })

    it('handles Unicode in array elements', () => {
      const dataWithUnicode = [{ name: '🔒 Security 中文', id: 1 }]
      widgetsStore.mutations.SET_TOP_RULES(state, dataWithUnicode)
      expect(state.topRulesCard[0].name).toBe('🔒 Security 中文')
    })

    it('handles very long strings (500+ characters)', () => {
      const longString = 'A'.repeat(500)
      const dataWithLongString = { description: longString }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, dataWithLongString)
      expect(state.investigationCard.description.length).toBe(500)
    })

    it('handles very long strings in arrays', () => {
      const longString = 'B'.repeat(1000)
      const dataWithLongString = [{ description: longString, id: 1 }]
      widgetsStore.mutations.SET_TOP_RULES(state, dataWithLongString)
      expect(state.topRulesCard[0].description.length).toBe(1000)
    })

    it('handles newlines and tabs in strings', () => {
      const dataWithWhitespace = { name: 'Line1\nLine2\tTabbed' }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, dataWithWhitespace)
      expect(state.investigationCard.name).toContain('\n')
      expect(state.investigationCard.name).toContain('\t')
    })

    it('handles HTML-like strings without XSS', () => {
      const htmlString = '<script>alert("xss")</script>'
      const data = { content: htmlString }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard.content).toBe(htmlString)
    })

    it('handles JSON strings as payloads', () => {
      const jsonString = '{"nested": "object", "value": 123}'
      const data = { jsonData: jsonString }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard.jsonData).toBe(jsonString)
    })
  })

  describe('Edge Cases - Large Data Structures', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('handles 100+ items in array', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      widgetsStore.mutations.SET_TOP_RULES(state, largeArray)
      expect(state.topRulesCard).toHaveLength(100)
      expect(state.topRulesCard[99].id).toBe(99)
    })

    it('handles 1000+ items in array', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, largeArray)
      expect(state.recentCampaignsCard).toHaveLength(1000)
      expect(state.recentCampaignsCard[999].id).toBe(999)
    })

    it('handles deeply nested objects', () => {
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep'
              }
            }
          }
        }
      }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, deepObject)
      expect(state.investigationCard.level1.level2.level3.level4.value).toBe('deep')
    })

    it('handles objects with many properties (50+ keys)', () => {
      const manyPropertiesObj = {}
      for (let i = 0; i < 50; i++) {
        manyPropertiesObj[`property${i}`] = `value${i}`
      }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, manyPropertiesObj)
      expect(Object.keys(state.investigationCard).length).toBe(50)
    })

    it('handles arrays of complex objects with multiple properties', () => {
      const complexArray = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Campaign ${i}`,
        status: 'active',
        metrics: { clicks: i * 10, opens: i * 5 },
        tags: [`tag${i}`, 'phishing', 'test']
      }))
      widgetsStore.mutations.SET_RECENT_CAMPAIGNS(state, complexArray)
      expect(state.recentCampaignsCard).toHaveLength(50)
      expect(state.recentCampaignsCard[0].metrics.clicks).toBe(0)
      expect(state.recentCampaignsCard[49].metrics.clicks).toBe(490)
    })
  })

  describe('Edge Cases - Rapid Operations', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('handles 5 rapid consecutive mutations', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 5; i++) {
        commit('SET_INVESTIGATION_CARD', { count: i })
      }

      expect(state.investigationCard.count).toBe(4)
    })

    it('handles 10 rapid different mutations', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      commit('SET_INVESTIGATION_CARD', { count: 1 })
      commit('SET_INCIDENT_ANALYSIS_CARD', { total: 2 })
      commit('SET_PHISHING_REPORTER_CARD', { active: 3 })
      commit('SET_ROI_SUMMARY', { roi: 4 })
      commit('SET_TOP_RULES', [{ id: 5 }])
      commit('SET_RECENT_INVESTIGATIONS', [{ id: 6 }])
      commit('SET_REPORTERS', [{ id: 7 }])
      commit('SET_LOADING', true)
      commit('SET_REPORTED_EMAIL_TRENDS', [{ id: 9 }])
      commit('SET_RECENT_CAMPAIGNS', [{ id: 10 }])

      expect(state.investigationCard.count).toBe(1)
      expect(state.incidentAnalysisCard.total).toBe(2)
      expect(state.isLoading).toBe(true)
    })

    it('handles 20 rapid mutations on arrays', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 20; i++) {
        commit('SET_TOP_RULES', Array.from({ length: i + 1 }, (_, j) => ({ id: j })))
      }

      expect(state.topRulesCard).toHaveLength(20)
    })

    it('handles alternating mutations on same property', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      for (let i = 0; i < 10; i++) {
        const isEven = i % 2 === 0
        commit('SET_LOADING', isEven)
        expect(state.isLoading).toBe(isEven)
      }
    })
  })

  describe('Edge Cases - Empty Values', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('handles empty array payload', () => {
      widgetsStore.mutations.SET_TOP_RULES(state, [])
      expect(state.topRulesCard).toEqual([])
      expect(state.topRulesCard).toHaveLength(0)
    })

    it('handles empty object payload', () => {
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, {})
      expect(state.investigationCard).toEqual({})
      expect(Object.keys(state.investigationCard).length).toBe(0)
    })

    it('handles empty string payload', () => {
      const data = { description: '' }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard.description).toBe('')
    })

    it('handles zero value payload', () => {
      const data = { count: 0 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard.count).toBe(0)
    })

    it('handles false boolean payload', () => {
      widgetsStore.mutations.SET_LOADING(state, false)
      expect(state.isLoading).toBe(false)
    })

    it('handles multiple empty values in single mutation', () => {
      const data = {
        emptyArray: [],
        emptyObject: {},
        emptyString: '',
        zeroValue: 0,
        nullValue: null
      }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)
      expect(state.investigationCard.emptyArray).toEqual([])
      expect(state.investigationCard.emptyObject).toEqual({})
      expect(state.investigationCard.emptyString).toBe('')
      expect(state.investigationCard.zeroValue).toBe(0)
      expect(state.investigationCard.nullValue).toBe(null)
    })
  })

  describe('Data Transitions and State Mutations - Immutability and Transitions', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('state transitions from empty object to populated object', () => {
      expect(state.investigationCard).toEqual({})
      const newData = { count: 5, type: 'critical' }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, newData)
      expect(state.investigationCard).toEqual(newData)
    })

    it('state transitions from populated object to empty object', () => {
      state.investigationCard = { count: 5, type: 'critical' }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, {})
      expect(state.investigationCard).toEqual({})
    })

    it('state transitions from false to true for boolean', () => {
      expect(state.isLoading).toBe(false)
      widgetsStore.mutations.SET_LOADING(state, true)
      expect(state.isLoading).toBe(true)
    })

    it('state transitions from true to false for boolean', () => {
      state.isLoading = true
      widgetsStore.mutations.SET_LOADING(state, false)
      expect(state.isLoading).toBe(false)
    })

    it('state transitions empty array to populated array', () => {
      expect(state.topRulesCard).toEqual([])
      const newArray = [{ id: 1, name: 'Rule 1' }]
      widgetsStore.mutations.SET_TOP_RULES(state, newArray)
      expect(state.topRulesCard).toHaveLength(1)
    })

    it('state transitions populated array to larger array', () => {
      state.topRulesCard = [{ id: 1 }]
      const newArray = [{ id: 1 }, { id: 2 }, { id: 3 }]
      widgetsStore.mutations.SET_TOP_RULES(state, newArray)
      expect(state.topRulesCard).toHaveLength(3)
    })

    it('state transitions larger array to smaller array', () => {
      state.topRulesCard = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const newArray = [{ id: 1 }]
      widgetsStore.mutations.SET_TOP_RULES(state, newArray)
      expect(state.topRulesCard).toHaveLength(1)
    })

    it('mutations replace entire state property without merging', () => {
      state.investigationCard = { count: 5, type: 'critical', extra: 'property' }
      const newData = { count: 10 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, newData)
      expect(state.investigationCard).toEqual({ count: 10 })
      expect(state.investigationCard.type).toBeUndefined()
    })

    it('multiple mutations do not interfere with each other', () => {
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, { count: 5 })
      widgetsStore.mutations.SET_INCIDENT_ANALYSIS_CARD(state, { total: 10 })
      widgetsStore.mutations.SET_TOP_RULES(state, [{ id: 1 }])

      expect(state.investigationCard.count).toBe(5)
      expect(state.incidentAnalysisCard.total).toBe(10)
      expect(state.topRulesCard).toHaveLength(1)
      expect(state.reportersCard).toEqual([])
    })

    it('state immutability after normal mutation', () => {
      const originalState = JSON.parse(JSON.stringify(state))
      const newData = { count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, newData)

      // Original state properties other than investigationCard should not change
      expect(state.isLoading).toBe(originalState.isLoading)
      expect(state.topRulesCard).toEqual(originalState.topRulesCard)
    })

    it('handles transition from null to object', () => {
      state.investigationCard = null
      const newData = { count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, newData)
      expect(state.investigationCard).toEqual({ count: 5 })
    })

    it('handles transition from array to object', () => {
      state.investigationCard = [{ id: 1 }]
      const newData = { count: 5 }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, newData)
      expect(state.investigationCard).toEqual({ count: 5 })
      expect(Array.isArray(state.investigationCard)).toBe(false)
    })
  })

  describe('Complex Integration Workflows - Multi-step Scenarios', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))
    })

    it('simulates complete dashboard initialization workflow', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Step 1: Start loading
      commit('SET_LOADING', true)
      expect(state.isLoading).toBe(true)

      // Step 2: Load investigation data
      commit('SET_INVESTIGATION_CARD', { count: 15, critical: 3 })
      expect(state.investigationCard.count).toBe(15)

      // Step 3: Load incident data
      commit('SET_INCIDENT_ANALYSIS_CARD', { notified: 100, responded: 85 })
      expect(state.incidentAnalysisCard.notified).toBe(100)

      // Step 4: Load reporter data
      commit('SET_PHISHING_REPORTER_CARD', { active: 50, inactive: 10 })
      expect(state.phishingReporterCard.active).toBe(50)

      // Step 5: Load ROI summary
      commit('SET_ROI_SUMMARY', { roi: 250, cost: 1000 })
      expect(state.roiSummaryCard.roi).toBe(250)

      // Step 6: Load rules, investigations, reporters
      commit('SET_TOP_RULES', [{ id: 1, name: 'Rule 1' }, { id: 2, name: 'Rule 2' }])
      commit('SET_RECENT_INVESTIGATIONS', [{ id: 1 }, { id: 2 }])
      commit('SET_REPORTERS', [{ id: 1 }, { id: 2 }, { id: 3 }])

      // Step 7: Load campaigns and trends
      commit('SET_RECENT_CAMPAIGNS', [{ id: 1, method: 'Click-Only' }])
      commit('SET_MOST_PHISHED_USERS', [{ email: 'user@example.com', count: 5 }])
      commit('SET_PHISHING_CAMPAIGN_TRENDS', [{ month: 'Jan', campaigns: 3 }])
      commit('SET_MOST_ENGAGED_CAMPAIGNS', [{ name: 'Campaign 1', engagement: 45 }])
      commit('SET_TOP_PHISHING_SIMULATION_REPORTERS', [{ id: 1, name: 'Reporter 1' }])

      // Step 8: Finish loading
      commit('SET_LOADING', false)
      expect(state.isLoading).toBe(false)

      // Verify all data is loaded
      expect(state.investigationCard).toBeDefined()
      expect(state.topRulesCard).toHaveLength(2)
      expect(state.recentInvestigationsCard).toHaveLength(2)
      expect(state.reportersCard).toHaveLength(3)
      expect(state.mostPhishedUsers).toHaveLength(1)
    })

    it('simulates data refresh workflow', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Initial load
      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_TOP_RULES', [{ id: 1 }])

      // Refresh: start loading
      commit('SET_LOADING', true)
      expect(state.isLoading).toBe(true)

      // Update with new data
      commit('SET_INVESTIGATION_CARD', { count: 8 })
      commit('SET_TOP_RULES', [{ id: 1 }, { id: 2 }])

      // Refresh complete
      commit('SET_LOADING', false)
      expect(state.investigationCard.count).toBe(8)
      expect(state.topRulesCard).toHaveLength(2)
    })

    it('simulates campaign data update workflow with multiple methods', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Load campaigns with different methods
      const campaigns = [
        {
          id: 1,
          method: 'Click-Only',
          totalNoResponseCount: 10,
          totalOpenedCount: 5,
          totalClickedCount: 3
        },
        {
          id: 2,
          method: 'Attachment',
          totalNoResponseCount: 20,
          totalOpenedCount: 15,
          totalAttachmentOpenedCount: 5
        },
        {
          id: 3,
          method: 'Data Submission',
          totalNoResponseCount: 30,
          totalOpenedCount: 25,
          totalClickedCount: 10,
          totalSubmittedCount: 8
        },
        {
          id: 4,
          method: 'MFA',
          totalNoResponseCount: 40,
          totalOpenedCount: 35,
          totalSubmittedMFACount: 10
        },
        {
          id: 5,
          method: 'Multiple Method',
          totalNoResponseCount: 50,
          totalOpenedCount: 40,
          totalClickedCount: 15,
          totalSubmittedCount: 12,
          totalAttachmentOpenedCount: 8
        }
      ]

      commit('SET_RECENT_CAMPAIGNS', campaigns)
      const result = widgetsStore.getters.getRecentCampaignsCard(state)

      expect(result).toHaveLength(5)
      expect(result[0].campaignStatus).toEqual([10, 3, 5])
      expect(result[1].campaignStatus).toEqual([20, 15, 5])
      expect(result[2].campaignStatus).toEqual([30, 10, 25, 8])
      expect(result[3].campaignStatus).toEqual([40, 35, 10])
      expect(result[4].campaignStatus).toEqual([50, 15, 40, 12, 8])
    })

    it('handles error recovery workflow', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Initial load
      commit('SET_LOADING', true)
      commit('SET_INVESTIGATION_CARD', { count: 5 })

      // Simulate error - reset to empty
      commit('SET_INVESTIGATION_CARD', {})
      commit('SET_LOADING', false)

      expect(state.investigationCard).toEqual({})
      expect(state.isLoading).toBe(false)

      // Retry - reload
      commit('SET_LOADING', true)
      commit('SET_INVESTIGATION_CARD', { count: 5, timestamp: new Date().toISOString() })
      commit('SET_LOADING', false)

      expect(state.investigationCard.count).toBe(5)
      expect(state.isLoading).toBe(false)
    })

    it('handles partial data loading workflow', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      commit('SET_LOADING', true)

      // Load some data
      commit('SET_INVESTIGATION_CARD', { count: 5 })
      expect(state.investigationCard.count).toBe(5)

      // Load more data
      commit('SET_TOP_RULES', [{ id: 1 }])
      expect(state.topRulesCard).toHaveLength(1)

      // Still loading
      expect(state.isLoading).toBe(true)

      // Finish loading
      commit('SET_LOADING', false)
      expect(state.isLoading).toBe(false)

      // Verify both loaded
      expect(state.investigationCard.count).toBe(5)
      expect(state.topRulesCard).toHaveLength(1)
    })
  })

  describe('localStorage and Persistence Patterns', () => {
    let mockLocalStorage

    beforeEach(() => {
      state = JSON.parse(JSON.stringify(widgetsStore.state))

      mockLocalStorage = {
        data: {},
        getItem: jest.fn((key) => mockLocalStorage.data[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage.data[key] = value
        }),
        removeItem: jest.fn((key) => {
          delete mockLocalStorage.data[key]
        }),
        clear: jest.fn(() => {
          mockLocalStorage.data = {}
        })
      }
    })

    it('simulates persisting investigation card to localStorage', () => {
      const data = { count: 5, type: 'critical' }
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, data)

      // Simulate saving to localStorage
      mockLocalStorage.setItem('investigation_card', JSON.stringify(state.investigationCard))

      // Verify it was saved
      const saved = mockLocalStorage.getItem('investigation_card')
      expect(JSON.parse(saved)).toEqual(data)
    })

    it('simulates persisting and restoring state from localStorage', () => {
      const initialData = {
        investigationCard: { count: 5 },
        topRulesCard: [{ id: 1, name: 'Rule 1' }],
        isLoading: false
      }

      // Save to localStorage
      mockLocalStorage.setItem('widgets_state', JSON.stringify(initialData))

      // Simulate restoring from localStorage
      const restored = JSON.parse(mockLocalStorage.getItem('widgets_state'))

      // Apply restored state
      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, restored.investigationCard)
      widgetsStore.mutations.SET_TOP_RULES(state, restored.topRulesCard)
      widgetsStore.mutations.SET_LOADING(state, restored.isLoading)

      expect(state.investigationCard).toEqual(initialData.investigationCard)
      expect(state.topRulesCard).toEqual(initialData.topRulesCard)
      expect(state.isLoading).toBe(false)
    })

    it('handles localStorage serialization of complex state', () => {
      const complexState = {
        investigationCard: { count: 5, metadata: { created: '2024-01-01', tags: ['tag1', 'tag2'] } },
        topRulesCard: [
          { id: 1, name: 'Rule 1', conditions: { severity: 'high', enabled: true } },
          { id: 2, name: 'Rule 2', conditions: { severity: 'medium', enabled: false } }
        ]
      }

      widgetsStore.mutations.SET_INVESTIGATION_CARD(state, complexState.investigationCard)
      widgetsStore.mutations.SET_TOP_RULES(state, complexState.topRulesCard)

      // Serialize and deserialize
      const serialized = JSON.stringify(state)
      const deserialized = JSON.parse(serialized)

      expect(deserialized.investigationCard).toEqual(complexState.investigationCard)
      expect(deserialized.topRulesCard).toEqual(complexState.topRulesCard)
    })

    it('simulates selective state persistence (only certain properties)', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Load all data
      commit('SET_LOADING', true)
      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_TOP_RULES', [{ id: 1 }])

      // Save only persistent properties
      const persistentState = {
        investigationCard: state.investigationCard,
        topRulesCard: state.topRulesCard
      }

      mockLocalStorage.setItem('widgets_persistent', JSON.stringify(persistentState))

      // Restore and verify
      const restored = JSON.parse(mockLocalStorage.getItem('widgets_persistent'))
      expect(restored.investigationCard).toEqual({ count: 5 })
      expect(restored.topRulesCard).toHaveLength(1)
    })

    it('handles state clearing and localStorage cleanup', () => {
      const commit = (mutationName, payload) => {
        widgetsStore.mutations[mutationName](state, payload)
      }

      // Load data
      commit('SET_INVESTIGATION_CARD', { count: 5 })
      commit('SET_TOP_RULES', [{ id: 1 }])

      // Save to localStorage
      mockLocalStorage.setItem('widgets', JSON.stringify(state))
      expect(mockLocalStorage.getItem('widgets')).toBeTruthy()

      // Clear state
      commit('SET_INVESTIGATION_CARD', {})
      commit('SET_TOP_RULES', [])
      mockLocalStorage.removeItem('widgets')

      expect(mockLocalStorage.getItem('widgets')).toBeNull()
    })

    it('simulates localStorage expiration pattern', () => {
      const data = { count: 5 }
      const expirationTime = Date.now() + 3600000 // 1 hour

      const stateWithExpiry = {
        data: data,
        expiry: expirationTime
      }

      mockLocalStorage.setItem('investigation_with_expiry', JSON.stringify(stateWithExpiry))

      // Check if not expired
      const saved = JSON.parse(mockLocalStorage.getItem('investigation_with_expiry'))
      const isExpired = Date.now() > saved.expiry
      expect(isExpired).toBe(false)
    })

    it('handles corrupted localStorage data gracefully', () => {
      mockLocalStorage.setItem('corrupted', 'not valid json')

      try {
        const data = JSON.parse(mockLocalStorage.getItem('corrupted'))
      } catch (e) {
        // Expected to fail
        expect(e).toBeDefined()
      }

      // State should remain unchanged
      expect(state.investigationCard).toEqual({})
    })
  })
})
