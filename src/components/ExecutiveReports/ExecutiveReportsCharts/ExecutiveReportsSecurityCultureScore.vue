<template>
  <div id="SecurityCultureScoreGaugeWidget">
    <WidgetLoading :loading="isLoading">
      <template #skeleton-content>
        <ExecutiveWidgetContainer class="security-culture-score-widget">
          <ExecutiveWidgetHeader
            :title="formattedTitle"
            :subtitle="widgetDescription || subtitle"
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
              <div
                :class="{
                  'security-culture-score-card': true,
                  'is-safari': isSafari
                }"
              >
                <div class="score-legend">
                  <div v-for="item in legendItems" :key="item.label" class="legend-item">
                    <span class="legend-indicator" :style="{ backgroundColor: item.color }" />
                    <span class="legend-label">{{ item.label }} ({{ item.range }})</span>
                  </div>
                </div>
                <div class="score-content">
                  <div class="gauge-wrapper">
                    <Gauge
                      v-if="securityScore"
                      :key="windowWidth"
                      ref="scoreChart"
                      :options="gaugeOptions"
                    />
                    <div class="gauge-score">
                      {{ securityScore.toFixed(2) }}
                    </div>
                  </div>
                  <div class="score-details">
                    <div
                      class="info-box"
                      :style="{ borderLeft: '4px solid ' + benchmarkBandColor }"
                    >
                      <div class="box-label">{{ benchmarkLabel }}</div>
                      <div class="box-value">
                        {{ benchmarkScore.toFixed(2) }}
                      </div>
                      <div class="box-secondary">
                        {{ benchmarkComparisonSentence }}
                      </div>
                    </div>
                    <div
                      v-if="currentBand"
                      class="info-box band-item"
                      :style="{ borderLeft: '4px solid ' + currentBandColor }"
                    >
                      <div class="box-label band-label">
                        {{ currentBand.label.split('(')[0].trim() }} ({{ currentBand.from }}-{{
                          currentBand.to
                        }})
                      </div>
                      <div class="band-description">
                        {{ currentBand.description }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="score-explanation">
                  <p class="explanation-text">
                    The overall score is the participant-weighted average of 1-5 Likert ratings
                    collected across
                    <span class="highlight" @click="showSurveyDialog = true">
                      {{ enrollmentCount }} survey<span v-if="enrollmentCount !== 1">s</span></span
                    >.
                  </p>
                  <p class="explanation-formula">
                    (Survey₁ Avg × Participants₁ + Survey₂ Avg × Participants₂ + …) / Total
                    Participants
                  </p>
                  <p class="explanation-formula">
                    Example: (3.8 × 100 + 4.5 × 10) / 110 = 3.86
                  </p>
                </div>
              </div>
            </template>
          </ExecutiveWidgetBody>
        </ExecutiveWidgetContainer>
      </template>
    </WidgetLoading>

    <SecurityCultureSurveyDialog
      :status="showSurveyDialog"
      :enrollments="enrollments"
      :overall-score="score"
      @update:status="showSurveyDialog = $event"
    />
  </div>
</template>

<script>
import Gauge from '@/components/Common/Charts/Gauge.vue'
import WidgetLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import ExecutiveWidgetContainer from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue'
import ExecutiveWidgetHeader from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue'
import ExecutiveWidgetBody from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue'
import SecurityCultureSurveyDialog from './SecurityCultureSurveyDialog.vue'
import { getExecutiveReportChartData } from '@/api/reports'
import { handleIsSafari } from '@/utils/functions'

const VALUE_MATCHERS = {
  overall: ['OverallScoreX100', 'Overall Score x100', 'OverallScore'],
  benchmark: [
    'BenchmarkScoreX100',
    'BenchmarkScore',
    'IndustryAverageX100',
    'IndustryAverage',
    'Industry Avg'
  ]
}

export default {
  name: 'ExecutiveReportsSecurityCultureScore',
  components: {
    Gauge,
    WidgetLoading,
    ExecutiveWidgetContainer,
    ExecutiveWidgetHeader,
    ExecutiveWidgetBody,
    SecurityCultureSurveyDialog
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
      default: 'Secure behavior maturity based on employee survey responses'
    }
  },
  data() {
    return {
      isLoading: false,
      score: 0,
      benchmarkScore: 0,
      benchmarkLabel: 'Industry Average',
      benchmarkDifference: 0,
      benchmarkComparisonSentence: '',
      bands: [],
      enrollmentCount: 0,
      participantCount: 0,
      widgetName: '',
      widgetDescription: '',
      enrollments: [],
      showSurveyDialog: false,
      isEmpty: false,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
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
    isSafari() {
      return handleIsSafari()
    },
    formattedTitle() {
      const baseTitle = this.widgetName || this.title
      const bandName = this.currentBand ? this.currentBand.label.split('(')[0].trim() : ''
      if (bandName) {
        return `${baseTitle} - ${this.securityScore.toFixed(2)} (${bandName})`
      }
      return `${baseTitle} - ${this.securityScore.toFixed(2)}`
    },
    gaugeOptions() {
      let chartWidth = this.isSafari ? 420 : 420
      if (this.windowWidth >= 1280 && this.windowWidth < 1440) {
        chartWidth = 330
      } else if (this.windowWidth <= 1024 && this.windowWidth > 854) {
        chartWidth = 380
      } else if (this.windowWidth <= 854 && this.windowWidth > 600) {
        chartWidth = 340
      } else if (this.windowWidth <= 768 && this.windowWidth > 600) {
        chartWidth = 310
      }

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
        chartWidth: chartWidth,
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
    currentBand() {
      if (!this.bands || this.bands.length === 0) return null
      const band = this.bands.find((b) => {
        const from = Number(b.from)
        const to = Number(b.to)
        return this.securityScore >= from && this.securityScore <= to
      })
      return band || null
    },
    currentBandColor() {
      if (!this.currentBand) return '#ccc'
      const baseLabel = this.currentBand.label.split('(')[0].trim().toLowerCase()

      const colorMap = {
        'at risk': '#F56C6C',
        weak: '#E6A23C',
        'needs improvement': '#FBF280',
        moderate: '#43A047',
        strong: '#217124'
      }
      return colorMap[baseLabel] || '#ccc'
    },
    benchmarkBandColor() {
      if (!this.bands || this.bands.length === 0) return '#ccc'
      const band = this.bands.find((b) => {
        const from = Number(b.from)
        const to = Number(b.to)
        return this.benchmarkScore >= from && this.benchmarkScore <= to
      })
      if (!band) return '#ccc'

      const baseLabel = band.label.split('(')[0].trim().toLowerCase()
      const colorMap = {
        'at risk': '#F56C6C',
        weak: '#E6A23C',
        'needs improvement': '#FBF280',
        moderate: '#43A047',
        strong: '#217124'
      }
      return colorMap[baseLabel] || '#ccc'
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
  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
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
      const benchmark =
        this.normalizeScore(
          dataObject.benchmarkScore ?? this.extractValue(values, VALUE_MATCHERS.benchmark)
        ) ?? this.benchmarkScore

      if (overall !== null) this.score = overall
      if (benchmark !== null) this.benchmarkScore = benchmark

      if (dataObject.benchmarkLabel) this.benchmarkLabel = dataObject.benchmarkLabel
      if (dataObject.benchmarkDifference !== undefined)
        this.benchmarkDifference = dataObject.benchmarkDifference
      if (dataObject.benchmarkComparisonSentence)
        this.benchmarkComparisonSentence = dataObject.benchmarkComparisonSentence

      // Set bands from dataObject
      if (dataObject.bands && Array.isArray(dataObject.bands)) {
        this.bands = dataObject.bands
      }

      // Set enrollment and participant counts
      if (dataObject.enrollmentCount !== undefined)
        this.enrollmentCount = dataObject.enrollmentCount
      if (dataObject.participantCount !== undefined)
        this.participantCount = dataObject.participantCount

      // Set widget name and description
      if (dataObject.name) this.widgetName = dataObject.name
      if (dataObject.description) this.widgetDescription = dataObject.description

      // Set enrollments list
      if (Array.isArray(dataObject.enrollments)) this.enrollments = dataObject.enrollments
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
    handleWindowResize() {
      this.windowWidth = window.innerWidth
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

<style>
.security-culture-score-widget {
  padding-bottom: 24px !important;
}

.security-culture-score-card {
  display: flex;
  flex-direction: column;
  position: relative;
}

.score-legend {
  flex-shrink: 0;
}

.score-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
}

.gauge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-top: -32px;
}

.gauge-score {
  font-size: 24px;
  font-weight: 600;
  color: #212121;
  margin-top: -28px !important;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 180px;
  margin-left: 30px;
}

@media (max-width: 1440px) {
  .score-explanation {
    top: 228px !important;
  }
}

@media (max-width: 1440px) and (min-width: 1280px) {
  .is-safari.security-culture-score-card .gauge-wrapper {
    margin-top: -36px !important;
  }
  .gauge-score {
    margin-top: -4px !important;
  }
  .score-content {
    flex-wrap: nowrap !important;
  }
  .score-details {
    display: flex !important;
  }
  .score-explanation {
    display: block !important;
  }
  .explanation-text {
    max-width: 400px !important;
  }
}

@media (max-width: 1279px) {
  .security-culture-score-card .gauge-wrapper {
    margin-top: 0 !important;
  }
  .score-details {
    display: none !important;
  }
  .score-explanation {
    display: none !important;
  }
  .explanation-text {
    max-width: 400px !important;
  }
}

@media (max-width: 1024px) {
  .security-culture-score-card .gauge-wrapper {
    margin-top: -20px !important;
  }
  .security-culture-score-card .gauge-score {
    margin-top: -12px !important;
  }
}

.band-label {
  font-weight: 600 !important;
  color: #383b41 !important;
}

.band-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-top: 8px;
}

.score-explanation {
  position: absolute;
  top: 244px;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
}

.explanation-text {
  font-size: 10px;
  color: rgba(56, 59, 65, 0.72);
  line-height: 1.4;
  margin: 0;
  margin-bottom: 0 !important;
  font-style: italic;
}

.explanation-text .highlight {
  color: #0066cc;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.explanation-text .highlight:hover {
  opacity: 0.8;
}

.explanation-formula {
  font-size: 9px;
  color: rgba(56, 59, 65, 0.72);
  margin: 0 !important;
  font-style: italic;
}

#SecurityCultureScoreGaugeWidget {
  height: 100%;
}

.widget-body__content {
  height: 100%;
}

@media (min-width: 1440px) {
  .is-safari .gauge-score {
    margin-top: -16px !important;
  }

  .is-safari .score-explanation {
    top: 240px !important;
  }
}
</style>
