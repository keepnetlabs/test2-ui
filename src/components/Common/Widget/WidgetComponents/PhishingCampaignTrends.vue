<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--reported-email-trends"
          close-button-id="btn-close--reported-email-trends"
          :title="getTitle"
          :link="{ href: '/phishing-simulator/campaign-manager', text: 'Campaign Manager' }"
          :edit-mode="editMode"
          @deleteWidget="$emit('deleteWidget')"
        />
        <widget-body>
          <line-chart
            v-if="chartData.datasets"
            :chart-data="chartData"
            :chart-options="chartOptions"
          />
          <div
            class="k-widget-list__empty-inline"
            style="display: flex; align-items: center; justify-content: center;"
            v-else
          >
            <h2 v-if="empty.message">{{ empty.message }}</h2>
            <p v-if="empty.subMes">{{ empty.subMes }}</p>
            <v-btn @click="onEmptyBtnClicked" class="empty-btn" v-if="empty.btn">
              <!-- empty action -->
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </widget-body>
      </widget-container>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetHeader from '@/components/Common/Widget/WidgetHeader'
import WidgetBody from '@/components/Common/Widget/WidgetBody'
import WidgetContainer from '@/components/Common/Widget/WidgetContainer'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading'
import Line from '@/components/Common/Charts/Line'
import { getDataTableFieldLabel } from '@/utils/functions'
import labels from '@/model/constants/labels'
import { mapGetters } from 'vuex'
export default {
  name: 'PhishingCampaignTrends',
  components: {
    WidgetHeader,
    WidgetBody,
    WidgetLoading,
    WidgetContainer,
    'line-chart': Line
  },
  props: {
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      empty: {
        message: 'You do not have any phishing campaign'
      },
      chartOptions: {},
      chartData: {}
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'widgets/getIsLoading',
      phishingCampaignTrends: 'widgets/getPhishingCampaignTrendsCard'
    }),
    getTitle() {
      return labels.PhishingCampaignTrends
    }
  },
  watch: {
    phishingCampaignTrends(data) {
      this.updatePhishingCampaignTrends(data)
    }
  },
  created() {
    this.updatePhishingCampaignTrends(this.phishingCampaignTrends)
  },
  methods: {
    onEmptyBtnClicked() {},
    updatePhishingCampaignTrends(data) {
      if (data.length) {
        let minDate = Date.now(),
          maxDate = null,
          minTrendCount = 0,
          maxTrendCount = 0
        const newData = data.map((row) => {
          let { attachmentOpenedCount, clickedCount, date, phishedUsersCount, submittedCount } = row
          const trendCount =
            attachmentOpenedCount + clickedCount + phishedUsersCount + submittedCount
          const timeStampOfDate = new Date(date).getTime()
          if (timeStampOfDate < minDate) {
            minDate = timeStampOfDate
          }
          if (timeStampOfDate > maxDate) {
            maxDate = timeStampOfDate
          }
          if (trendCount < minTrendCount) {
            minTrendCount = trendCount
          }
          if (trendCount > maxTrendCount) {
            maxTrendCount = trendCount
          }
          return { x: timeStampOfDate, y: trendCount }
        })

        let maxTrendCountLeft = maxTrendCount % 10
        let remanining = 10 - maxTrendCountLeft
        maxTrendCount += remanining
        this.chartOptions = {
          // Look at this bit
          plugins: {
            datalabels: {
              formatter: function () {
                return ''
              },
              color: '#575757'
            }
          },
          tooltips: {
            callbacks: {
              title: (tooltipItem) => {
                const newDate = new Date(tooltipItem[0].xLabel)
                const months = this.months
                return `${months[newDate.getMonth()]} ${newDate.getFullYear()}`
              }
            },
            backgroundColor: '#6d6d6d',
            displayColors: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                display: true,
                type: 'time',
                time: {
                  unit: 'month'
                },
                offset: true,
                gridLines: {
                  display: true,
                  color: 'rgba(128, 151, 177, 0.3)',
                  borderDash: [3]
                },
                ticks: {
                  fontColor: 'rgba(176, 186, 201)',
                  lineHeight: 1.58,
                  min: minDate,
                  max: maxDate
                }
              }
            ],
            yAxes: [
              {
                offset: true,
                gridLines: {
                  display: true,
                  color: 'rgba(128, 151, 177, 0.3)',
                  borderDash: [3]
                },
                ticks: {
                  min: minTrendCount,
                  max: maxTrendCount,
                  labelOffset: 0,
                  beginAtZero: true,
                  padding: -2,
                  fontColor: 'rgba(176, 186, 201)',
                  lineHeight: 1.58
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
        const datasets = []
        datasets.push({
          label: 'Campaign Trend',
          backgroundColor: 'white',
          borderColor: '#f56c6c',
          fill: false,
          pointRadius: 3,
          borderWidth: 2,
          lineTension: 0,
          data: newData
        })
        this.chartData = {
          datasets
        }
      }
    }
  }
}
</script>
