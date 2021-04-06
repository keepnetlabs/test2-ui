<template>
  <WidgetLoading :loading="isLoading">
    <template v-slot:skeleton-content>
      <widget-container>
        <widget-header
          :title="getTitle"
          :link="{ href: '/incident-responder', text: 'Incident Responder' }"
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
import { getNotifiedEmailsTrend } from '@/api/dashboard'
import { getDataTableFieldLabel } from '@/utils/functions'
import labels from '@/model/constants/labels'
export default {
  name: 'ReportedEmailTrends',
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
        message: "There isn't any reported emails yet."
      },
      isLoading: true,
      axiosPayload: {
        pageNumber: 1,
        pageSize: 100000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      chartOptions: {},
      chartData: {}
    }
  },
  created() {
    this.callForGetNotifiedEmails()
  },
  computed: {
    getTitle() {
      return labels.ReportedEmailTrends
    }
  },
  methods: {
    onEmptyBtnClicked() {},
    callForGetNotifiedEmails() {
      getNotifiedEmailsTrend(this.axiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          if (data.length) {
            let minDate = Date.now(),
              maxDate = null,
              minEmailCount = 0,
              maxEmailCount = 0
            let itemTypes = new Set()
            const newData = data.map((row) => {
              let { month, result, emailCount } = row
              const splittedDate = month.split('-')
              const timeStampOfDate = new Date(splittedDate[0], splittedDate[1] - 1).getTime()
              if (timeStampOfDate < minDate) {
                minDate = timeStampOfDate
              }
              if (timeStampOfDate > maxDate) {
                maxDate = timeStampOfDate
              }
              if (emailCount < minEmailCount) {
                minEmailCount = emailCount
              }
              if (emailCount > maxEmailCount) {
                maxEmailCount = emailCount
              }
              itemTypes.add(result)
              return { x: timeStampOfDate, y: emailCount, result }
            })

            let maxEmailCountLeft = maxEmailCount % 10
            let remanining = 10 - maxEmailCountLeft
            maxEmailCount += remanining
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
                      min: minEmailCount,
                      max: maxEmailCount,
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
              Undetected: {
                backgroundColor: 'white',
                borderColor: '#00bcd4',
                fill: false,
                pointRadius: 3,
                borderWidth: 2,
                lineTension: 0
              },
              Phishing: {
                backgroundColor: 'white',
                borderColor: '#f56c6c',
                fill: false,
                pointRadius: 3,
                borderWidth: 2,
                lineTension: 0
              },
              Malicious: {
                backgroundColor: 'white',
                borderColor: '#b83a3a',
                fill: false,
                pointRadius: 3,
                borderWidth: 2,
                lineTension: 0
              }
            }
            for (let itemType of itemTypes) {
              datasets.push({
                label: getDataTableFieldLabel(itemType),
                ...colors[itemType],
                data: newData.filter((item) => item.result === itemType)
              })
            }

            this.chartData = {
              datasets
            }
          }
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>

<style lang="scss"></style>
