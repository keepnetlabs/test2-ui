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
            <BarChart
              v-if="chartData.datasets"
              :chart-data="chartData"
              :chart-options="chartOptions"
              :custom-plugin="customPlugins"
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
import BarChart from '@/components/Common/Charts/Bar.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'

export default {
  name: 'ExecutiveReportsPhishingDwellTimeDistribution',
  components: {
    ExecutiveWidgetBody,
    ExecutiveWidgetHeader,
    ExecutiveWidgetContainer,
    BarChart,
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
    }
  },
  data() {
    return {
      chartXScales: [],
      isEmpty: false,
      averageInside: false,
      empty: {
        message: 'You do not have any report conclusion'
      },
      isLoading: false,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      chartOptions: {},
      chartData: {},
      customPlugins: [
        {
          afterDraw: (chart) => {
            const ctx = chart.chart.ctx
            const fontSize = 12
            const fontFamily = 'Open Sans, sans-serif'
            chart.legend.legendItems.forEach((legendItem, index) => {
              const textParts = legendItem.textParts
              if (textParts) {
                const text = textParts[0]
                const percentage = `${textParts[1]} minute${textParts[1] > 1 ? 's' : ''}`
                const x = chart.legend.legendHitBoxes[index].left + 17
                const y = chart.legend.legendHitBoxes[index].top + 6
                ctx.fillStyle = '#383B41'
                ctx.fillText(text, x, y)
                ctx.font = `bold ${fontSize}px ${fontFamily}`
                ctx.fillText(percentage, x + ctx.measureText(text).width - 8, y + 0.5)
                ctx.font = `${fontSize}px ${fontFamily}`
              }
            })
            if (!this.averageInside) return
            const yScale = chart.scales['y-axis-0']
            const xScale = chart.scales['A']
            const dataIndex = this.chartData.datasets[2].data.findIndex((item) => item.x || item.y)
            const xData = this.chartData.datasets[2].data[dataIndex]
            let xCoord = xScale.getPixelForValue(dataIndex)
            const splittedXCoord = this.chartXScales[dataIndex].toString().split(' - ')
            if (parseInt(splittedXCoord[0]) === xData.x) {
              xCoord = xCoord - 14
            } else if (parseInt(splittedXCoord[1]) === xData.x) {
              xCoord = xCoord + 14
            } else {
              const mediumValue = (parseInt(splittedXCoord[0]) + parseInt(splittedXCoord[1])) / 2
              if (xData.x < mediumValue) xCoord = xCoord - mediumValue
              else if (xData.x > mediumValue) xCoord = xCoord + mediumValue
            }
            ctx.beginPath()
            ctx.moveTo(xCoord, yScale.bottom)
            ctx.lineTo(xCoord, yScale.top - 2)
            ctx.strokeStyle = '#B6791D'
            ctx.lineWidth = 2
            ctx.stroke()
          }
        }
      ]
    }
  },
  watch: {
    dateRange() {
      this.callForData()
    }
  },
  created() {
    const widgetDatas = this.defaultWidgetData?.[0]?.widgetDatas
    if (widgetDatas?.length) this.setChartData(widgetDatas)
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
          const widgetDatas = data?.[0]?.widgetDatas || []
          this.$emit('on-set-default-widget-data', this.card.key, data)
          this.setChartData(widgetDatas)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setChartData(widgetDatas) {
      if (!widgetDatas.length) {
        this.isEmpty = true
        return
      }
      let isAverageAdded = false
      let averageDwellTime = 0
      let averageDwellTimeIndex = 0
      let maxDwellTime = 0
      let insideDataIndex = -1
      const labels = widgetDatas.reduce((acc, item) => {
        const { ActionRange } = item.dataObject
        averageDwellTime = item.values.find(({ name }) => name === 'AverageDwellTime').value
        const itemValue = item.values.find(({ name }) => name === 'Percentage').value
        const numberActionRangeStart = parseInt(ActionRange.split('-')[0].trim())
        const numberActionRangeEnd = parseInt(ActionRange.split('-')[1].trim())
        if (numberActionRangeStart <= averageDwellTime) {
          acc.push(ActionRange)
          if (numberActionRangeEnd >= averageDwellTime) {
            averageDwellTimeIndex = -1
            isAverageAdded = true
            insideDataIndex = acc.length - 1
          }
        } else if (numberActionRangeStart >= averageDwellTime) {
          if (!isAverageAdded) {
            acc.push(averageDwellTime)
            averageDwellTimeIndex = acc.length - 1
          }
          acc.push(ActionRange)
          isAverageAdded = true
        }
        if (itemValue > maxDwellTime) maxDwellTime = itemValue
        return acc
      }, [])
      const dwellTimeBarData = widgetDatas.reduce((acc, item, index) => {
        let tempData = item.values.find(({ name }) => name === 'Percentage').value
        acc.push(tempData)
        return acc
      }, [])
      if (averageDwellTimeIndex !== -1)
        dwellTimeBarData.splice(averageDwellTimeIndex, 0, { x: 0, y: 0 })
      let isAddedIndex = false
      const lineBarData = widgetDatas.reduce((acc, item, index) => {
        let tempData = item.values.find(({ name }) => name === 'Percentage').value
        if (index === averageDwellTimeIndex) {
          isAddedIndex = true
          acc.push({ x: Number(labels[index]), y: tempData > 0 ? tempData - 1 : tempData })
        }
        acc.push({
          x: Number(labels[isAddedIndex ? index + 1 : index]),
          y: tempData > 0 ? tempData - 1 : tempData
        })
        return acc
      }, [])
      const averageDwellTimeBarData = new Array(labels.length).fill({ x: 0, y: 0 })
      if (averageDwellTimeIndex !== -1) {
        averageDwellTimeBarData[averageDwellTimeIndex] = { x: averageDwellTime, y: 100 }
      } else if (insideDataIndex > -1) {
        this.averageInside = true
        averageDwellTimeBarData[insideDataIndex] = { x: averageDwellTime, y: 100 }
      }
      this.chartXScales = labels
      this.chartData = {
        datasets: [
          {
            type: 'line',
            stacked: false,
            data: lineBarData,
            backgroundColor: '#B3D4FC',
            borderColor: '#B3D4FC',
            label: 'line',
            borderWidth: 1,
            lineTension: 0.3,
            pointRadius: 0,
            pointStyle: 'dash',
            fill: false,
            order: 2,
            xAxisID: 'A'
          },
          {
            type: 'bar',
            barThickness: 32,
            data: dwellTimeBarData,
            label: 'dwell bar',
            borderColor: '#0198AC',
            backgroundColor: function (context) {
              const index = context.dataIndex
              const value = context.dataset.data[index]
              let color = '#00BCD4'
              if (value === maxDwellTime) color = '#0198AC'
              return color
            },
            fill: false,
            order: 2,
            xAxisID: 'A'
          },
          {
            type: 'bar',
            barThickness: averageDwellTimeIndex !== -1 ? 2 : 0,
            categoryPercentage: 0.5,
            barPercentage: 0.5,
            label: 'Median Dwell Time',
            data: averageDwellTimeBarData,
            backgroundColor: '#B6791D',
            borderColor: '#B6791D',
            fill: false,
            order: 1,
            xAxisID: 'A'
          }
        ]
      }
      this.chartOptions = {
        responsive: true,
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              beginAtZero: true,
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Percentage of Users',
                fontColor: '#383B41'
              },
              offset: false,
              gridLines: {
                display: true,
                color: '#F2F2F2',
                drawBorder: false,
                zeroLineColor: '#757575',
                zeroLineWidth: 2
              },
              ticks: {
                min: 0,
                max: 100,
                stepSize: 20,
                labelOffset: 0,
                padding: 12,
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontFamily: 'Open Sans, sans-serif',
                lineHeight: 1.58,
                callback: function (value) {
                  return ((value / this.max) * 100).toFixed(0) + '%'
                }
              }
            }
          ],
          xAxes: [
            {
              id: 'A',
              type: 'category',
              labels,
              stacked: true,
              position: 'bottom',
              display: true,
              offset: true,
              scaleLabel: {
                display: true,
                labelString: 'Dwell Time (Minutes)',
                fontColor: '#383B41'
              },
              ticks: {
                fontColor: 'rgba(56, 59, 65, 0.72)',
                fontStyle: '600',
                fontSize: 9,
                fontFamily: 'Open-sans,sans-serif'
              },
              gridLines: {
                display: false,
                drawBorder: false
              }
            }
          ]
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            fontColor: '#757575',
            generateLabels(chart = {}) {
              return [
                {
                  text: '',
                  fillStyle: '#B6791D',
                  lineWidth: 0,
                  datasetIndex: 0,
                  industryAverage: averageDwellTime,
                  textParts: ['Median Dwell Time:', averageDwellTime]
                }
              ]
            },
            fontFamily: 'Open-sans,sans-serif',
            padding: 16,
            fontSize: 12
          }
        },
        tooltips: {
          enabled: false,
          custom: function (tooltipModel) {
            let tooltipEl = document.getElementById(
              'chartjs-tooltip-phishing-dwell-time-distribution'
            )
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip-phishing-dwell-time-distribution'
              tooltipEl.innerHTML = '<div class="tooltip-content"><table></table></div>'
              document.body.appendChild(tooltipEl)
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            let position = this._chart.canvas.getBoundingClientRect()

            tooltipEl.style.opacity = 1
            tooltipEl.style.display = 'block'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
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
              let titleRow = document.createElement('tr')
              const xValue = tooltipModel.dataPoints[0].xLabel
              let isAverage = xValue === averageDwellTime
              titleRow.innerHTML = `<th style="text-align: left; display: block; padding-bottom: 8px; font-weight: bold;">${
                isAverage ? 'Average' : ''
              } Dwell Time: ${xValue} minutes</th>`
              if (isAverage) titleRow.querySelector('th').style.paddingBottom = '0'
              tableRoot.appendChild(titleRow)
              this._chart.data.datasets.forEach((dataset, i) => {
                let datasetLabel = dataset.label
                let dataValue = dataset.data[tooltipModel.dataPoints[0].index]
                dataValue = typeof dataValue === 'object' ? dataValue.y : dataValue
                if (datasetLabel !== 'dwell bar' || dataValue <= 0) return
                let tr = document.createElement('tr')
                tr.innerHTML = `
                <td>Percentage of Users:
                </td>
                <td style="font-weight: 600">&nbsp; ${dataValue}%</td>
            `
                tr.style.display = 'flex'
                tr.style.justifyContent = 'space-between'
                tr.style.paddingBottom = '6px'
                tableRoot.appendChild(tr)
              })
            }
            this._chart.canvas.addEventListener('mouseout', () => {
              tooltipEl.style.opacity = 0
              tooltipEl.style.display = 'none'
            })
          },
          xPadding: 12,
          yPadding: 12
        },
        plugins: {
          datalabels: {
            display: true,
            align: 'start',
            offset: -20,
            anchor: 'end',
            color: '#000',
            borderRadius: 4,
            padding: 6,
            formatter: function (value, context) {
              if (
                context.dataset.label === 'line' ||
                value.y <= 0 ||
                context.dataset.label.includes('Median Dwell Time')
              )
                return ''
              return value + '%'
            }
          }
        }
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
