import { getSummary } from '@/api/widgets'

const widgetsStore = {
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
          campaignStatus.push(row['totalSubmittedCount'], row['totalAttachmentOpenedCount'])
        }
        return {
          ...row,
          campaignStatus
        }
      }),
    getMostPhishedUsersCard: (state) => state.mostPhishedUsers,
    getPhishingCampaignTrendsCard: (state) => state.phishingCampaignTrends,
    getMostEngagedCampaignsCard: (state) => state.mostEngagedCampaigns,
    getTopPhishingSimulationReportersCard: (state) => state.topPhishingSimulationReporters
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
  actions: {
    callForWidgets({ commit, dispatch }, payload = {}) {
      const { isLoading = true } = payload || {}
      commit('SET_LOADING', true)
      return getSummary({}, isLoading)
        .then((response) => {
          const {
            dashboardSummary,
            dashboardTopRules,
            runningInvestigations,
            topReporters,
            reportedEmailTrends,
            recentPhishingCampaigns,
            mostPhishedUsers,
            phishingCampaignTrends,
            mostEngagedCampaigns,
            topPhishingSimulationReporters
          } = response?.data || {}
          const {
            investigationTypeCount,
            notifiedEmailResultCount,
            phishingReporterUserStatusCount,
            roiSummary
          } = dashboardSummary?.data || {}
          commit('SET_INVESTIGATION_CARD', investigationTypeCount)
          commit('SET_INCIDENT_ANALYSIS_CARD', notifiedEmailResultCount)
          commit('SET_PHISHING_REPORTER_CARD', phishingReporterUserStatusCount)
          commit('SET_ROI_SUMMARY', roiSummary)
          commit('SET_RECENT_CAMPAIGNS', recentPhishingCampaigns?.data || [])
          commit('SET_MOST_PHISHED_USERS', mostPhishedUsers?.data || [])
          commit('SET_PHISHING_CAMPAIGN_TRENDS', phishingCampaignTrends?.data || [])
          commit('SET_MOST_ENGAGED_CAMPAIGNS', mostEngagedCampaigns?.data || [])
          commit(
            'SET_TOP_PHISHING_SIMULATION_REPORTERS',
            topPhishingSimulationReporters?.data || []
          )

          const { data: topRules } = dashboardTopRules

          commit('SET_TOP_RULES', topRules)

          const { data: investigationsData } = runningInvestigations

          commit('SET_RECENT_INVESTIGATIONS', investigationsData)

          const { data: reporters } = topReporters

          commit('SET_REPORTERS', reporters)

          const { data } = reportedEmailTrends

          commit('SET_REPORTED_EMAIL_TRENDS', data)

          return response
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    }
  }
}

export default widgetsStore
