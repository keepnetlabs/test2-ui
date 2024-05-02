<template>
  <div class="new-executive-report">
    <div class="new-executive-report__left">
      <VTextField
        v-model="search"
        id="input--search-training-library"
        ref="searchInput"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        @input="handleSearch"
      />
      <div class="executive-report-search-card-container mt-4">
        <ExecutiveReportSearchCard
          v-for="card in getCards"
          :key="card.name"
          :card="card"
          @on-add-chart="handleSearchAdd"
        />
      </div>
    </div>
    <div class="new-executive-report__right">
      <ExecutiveReportNewCard ref="refCharts" />
    </div>
  </div>
</template>

<script>
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import ExecutiveReportSearchCard from '@/components/ExecutiveReports/ExecutiveReportSearchCard.vue'

export default {
  name: 'NewExecutiveReport',
  components: { ExecutiveReportSearchCard, ExecutiveReportNewCard },
  data() {
    return {
      search: '',
      cards: [
        {
          name: 'Phishing Metrics',
          charts: [
            {
              name: 'Phishing Overview',
              src: '/phishing-overview.svg',
              chartType: 'line',
              key: 'PhishingOverview'
            },
            {
              name: 'Phishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'stackedBar',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Threats (Phishing)',
              src: '/reported-email-threats.svg',
              key: 'ReportedEmailThreats(Phishing)',
              chartType: 'bar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: '/recently-posted-threats.svg',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            },
            {
              name: 'Consolidated Phishing Simulation Metrics',
              src: '/recently-posted-threats.svg',
              key: 'ConsolidatedPhishingSimulationMetrics',
              chartType: 'bar'
            },
            {
              name: 'Count Of Phished Campaigns',
              src: '/count-of-phished-campaigns.svg',
              key: 'CountOfPhishedCampaigns',
              chartType: 'area'
            }
          ]
        },
        {
          name: 'Training Metrics',
          charts: [
            {
              name: 'Training Completion',
              src: '/training-completion.svg',
              chartType: 'doughnut',
              key: 'TrainingCompletion'
            },
            {
              name: 'Training Enrollments',
              src: '/training-enrollments.svg',
              key: 'TrainingEnrollments',
              chartType: 'line'
            },
            {
              name: 'Top Riskiest Users',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'table',
              key: 'TopRiskiestUsers'
            }
          ]
        },
        {
          name: 'Vishing Metrics',
          charts: [
            {
              name: 'Vishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'VishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'VishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Quishing Metrics',
          charts: [
            {
              name: 'Quishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'QuishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'QuishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Callback Metrics',
          charts: [
            {
              name: 'Callback Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'CallbackCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'CallbackMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Smishing Metrics',
          charts: [
            {
              name: 'Smishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'SmishingCampaignTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'SmishingMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Phishing Reporter Metrics',
          charts: [
            {
              name: 'Phishing Reporter Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'PhishingReporterTrends'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'PhishingReporterMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Incident Response Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: '/phishing-campaign-trends.svg',
              chartType: 'line',
              key: 'IncidentResponderPhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: '/reported-email-trends.svg',
              key: 'IncidentResponderReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: '/training-completion.svg',
              key: 'IncidentResponderMostEngagedCampaigns',
              chartType: 'doughnut'
            }
          ]
        },
        {
          name: 'Risk Score Trend',
          charts: [
            {
              name: 'Company Risk Score',
              src: '/company-risk-score.svg',
              chartType: 'gauge',
              key: 'RiskScore'
            }
          ]
        },
        {
          name: 'Other',
          charts: []
        }
      ],
      removedCards: {}
    }
  },
  computed: {
    getCards() {
      return this.search ? this.filteredCards : this.cards
    },
    filteredCards() {
      let copyOfCards = JSON.parse(JSON.stringify(this.cards))
      return copyOfCards.filter((card) => {
        card.charts = card.charts.filter((chart) => {
          const isChartNameIncludes = chart.name.toLowerCase().includes(this.search.toLowerCase())
          if (isChartNameIncludes) return chart
        })
        return card.charts.length ? card : null
      })
    }
  },
  methods: {
    handleSearch(value) {},
    handleSearchAdd(chart) {
      this.$refs.refCharts.addWidget(chart)
    }
  }
}
</script>
