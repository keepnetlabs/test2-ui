<template>
  <WidgetLoading :loading="isLoading">
    <template #skeleton-content>
      <ExecutiveWidgetContainer>
        <ExecutiveWidgetHeader
          :title="title"
          :subtitle="subtitle"
          :edit-mode="editMode"
          @on-delete="handleDelete"
          @on-edit="handleEdit"
        />
        <ExecutiveWidgetBody>
          <template v-if="isEmpty">
            <div
              class="k-widget-list__empty-inline"
              :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                minHeight: '160px'
              }"
            >
              <h2 class="mb-1">{{ empty.message }}</h2>
              <p v-if="empty.subMessage">{{ empty.subMessage }}</p>
            </div>
          </template>
          <template v-else>
            <div class="security-culture-score-card">
              <div class="score-legend">
                <div v-for="item in legendItems" :key="item.label" class="legend-item">
                  <span class="legend-indicator" :style="{ backgroundColor: item.color }" />
                  <span class="legend-label">{{ item.label }} ({{ item.range }})</span>
                </div>
              </div>
              <div class="score-content">
                <div class="gauge-wrapper">
                  <Gauge v-if="securityScore" ref="scoreChart" :options="gaugeOptions" />
                  <div class="gauge-score">{{ securityScore.toFixed(2) }}</div>
                </div>
                <div class="score-details">
                  <div class="info-box">
                    <div class="box-label">Change vs Previous Period</div>
                    <div class="box-value" :class="changeClass">
                      {{ changeValue > 0 ? '+' : '' }}{{ changeValue.toFixed(2) }}
                    </div>
                    <div class="box-secondary">Previous: {{ previousScore.toFixed(2) }}</div>
                  </div>
                  <div class="info-box">
                    <div class="box-label">Industry Average</div>
                    <div class="box-value">
                      {{ industryAverage.toFixed(2) }}
                    </div>
                    <div class="box-secondary">
                      Difference:
                      <span :class="differenceClass">
                        {{ differenceSign }}{{ differenceValue }}
                      </span>
                      vs industry
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>

<script>
import Gauge from '@/components/Common/Charts/Gauge.vue'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import { getExecutiveReportChartData } from '@/api/reports'

const VALUE_MATCHERS = {
  overall: ['OverallScoreX100', 'Overall Score x100', 'OverallScore'],
  previous: ['PreviousScoreX100', 'Previous Score x100', 'PreviousScore'],
  industry: ['IndustryAverageX100', 'IndustryAverage', 'Industry Avg']
}

export default {
  name: 'ExecutiveReportsSecurityCultureScore',
  components: {
    Gauge,
    WidgetLoading,
    ExecutiveWidgetContainer,
    ExecutiveWidgetHeader,
    ExecutiveWidgetBody
  },
  props: {
    editMode: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      default: () => ({})
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
      type: [Array, Object]
    },
    dateFormat: {
      type: String
    },
    title: {
      type: String,
      default: 'Security Culture Score'
    },
    subtitle: {
      type: String,
      default: 'Overall organizational security awareness'
    }
  },
  data() {
    return {
      isLoading: false,
      score: 0,
      previousScore: 0,
      industryAverage: 0,
      isEmpty: false,
      empty: {
        message: 'No data available for Security Culture Score',
        subMessage: ''
      }
    }
  },
  computed: {
    securityScore() {
      const value = Number(this.score)
      if (Number.isNaN(value)) return 0
      return Math.min(Math.max(value, 0), 5)
    },
    changeValue() {
      const previous = Number.isNaN(Number(this.previousScore))
        ? this.securityScore
        : this.previousScore
      return this.securityScore - previous
    },
    gaugeOptions() {
      return {
        hasNeedle: true,
        needleColor: '#000000',
        arcColors: ['#F56C6C', '#E6A23C', '#FBF280', '#43A047', '#217124'],
        arcDelimiters: [20, 40, 60, 80],
        arcPadding: 0,
        arcPaddingColor: '#f5f5f5',
        rangeLabel: ['0', '5'],
        arcLabels: ['1', '2', '3', '4'],
        arcLabelFontSize: true,
        arcOverEffect: false,
        rangeLabelFontSize: false,
        chartWidth: 400,
        labelsFont: 'Open Sans',
        needleValue: this.securityScore * 20
      }
    },
    legendItems() {
      return [
        { label: 'At Risk', color: '#F56C6C', range: '0-1' },
        { label: 'Weak', color: '#E6A23C', range: '1-2' },
        { label: 'Needs Improvement', color: '#FBF280', range: '2-3' },
        { label: 'Moderate', color: '#43A047', range: '3-4' },
        { label: 'Strong', color: '#217124', range: '4-5' }
      ]
    },
    changeClass() {
      if (this.changeValue > 0) return 'positive'
      if (this.changeValue < 0) return 'negative'
      return 'neutral'
    },
    difference() {
      return this.securityScore - this.industryAverage
    },
    differenceClass() {
      if (this.difference > 0) return 'positive'
      if (this.difference < 0) return 'negative'
      return 'neutral'
    },
    differenceSign() {
      return this.difference > 0 ? '+' : ''
    },
    differenceValue() {
      return this.difference.toFixed(2)
    }
  },
  watch: {
    defaultWidgetData: {
      handler(newValue) {
        if (!newValue) return
        this.applyWidgetData(newValue)
      },
      immediate: true,
      deep: true
    },
    dateRange: {
      handler(newRange) {
        if (newRange?.length) {
          this.callForData()
        }
      },
      deep: true
    }
  },
  created() {
    if (!this.defaultWidgetData) {
      this.callForData()
    }
  },
  methods: {
    applyWidgetData(payload) {
      const widgetDatas = this.normalizeWidgetDatas(payload)
      if (!widgetDatas.length) {
        this.isEmpty = true
        return
      }
      this.isEmpty = false
      this.setScoreData(widgetDatas[0])
    },
    normalizeWidgetDatas(payload) {
      if (!payload) return []
      if (Array.isArray(payload)) {
        if (payload[0]?.widgetDatas) return payload[0].widgetDatas
        return payload
      }
      if (payload?.widgetDatas) return payload.widgetDatas
      return []
    },
    setScoreData(entry) {
      if (!entry) return
      const dataObject = entry.dataObject || {}

      const values = entry.values || []
      const overall =
        this.normalizeScore(
          dataObject.overallScore ?? this.extractValue(values, VALUE_MATCHERS.overall)
        ) ?? null
      const previous =
        this.normalizeScore(
          dataObject.previousScore ?? this.extractValue(values, VALUE_MATCHERS.previous)
        ) ?? this.previousScore
      const industry =
        this.normalizeScore(
          dataObject.industryAverage ?? this.extractValue(values, VALUE_MATCHERS.industry)
        ) ?? this.industryAverage

      if (overall !== null) this.score = overall
      if (previous !== null) this.previousScore = previous
      if (industry !== null) this.industryAverage = industry
    },
    extractValue(values, matchers) {
      return (
        values.find((value) => {
          if (!value) return false
          const lowerName = (value.name || '').toLowerCase()
          const lowerLabel = (value.label || '').toLowerCase()
          return matchers.some((matcher) => {
            const target = matcher.toLowerCase()
            return lowerName === target || lowerLabel === target || lowerLabel.includes(target)
          })
        })?.value ?? null
      )
    },
    normalizeScore(value) {
      if (value === null || value === undefined) return null
      const numeric = Number(value)
      if (Number.isNaN(numeric)) return null
      if (numeric > 5) return Number((numeric / 100).toFixed(2))
      if (numeric < 0) return 0
      return Number(numeric.toFixed(2))
    },
    callForData() {
      if (!this.card?.resourceId || !this.dateRange?.length) return
      this.isLoading = true
      const payload = {
        widgetIds: [this.card.resourceId],
        datePeriod: this.datePeriod,
        startDate: this.dateRange[0],
        endDate: this.dateRange[1]
      }

      getExecutiveReportChartData(payload)
        .then((response) => {
          const data = response?.data?.data || []
          if (!data.length) {
            this.isEmpty = true
            return
          }
          this.isEmpty = false
          this.$emit('on-set-default-widget-data', this.card.key, data)
          const widgetDatas = this.normalizeWidgetDatas(data[0])
          if (widgetDatas.length) {
            this.isEmpty = false
            this.setScoreData(widgetDatas[0])
            return
          }
          this.isEmpty = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getRiskLevel() {
      const score = this.securityScore
      if (score >= 4) return 'excellent'
      if (score >= 3) return 'good'
      if (score >= 2) return 'moderate'
      if (score >= 1) return 'poor'
      return 'critical'
    },
    handleDelete() {
      this.$emit('on-delete')
    },
    handleEdit() {
      this.$emit('on-edit')
    }
  }
}
</script>
