<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          button-id="btn-link--reported-email-trends"
          close-button-id="btn-close--reported-email-trends"
          :title="getTitle"
          :link="{ href: '/reports/campaign-reports', text: 'Campaign Reports' }"
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
        message: labels.EmptyPhishingTrends
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
    updatePhishingCampaignTrends(data) {
      if (data.length) {
        let minDate = Date.now(),
          maxDate = null,
          minTrendCount = 0,
          maxTrendCount = 0
        let itemTypes = ['attachmentOpenedCount', 'clickedCount', 'submittedCount']
        const newData = []
        for (const row of data) {
          let { attachmentOpenedCount, clickedCount, submittedCount, date } = row
          const splittedDate = date?.split('-')
          const timeStampOfDate = new Date(splittedDate[0], splittedDate[1] - 1).getTime()
          if (timeStampOfDate < minDate) {
            minDate = timeStampOfDate
          }
          if (timeStampOfDate > maxDate) {
            maxDate = timeStampOfDate
          }
          if (attachmentOpenedCount < minTrendCount) {
            minTrendCount = attachmentOpenedCount
          }
          if (attachmentOpenedCount > maxTrendCount) {
            maxTrendCount = attachmentOpenedCount
          }
          if (clickedCount < minTrendCount) {
            minTrendCount = clickedCount
          }
          if (clickedCount > maxTrendCount) {
            maxTrendCount = clickedCount
          }
          if (submittedCount < minTrendCount) {
            minTrendCount = submittedCount
          }
          if (submittedCount > maxTrendCount) {
            maxTrendCount = submittedCount
          }

          newData.push(
            { x: timeStampOfDate, y: attachmentOpenedCount, result: 'attachmentOpenedCount' },
            {
              x: timeStampOfDate,
              y: clickedCount,
              result: 'clickedCount'
            },
            {
              x: timeStampOfDate,
              y: submittedCount,
              result: 'submittedCount'
            }
          )
        }
        if (maxTrendCount) {
          const remainder = Math.floor(maxTrendCount / 50)
          if (!remainder) {
            maxTrendCount = 50
          } else {
            maxTrendCount = remainder * 50 + 50
          }
        } else {
          maxTrendCount += 10 - (maxTrendCount % 10)
        }
        this.chartOptions = {
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
                  lineHeight: 1.58,
                  maxTicksLimit: 6,
                  stepSize: maxTrendCount / 5
                }
              }
            ]
          },

          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              fontColor: '#757575',
              generateLabels(chart = {}) {
                const { data } = chart
                return data.datasets.map((item) => {
                  return {
                    text: item.label,
                    fillStyle: item.borderColor,
                    lineWidth: 0
                  }
                })
              },
              fontFamily: 'Open-sans,sans-serif',
              padding: 16,
              fontSize: 12
            }
          }
        }
        itemTypes = [...itemTypes]
        const datasets = []
        const colors = {
          attachmentOpenedCount: {
            label: 'Opened Attachment',
            backgroundColor: 'white',
            borderColor: '#0198AC',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0
          },
          clickedCount: {
            label: 'Clicked',
            backgroundColor: 'white',
            borderColor: '#E6A23C',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0
          },
          submittedCount: {
            label: 'Submitted',
            backgroundColor: 'white',
            borderColor: '#B83A3A',
            fill: false,
            pointRadius: 3,
            borderWidth: 2,
            lineTension: 0
          }
          // Reported type will be added later
          // Reported: {
          //   backgroundColor: 'white',
          //   borderColor: '#43A047',
          //   fill: false,
          //   pointRadius: 3,
          //   borderWidth: 2,
          //   lineTension: 0
          // }
        }
        for (let itemType of itemTypes) {
          datasets.push({
            label: colors[itemType].label,
            ...colors[itemType],
            data: newData.filter((item) => item.result === itemType)
          })
        }
        this.chartData = {
          datasets
        }
      }
    }
  }
}
</script>
