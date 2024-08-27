<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="card.title"
          :subtitle="card.parentKey"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="!isEmpty">
            <HorizontalBarChart
              v-if="chartData.datasets"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugin"
              :another-custom-plugin="anotherCustomPlugin"
            />
          </template>
          <div
            v-else
            class="k-widget-list__empty-inline"
            style="display: flex; align-items: center; justify-content: center;"
          >
            <h2 v-if="empty.message">{{ empty.message }}</h2>
            <p v-if="empty.subMes">{{ empty.subMes }}</p>
            <v-btn v-if="empty.btn" class="empty-btn">
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import HorizontalBarChart from '@/components/Common/Charts/HorizontalBar.vue'
import { getExecutiveReportChartData } from '@/api/reports'
export default {
  name: 'ExecutiveReportsUsersTimeToFailure',
  components: {
    ExecutiveWidgetBody,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    HorizontalBarChart,
    WidgetLoading
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => {}
    },
    dateRange: {
      type: Array,
      default: () => []
    },
    datePeriod: {
      type: Number,
      default: 1
    },
    defaultWidgetData: {
      type: [Object, Array]
    },
    dateFormat: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      isEmpty: false,
      empty: {
        message: 'You do not have any report conclusion'
      },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {},
      customPlugin: {
        id: 'customPlugin',
        afterDraw(chart) {
          const ctx = chart.ctx
          ctx.save()
          ctx.strokeStyle = '#757575'
          ctx.lineWidth = 2
          const xAxis = chart.scales['x-axis-0']
          const yAxis = chart.scales['y-axis-0']
          const xTickStart = xAxis.left
          ctx.beginPath()
          ctx.moveTo(xTickStart, yAxis.bottom)
          ctx.lineTo(xAxis.right, yAxis.bottom)
          ctx.stroke()
          ctx.restore()
        }
      },
      anotherCustomPlugin: {
        afterDraw: (chart) => {
          const ctx = chart.chart.ctx
          const fontSize = 12
          const fontFamily = 'Open Sans, sans-serif'
          chart.legend.legendItems.forEach((legendItem, index) => {
            const textParts = legendItem.textParts
            if (textParts) {
              const text = textParts[0]
              const percentage = `(${textParts[1]} users)`
              const x = chart.legend.legendHitBoxes[index].left + 17
              const y = chart.legend.legendHitBoxes[index].top + 6
              ctx.fillStyle = '#383B41'
              ctx.fillText(text, x, y)
              ctx.font = `bold ${fontSize}px ${fontFamily}`
              ctx.fillText(
                percentage,
                x + ctx.measureText(text).width - legendItem.customMarginLeft,
                y + 0.5
              )
              ctx.font = `${fontSize}px ${fontFamily}`
            }
          })
        }
      }
    }
  },
  watch: {
    dateRange() {
      this.callForData()
    }
  },
  created() {
    if (this?.defaultWidgetData?.length) this.setChartData(this.defaultWidgetData)
    else this.callForData()
  },
  methods: {
    callForData() {
      this.isLoading = true
      const payload = {
        widgetIds: [this.card.resourceId],
        datePeriod: this.datePeriod,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      }
      getExecutiveReportChartData(payload)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          this.$emit('on-set-default-widget-data', this.card.key, data)
          this.setChartData(data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(data) {
      if (!data[0].widgetDatas.length) {
        this.isEmpty = true
        return
      }
      let yLabels = data[0].widgetDatas.reduce((acc, curr) => {
        acc.push(parseInt(curr.dataObject.ActionRange))
        return acc
      }, [])
      const addedYLabelsIndex = []
      const clickedData = []
      const submittedData = []
      const companyAvgLinkClickData = []
      const industryAvgLinkClickData = []
      const companyAvgDataSubmitData = []
      const industryAvgDataSubmitData = []
      let maxX = data[0].widgetDatas.reduce((acc, curr) => {
        const currentMax = curr.values.reduce((innerAcc, innerCurr) => {
          if (innerCurr.name === 'Clicked') {
            return innerAcc + innerCurr.value
          } else if (innerCurr.name === 'SubmittedData') {
            return innerAcc + innerCurr.value
          }
          return innerAcc
        }, 0)
        return Math.max(acc, currentMax)
      }, 0)
      const remainder = Math.floor(maxX / 50)
      if (!remainder) {
        maxX = 100
      } else {
        maxX = remainder * 50 + 50
      }
      const addYLabelItem = (item) => {
        const index = yLabels.findIndex((v) => v === item.value)
        if (index !== -1) return
        let newIndex = 0
        for (let i = 0; i < yLabels.length; i++) {
          if (yLabels[i] < item.value) {
            newIndex = i + 1
          }
        }
        const addedIndex = addedYLabelsIndex.push(newIndex)
        for (let i = 0; i < addedIndex - 1; i++) {
          addedYLabelsIndex[i] += 1
        }
        yLabels.splice(newIndex, 0, item.value)
      }
      data[0].widgetDatas[0].values.forEach((item) => {
        if (item.name === 'AverageClickTime') {
          addYLabelItem(item)
        } else if (item.name === 'industryAverageClickTime') {
          addYLabelItem(item)
        } else if (item.name === 'AverageDataSubmitTime') {
          addYLabelItem(item)
        } else if (item.name === 'industryAverageDataSubmitTime') {
          addYLabelItem(item)
        }
      })
      addedYLabelsIndex.forEach((iIndex) => {
        data[0].widgetDatas[0].values.forEach((item) => {
          if (item.name === 'Clicked') {
            clickedData[iIndex] = { x: 0, y: yLabels[iIndex] }
          } else if (item.name === 'SubmittedData') {
            submittedData[iIndex] = { x: 0, y: yLabels[iIndex] }
          }
        })
      })
      const stepSize = maxX > 100 ? Math.ceil(maxX / 5 / 2) * 2 : 20
      data[0].widgetDatas.forEach((item) => {
        const yLabelIndex = yLabels.findIndex((v) => v === parseInt(item.dataObject.ActionRange))
        item.values.forEach((inner) => {
          if (inner.name === 'Clicked') {
            clickedData[yLabelIndex] = { x: inner.value, y: yLabels[yLabelIndex] }
          } else if (inner.name === 'SubmittedData') {
            submittedData[yLabelIndex] = { x: inner.value, y: yLabels[yLabelIndex] }
          }
        })
      })
      yLabels.forEach((lIndex, index) => {
        const multiplier = stepSize * index
        data[0].widgetDatas[0].values.forEach((item) => {
          if (item.name === 'AverageClickTime') {
            companyAvgLinkClickData[index] = { x: multiplier, y: item.value }
          } else if (item.name === 'industryAverageClickTime') {
            industryAvgLinkClickData[index] = { x: multiplier, y: item.value }
            if (index === yLabels.length - 1) {
              industryAvgLinkClickData[index + 1] = { x: maxX, y: item.value }
            }
          } else if (item.name === 'AverageDataSubmitTime') {
            companyAvgDataSubmitData[index] = { x: multiplier, y: item.value }
          } else if (item.name === 'industryAverageDataSubmitTime') {
            industryAvgDataSubmitData[index] = { x: multiplier, y: item.value }
            if (index === yLabels.length - 1) {
              industryAvgDataSubmitData[index + 1] = { x: maxX, y: item.value }
            }
          }
        })
      })
      yLabels = yLabels.reverse()
      const companyAvg = new Image()
      companyAvg.src = require('../../../assets/img/company-avg.svg')
      const industryAvg = new Image()
      industryAvg.src = require('../../../assets/img/industry-avg.svg')
      this.chartOptions = {
        indexAxis: 'y',
        devicePixelRatio: 2,
        responsive: true,
        padding: 24,
        layout: {
          padding: {
            right: 0,
            left: 0
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              gridLines: {
                display: false,
                drawBorder: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Time to Respond (Seconds)',
                fontColor: '#383B41'
              },
              ticks: {
                padding: 0,
                fontSize: 12,
                fontFamily: 'Open Sans, sans-serif',
                fontStyle: '400',
                fontColor: 'rgba(56, 59, 65, 0.72)'
              }
            }
          ],
          xAxes: [
            {
              display: true,
              stacked: true,
              offset: false,
              scaleLabel: {
                display: true,
                labelString: 'Number Of Users',
                fontColor: '#383B41'
              },
              gridLines: {
                display: true,
                color: 'white',
                zeroLineColor: '#F2F2F2',
                z: 1
              },
              ticks: {
                min: 0,
                max: maxX,
                stepSize,
                fontFamily: 'Open Sans, sans-serif',
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9
              }
            }
          ]
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            color: '#383B41',
            font: 'Open-sans,sans-serif',
            padding: 32,
            fontSize: 12,
            generateLabels: (chart = {}) => {
              const { data } = chart
              return [
                {
                  text: `${data.datasets[0].label}`,
                  fillStyle: data.datasets[0].backgroundColor,
                  lineWidth: 0,
                  datasetIndex: 0
                },
                {
                  text: `${data.datasets[1].label}`,
                  fillStyle: data.datasets[1].backgroundColor,
                  lineWidth: 0,
                  datasetIndex: 1
                },
                {
                  text: `Company Avg (Link Click/Data Submit)`,
                  datasetIndex: 2,
                  pointStyle: companyAvg
                },
                {
                  text: `Industry Avg (Link Click/Data Submit)`,
                  fillStyle: data.datasets[1].backgroundColor,
                  pointStyle: industryAvg,
                  datasetIndex: 3
                }
              ]
            }
          },
          onClick(e, legendItem) {
            const index = legendItem.datasetIndex
            const label = legendItem.text
            const ci = this.chart
            const meta = ci.getDatasetMeta(index)
            if (label === 'Company Avg (Link Click/Data Submit)') {
              const dataSubmitMeta = ci.getDatasetMeta(3)
              meta.hidden = meta.hidden === null ? !ci.data.datasets[2].hidden : null
              dataSubmitMeta.hidden =
                dataSubmitMeta.hidden === null ? !ci.data.datasets[3].hidden : null
            } else if (label === 'Industry Avg (Link Click/Data Submit)') {
              const dataSubmitMeta = ci.getDatasetMeta(5)
              const linkMeta = ci.getDatasetMeta(4)
              linkMeta.hidden = linkMeta.hidden === null ? !ci.data.datasets[4].hidden : null
              dataSubmitMeta.hidden =
                dataSubmitMeta.hidden === null ? !ci.data.datasets[5].hidden : null
            } else {
              meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null
            }

            ci.update()
          }
        },
        tooltips: {
          enabled: false,
          mode: 'nearest',

          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById('chartjs-tooltip-users-time-to-failure')

            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-users-time-to-failure'
              tooltipEl.innerHTML =
                '<div class="tooltip-content"><table></table></div><div class="tooltip-footer"></div>'
              document.body.appendChild(tooltipEl)
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            let position = this._chart.canvas.getBoundingClientRect()

            let tooltipWidth = tooltipEl.offsetWidth > 300 ? 250 : tooltipEl.offsetWidth
            tooltipEl.style.opacity = 1
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX - tooltipWidth / 2 + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.pointerEvents = 'none'

            let tooltipContent = tooltipEl.querySelector('.tooltip-content')
            tooltipContent.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipContent.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipContent.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipContent.style.padding =
              tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipContent.style.background = 'white'
            tooltipContent.style.border = '1px solid #ccc'
            tooltipContent.style.borderRadius = '8px'
            tooltipContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
            if (tooltipModel.body && this._chart && this._chart.data.datasets) {
              let tableRoot = tooltipContent.querySelector('table')
              tableRoot.innerHTML = ''
              tableRoot.style.width = '100%'
              const datasetIndex = tooltipModel.dataPoints[0].datasetIndex
              let titleRow = document.createElement('tr')
              const index = tooltipModel.dataPoints[0].index
              const activeIndex = yLabels.length - 1 - index
              const yValue = yLabels[activeIndex]
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;">${yValue}th second</th>`
              if (datasetIndex === 0 || datasetIndex === 1) tableRoot.appendChild(titleRow)
              const addRow = (datasetIndex, addPaddingBottom = true) => {
                const dataset = this._chart.data.datasets[datasetIndex]
                let datasetLabel = dataset.label
                let dataValue = dataset.data[index]
                let value = dataValue.x
                if (datasetLabel === 'Clicked') {
                  datasetLabel = 'Users Clicked Link'
                } else if (datasetLabel === 'Submitted Data') {
                  datasetLabel = 'Users Submitted Data'
                } else if (datasetLabel === 'Company Avg Link Click') {
                  datasetLabel = 'Avg Time to Link Clicked'
                  value = dataValue.y
                  value += 's'
                } else if (datasetLabel === 'Industry Avg Link Click') {
                  datasetLabel = 'Industry Avg Time to Link Clicked'
                  value = dataValue.y
                  value += 's'
                } else if (datasetLabel === 'Company Avg Data Submit') {
                  datasetLabel = 'Avg Time to Submitted Data'
                  value = dataValue.y
                  value += 's'
                } else if (datasetLabel === 'Industry Avg Data Submit') {
                  datasetLabel = 'Industry Avg Time to Submitted Data'
                  value = dataValue.y
                  value += 's'
                }
                let backgroundColor = dataset.backgroundColor
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>
                    <span style="background-color:${backgroundColor}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                    ${datasetLabel}:&nbsp;
                </td>
                <td style="font-weight: 600">${value || 0}</td>
            `
                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                if (addPaddingBottom) tr.style.paddingBottom = '6px'
                tableRoot.appendChild(tr)
                return value
              }
              if (datasetIndex === 0 || datasetIndex === 1) {
                const firstDataIndexVal = addRow(0)
                const secondDataIndexVal = addRow(1)
                let lastTr = document.createElement('tr')
                lastTr.innerHTML = `
                <td>

                    Total Number of Users:
                </td>
                <td style="font-weight:600;">${firstDataIndexVal + secondDataIndexVal}</td>
            `
                lastTr.style.borderTop = '1px solid #E0E0E0'
                lastTr.style.display = 'flex'
                lastTr.style.justifyContent = 'space-between'
                lastTr.style.paddingTop = '8px'
                tableRoot.appendChild(lastTr)
              } else {
                addRow(tooltipModel.dataPoints[0].datasetIndex, false)
              }
            }
            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
            })
          },
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'right',
            anchor: 'left',
            color: '#000',
            formatter: function (value, context) {
              console.log('context', context)
              console.log('value', value)
              if (
                context.dataset.label === 'Company Avg Link Click' &&
                context.dataIndex === companyAvgLinkClickData.length - 1
              ) {
                return 'Users are phished more quickly \n than industry avg'
              } else if (
                context.dataset.label === 'Company Avg Data Submit' &&
                context.dataIndex === companyAvgDataSubmitData.length - 1
              ) {
                return 'Users are phished more quickly \n than industry avg'
              }
              return ''
            },
            font: {
              size: 9,
              family: 'Open Sans, sans-serif',
              weight: 'normal'
            },
            borderRadius: 4,
            padding: 6
          }
        }
      }
      this.chartData = {
        yLabels,
        datasets: [
          {
            label: 'Clicked',
            data: clickedData,
            barThickness: 20,
            backgroundColor: '#F56C6C',
            borderWidth: 1,
            stack: 'Stack 1',
            order: 1
          },
          {
            label: 'Submitted Data',
            data: submittedData,
            barThickness: 20,
            backgroundColor: '#B83A3A',
            borderWidth: 1,
            stack: 'Stack 1',
            order: 1
          },
          {
            label: 'Company Avg Link Click',
            type: 'line',
            id: 'avg-link-click',
            data: companyAvgLinkClickData,
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            fill: false,
            pointRadius: 2,
            pointStyle: 'dash',
            lineTension: 0,
            stack: 'Stack 2',
            order: 0
          },
          {
            label: 'Company Avg Data Submit',
            type: 'line',
            id: 'avg-data-submit',
            data: companyAvgDataSubmitData,
            backgroundColor: '#D1AD0C',
            borderColor: '#D1AD0C',
            fill: false,
            pointRadius: 2,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
          },
          {
            label: 'Industry Avg Link Click',
            type: 'line',
            id: 'avg-link-click',
            data: industryAvgLinkClickData,
            backgroundColor: '#D1AD0C',
            borderColor: '#D1AD0C',
            pointRadius: 2,
            borderDash: [10, 10],
            borderWidth: 2,
            fill: false,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
          },
          {
            label: 'Industry Avg Data Submit',
            type: 'line',
            id: 'avg-data-submit',
            data: industryAvgDataSubmitData,
            backgroundColor: '#1173C1',
            borderColor: '#1173C1',
            pointRadius: 2,
            borderDash: [10, 10],
            borderWidth: 2,
            fill: false,
            pointStyle: 'dash',
            lineTension: 0,
            order: 0
          }
        ]
      }
      this.isEmpty = false
      this.isLoading = false
    },
    handleDelete() {
      this.$emit('on-delete', this.card)
    },
    handleEdit() {
      this.$emit('on-edit', this.card)
    }
  }
}
</script>
