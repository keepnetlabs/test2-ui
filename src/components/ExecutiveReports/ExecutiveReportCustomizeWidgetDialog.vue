<template>
  <AppDialog
    :status="status"
    icon="mdi-cog"
    title="Customize Widget"
    :custom-size="'800'"
    maxHeightSize="804"
    title-id="text--phishing-reporters-download-history-title"
    subtitle-id="text--phishing-reporters-download-history-subtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div class="executive-report-customize-widget-row mb-4">
        <KSelect
          v-model="formData.valueType"
          label="Value Type"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a value type"
          :items="valueTypes"
        />
        <KSelect
          v-model="formData.category"
          label="Category"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a category"
          :items="categories"
        />
        <KSelect
          v-model="formData.groupedBy"
          ref="refFiltersInput"
          label="Grouped By"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a grouped by"
          :items="groupedBy"
        />
      </div>
      <div class="executive-report-customize-widget-row mb-4">
        <KSelect
          v-model="formData.targetGroups"
          label="Target Groups"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a target group"
          style="flex-basis: 33%;"
          :items="targetGroups"
        />
        <VTextField
          v-model="formData.title"
          label="Title"
          outlined
          hide-details
          autocomplete="off"
          style="flex-basis: 33%;"
          placeholder="Enter a title"
        />
        <KSelect
          v-model="formData.chartType"
          label="Chart Type"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a chartType"
          style="flex-basis: 33%;"
          :items="chartTypes"
        />
      </div>
      <div class="executive-report-customize-widget-row mb-4">
        <div
          :class="[
            'position-relative executive-report-customize-widget-row__datepicker',
            formData.startDate ? 'executive-report-customize-widget-row__datepicker-active' : ''
          ]"
          style="flex-basis: 33%;"
        >
          <InputDate
            v-model="formData.startDate"
            class="date-picker-height-40 black-placeholder"
            type="date"
            ref="refPicker"
            placeholder="Select Start Date"
            :format="parsedFormat"
            style="width: 100%;"
            :picker-options="startDatePickerOptions"
            :valueFormat="parsedFormat"
          />
          <div
            v-if="formData.startDate"
            class="executive-report-customize-widget-row__datepicker-text"
          >
            Start Date
          </div>
        </div>
        <div
          :class="[
            'position-relative executive-report-customize-widget-row__datepicker',
            formData.endDate ? 'executive-report-customize-widget-row__datepicker-active' : ''
          ]"
          style="flex-basis: 33%;"
        >
          <InputDate
            v-model="formData.endDate"
            class="date-picker-height-40 black-placeholder w-100"
            type="date"
            ref="refPicker"
            placeholder="Select End Date"
            style="width: 100%;"
            :picker-options="endDatePickerOptions"
            :format="parsedFormat"
            :valueFormat="parsedFormat"
          />
          <div
            v-if="formData.endDate"
            class="executive-report-customize-widget-row__datepicker-text"
          >
            End Date
          </div>
        </div>
        <KSelect
          v-model="formData.dateInterval"
          ref="refFiltersInput"
          label="Date Interval"
          outlined
          hide-details
          autocomplete="off"
          placeholder="Enter a date interval"
          style="flex-basis: 33%;"
          :items="dateIntervals"
        />
      </div>
      <div class="executive-report-customize-widget-preview">
        <div class="executive-report-customize-widget-preview-title">{{ formData.title }}</div>
        <div class="executive-report-customize-widget-preview-type">
          {{ selectedRow.parentKey }}
        </div>
        <div
          :class="[
            'executive-report-customize-widget-preview-chart',
            `executive-report-customize-widget-preview-chart-${selectedRow.chartType}`
          ]"
        >
          <WidgetLoading v-if="isLoading" :loading="isLoading" />
          <template v-else-if="!isLoading && hasData">
            <ExecutiveReportStackedBarChart
              v-if="formData.chartType === 'stackedBar'"
              :time-unit="formData.dateInterval"
              :raw-data="chartData"
            />
            <ExecutiveReportLineChart
              v-else-if="formData.chartType === 'line'"
              :time-unit="formData.dateInterval"
              :raw-data="chartData"
            />
            <ExecutiveReportGaugeChart
              v-else-if="formData.chartType === 'gauge'"
              :raw-data="gaugeChartData"
            />
            <ExecutiveReportBarChart
              v-else-if="formData.chartType === 'bar'"
              :time-unit="formData.dateInterval"
              :raw-data="chartData"
            />
            <ExecutiveReportDoughnutChart
              v-else-if="formData.chartType === 'doughnut'"
              :raw-data="pieChartData"
            />
            <ExecutiveReportPieChart
              v-else-if="formData.chartType === 'pie'"
              :raw-data="pieChartData"
            />
            <ExecutiveReportTable
              v-else-if="formData.chartType === 'table'"
              class="d-flex align-items-center mt-4"
              :columns="executiveReportColumns"
              :data="executiveReportData"
            />
            <div v-if="formData.chartType === 'gauge'" style="margin-top: -56px;">
              <div class="executive-report-gauge-value">
                32
              </div>
              <div class="executive-report-gauge-average" style="margin-top: 0;">
                Industry Average: 40
              </div>
            </div>
          </template>
          <div
            v-else
            class="k-widget-list__empty-inline"
            style="display: flex; align-items: center; justify-content: center;"
          >
            <h2>You do not have any report conclusion</h2>
          </div>
        </div>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
        action-button-text="CONFIRM"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import { mapGetters } from 'vuex'
import ExecutiveReportDoughnutChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportDoughnutChart.vue'
import ExecutiveReportLineChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportLineChart.vue'
import ExecutiveReportGaugeChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportGaugeChart.vue'
import ExecutiveReportPieChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPieChart.vue'
import ExecutiveReportBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportBarChart.vue'
import ExecutiveReportStackedBarChart from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportStackedBarChart.vue'
import ExecutiveReportTable from '@/components/ExecutiveReports/ExecutiveReportTable.vue'
import { LABEL_STORE, PROPERTY_STORE } from '@/model/constants/commonConstants'
import labels from '@/model/constants/labels'
import { getExecutiveReportChartData } from '@/api/reports'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'

export default {
  name: 'ExecutiveReportCustomizeWidgetDialog',
  components: {
    WidgetLoading,
    ExecutiveReportTable,
    ExecutiveReportStackedBarChart,
    ExecutiveReportBarChart,
    ExecutiveReportPieChart,
    ExecutiveReportGaugeChart,
    ExecutiveReportLineChart,
    ExecutiveReportDoughnutChart,
    InputDate,
    AppDialogFooter,
    KSelect,
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => {}
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      isActionButtonDisabled: false,
      parsedFormat: getTimeZone(false).split(' ')[0],
      dateFormat: localStorage.getItem('selectedDateFormat'),
      executiveReportColumns: [
        {
          property: PROPERTY_STORE.NAME,
          label: LABEL_STORE.NAME,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.EMAIL,
          label: labels.Email,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.DEPARTMENT,
          label: labels.Department,
          align: 'left'
        },
        {
          property: PROPERTY_STORE.RISK_SCORE,
          label: labels.RiskScore,
          align: 'left'
        }
      ],
      executiveReportData: [
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        },
        {
          email: 'nurullah@keepnetlabs.com',
          name: 'Angel Siphron',
          department: 'Marketing',
          riskScore: '80%'
        }
      ],
      chartData: [],
      pieChartData: [],
      gaugeChartData: 0,
      formData: {
        valueType: '',
        category: '',
        groupedBy: '',
        targetGroups: '',
        title: '',
        chartType: '',
        startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
        endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        dateInterval: 'month'
      },
      startDatePickerOptions: {
        disabledDate: this.disabledStartPickerEndDates
      },
      endDatePickerOptions: {
        disabledDate: this.disableDataPickerEndDates
      }
    }
  },
  computed: {
    ...mapGetters({
      valueTypes: 'executiveReports/getValueTypes',
      categories: 'executiveReports/getCategories',
      groupedBy: 'executiveReports/getGroupedBy',
      targetGroups: 'executiveReports/getTargetGroups',
      chartTypes: 'executiveReports/getChartTypes',
      dateIntervals: 'executiveReports/getDateIntervals'
    }),
    hasData() {
      if (this.formData.chartType === 'gauge') return this.gaugeChartData
      else if (['doughnut', 'pie'].includes(this.formData.chartType)) return this.pieChartData
      return this.chartData.length
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.formData.title = this.selectedRow.title
      this.formData.chartType = this.selectedRow.chartType
      this.formData.startDate = this.selectedRow.startDate
      this.formData.endDate = this.selectedRow.endDate
      this.formData.valueType = this.selectedRow.valueType
      this.formData.category = this.selectedRow.category
      this.formData.groupedBy = this.selectedRow.groupedBy
      this.formData.targetGroups = this.selectedRow.targetGroups
      this.formData.dateInterval = this.selectedRow.dateInterval
      this.isLoading = true
      getExecutiveReportChartData()
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          if (this.formData.chartType === 'gauge') this.gaugeChartData = 45
          if (['doughnut', 'pie'].includes(this.formData.chartType)) this.pieChartData = [20, 30]
          this.chartData = data
          this.isLoading = false
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {},
    disabledStartPickerEndDates(val) {
      let selectedEndDate = new Date()
      if (this.formData.endDate) {
        const [datePart, timePart] = this.formData?.endDate?.split(' ')
        const [firstPart, secondPart, thirdPart] = datePart?.split('/')
        let minutes, hours
        if (this.timeFormat && this.timeFormat === '12h') {
          const [hoursPart, minutesPart] = timePart?.split(' ')?.[0]?.split(':')
          minutes = minutesPart
          hours = hoursPart
        } else {
          const [hoursPart, minutesPart] = timePart?.split(':')
          minutes = minutesPart
          hours = hoursPart
        }
        if (this.dateFormat === 'YYYY/MM/DD') {
          selectedEndDate = new Date(firstPart, secondPart - 1, thirdPart, hours, minutes)
        } else if (this.dateFormat === 'MM/DD/YYYY') {
          selectedEndDate = new Date(thirdPart, firstPart - 1, secondPart, hours, minutes)
        } else if (this.dateFormat === 'DD/MM/YYYY') {
          selectedEndDate = new Date(thirdPart, secondPart - 1, firstPart, hours, minutes)
        }
      }
      return selectedEndDate.getTime() < val.getTime()
    },
    disableDataPickerEndDates(val) {
      let selectedStartDate = new Date()
      if (this.formData.startDate) {
        const [datePart, timePart] = this.formData?.startDate?.split(' ')
        const [firstPart, secondPart, thirdPart] = datePart?.split('/')
        let minutes, hours
        if (this.timeFormat && this.timeFormat === '12h') {
          const [hoursPart, minutesPart] = timePart?.split(' ')?.[0]?.split(':')
          minutes = minutesPart
          hours = hoursPart
        } else {
          const [hoursPart, minutesPart] = timePart?.split(':')
          minutes = minutesPart
          hours = hoursPart
        }
        if (this.dateFormat === 'YYYY/MM/DD') {
          selectedStartDate = new Date(firstPart, secondPart - 1, thirdPart, hours, minutes)
        } else if (this.dateFormat === 'MM/DD/YYYY') {
          selectedStartDate = new Date(thirdPart, firstPart - 1, secondPart, hours, minutes)
        } else if (this.dateFormat === 'DD/MM/YYYY') {
          selectedStartDate = new Date(thirdPart, secondPart - 1, firstPart, hours, minutes)
        }
      }
      return selectedStartDate.getTime() > val.getTime()
    }
  }
}
</script>
