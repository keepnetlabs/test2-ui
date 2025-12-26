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
          <div class="security-culture-score-card">
            <div class="score-legend">
              <div
                v-for="item in legendItems"
                :key="item.label"
                class="legend-item"
              >
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
                  <div class="box-value" :class="changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral'">
                    {{ changeValue > 0 ? '+' : '' }}{{ changeValue.toFixed(2) }}
                  </div>
                  <div class="box-secondary">Previous: {{ previousScore.toFixed(2) }}</div>
                </div>
                <div class="info-box">
                  <div class="box-label">Industry Average</div>
                  <div class="box-value">{{ industryAverage.toFixed(2) }}</div>
                  <div class="box-secondary">
                    Difference: <span :class="(securityScore - industryAverage) > 0 ? 'positive' : (securityScore - industryAverage) < 0 ? 'negative' : 'neutral'">{{ (securityScore - industryAverage) > 0 ? '+' : '' }}{{ (securityScore - industryAverage).toFixed(2) }}</span> vs industry
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    score: {
      type: Number,
      default: 3.75
    },
    previousScore: {
      type: Number,
      default: 3.62
    },
    industryAverage: {
      type: Number,
      default: 3.55
    },
    trend: {
      type: Number,
      default: 5
    },
    title: {
      type: String,
      default: 'Security Culture Score'
    },
    subtitle: {
      type: String,
      default: 'Overall organizational security awareness'
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    securityScore() {
      return Math.min(Math.max(this.score, 0), 5)
    },
    changeValue() {
      return this.securityScore - this.previousScore
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
    }
  },
  methods: {
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
