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
    reportersCard: []
  },
  getters: {
    getIsLoading: (state) => state.isLoading,
    getInvestigationCard: (state) => state.investigationCard,
    getIncidentAnalysisCard: (state) => state.incidentAnalysisCard,
    getPhishingReporterCard: (state) => state.phishingReporterCard,
    getROISummaryCard: (state) => state.roiSummaryCard,
    getTopRulesCard: (state) => state.topRulesCard,
    getRecentInvestigationsCard: (state) => state.recentInvestigationsCard,
    getReportersCard: (state) => state.reportersCard
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
    }
  },
  actions: {
    callForWidgets({ commit, dispatch }, payload) {
      commit('SET_LOADING', true)
      return getSummary(payload)
        .then((response) => {
          const {
            dashboardSummary,
            dashboardTopRules,
            runningInvestigations,
            topReporters
          } = response.data
          const {
            investigationTypeCount,
            notifiedEmailResultCount,
            phishingReporterUserStatusCount,
            roiSummary
          } = dashboardSummary.data
          commit('SET_INVESTIGATION_CARD', investigationTypeCount)
          commit('SET_INCIDENT_ANALYSIS_CARD', notifiedEmailResultCount)
          commit('SET_PHISHING_REPORTER_CARD', phishingReporterUserStatusCount)
          commit('SET_ROI_SUMMARY', roiSummary)

          const { data: topRules } = dashboardTopRules

          commit('SET_TOP_RULES', topRules)

          const { data: investigationsData } = runningInvestigations

          commit('SET_RECENT_INVESTIGATIONS', investigationsData)

          const { data: reporters } = topReporters

          commit('SET_REPORTERS', reporters)

          return response
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    }
  }
}

export default widgetsStore
