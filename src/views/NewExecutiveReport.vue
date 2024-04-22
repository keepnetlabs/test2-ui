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
        @input="handleDebouncedSearch"
      />
      <div class="executive-report-search-card-container mt-4">
        <ExecutiveReportSearchCard
          v-for="card in cards"
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
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Training Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Vishing Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Quishing Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Callback Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Smishing Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Phishing Reporter Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Incident Response Metrics',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Risk Score Trend',
          charts: [
            {
              name: 'Risk Score',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'gauge',
              key: 'RiskScore'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        },
        {
          name: 'Other',
          charts: [
            {
              name: 'Phishing Campaign Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              chartType: 'line',
              key: 'PhishingCampaignTrends'
            },
            {
              name: 'Reported Email Trends',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'ReportedEmailTrends',
              chartType: 'stackedBar'
            },
            {
              name: 'Most Engaged Campaigns',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'MostEngagedCampaigns',
              chartType: 'doughnut'
            },
            {
              name: 'Recently Posted Threats',
              src: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
              key: 'RecentlyPostedThreats',
              chartType: 'bar'
            }
          ]
        }
      ],
      removedCards: {}
    }
  },
  methods: {
    handleDebouncedSearch(value) {},
    handleSearchAdd(chart) {
      this.$refs.refCharts.addWidget(chart)
    }
  }
}
</script>
