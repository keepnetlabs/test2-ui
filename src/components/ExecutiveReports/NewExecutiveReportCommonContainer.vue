<template>
  <div class="new-executive-report">
    <div v-if="renderLeftTab" class="new-executive-report__left">
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <VTextField
        v-if="!isLoading"
        v-model="search"
        id="input--search-training-library"
        ref="searchInput"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
      />
      <div v-if="!isLoading" class="executive-report-search-card-container mt-4">
        <ExecutiveReportSearchCard
          v-for="(card, index) in getCards"
          :key="index"
          :card="card"
          :has-manager-metric-added="hasManagerMetricAdded"
          :has-non-manager-metric-added="hasNonManagerMetricAdded"
          @on-add-chart="handleSearchAdd"
        />
      </div>
    </div>
    <div class="new-executive-report__right" :style="!renderLeftTab ? 'flex-basis:100%' : ''">
      <ExecutiveReportNewCard
        ref="refCharts"
        :is-preview="!renderLeftTab"
        :is-edit="isEdit"
        :is-duplicate="isDuplicate"
        :default-company-logo="defaultCompanyLogo"
        @on-layout-get="handleLayoutGet"
        @on-edit="renderLeftTab = true"
        @on-edit-cancel="renderLeftTab = false"
        @on-delete="handleDeleteWidget"
      />
    </div>
  </div>
</template>

<script>
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'
import ExecutiveReportSearchCard from '@/components/ExecutiveReports/ExecutiveReportSearchCard.vue'
import {
  getExecutiveReportLogo,
  getExecutiveReportMetrics,
  getReportSchedulingLogo
} from '@/api/reports'
import { useLoading } from '@/hooks/useLoading'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
export default {
  name: 'NewExecutiveReportCommonContainer',
  components: {
    DatatableLoading,
    ExecutiveReportSearchCard,
    ExecutiveReportNewCard
  },
  mixins: [useLoading],
  props: {
    isShowLeftSide: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      renderLeftTab: this.isShowLeftSide,
      defaultCompanyLogo: null,
      search: '',
      cards: [],
      removedCards: {}
    }
  },
  computed: {
    getCards() {
      return this.search ? this.filteredCards : this.cards
    },
    filteredCards() {
      let copyOfCards = JSON.parse(JSON.stringify(this.cards))
      return copyOfCards.filter((card) => {
        card.widgets = card.widgets.filter((chart) => {
          const isChartNameIncludes = chart.name.toLowerCase().includes(this.search.toLowerCase())
          if (isChartNameIncludes) return chart
        })
        return card.widgets.length ? card : null
      })
    },
    hasManagerMetricAdded() {
      return this.cards.some((card) =>
        card.widgets.some((widget) => widget.isSupportManager && widget.isAdded)
      )
    },
    hasNonManagerMetricAdded() {
      return this.cards.some((card) =>
        card.widgets.some((widget) => !widget.isSupportManager && widget.isAdded)
      )
    }
  },
  created() {
    this.callForMetrics()
    this.callForDefaultLogo()
  },
  methods: {
    callForMetrics() {
      this.setLoading(true)
      getExecutiveReportMetrics()
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          this.cards = data.metrics
        })
        .finally(this.setLoading)
    },
    callForDefaultLogo() {
      if (this.isEdit) {
        getExecutiveReportLogo(this.$route.params.id).then((logo) => {
          this.defaultCompanyLogo = new File([logo.data], 'Default Company Logo', {
            type: logo.type
          })
        })
      } else {
        getReportSchedulingLogo(localStorage.getItem('selectedCompanyRequestId')).then((logo) => {
          this.defaultCompanyLogo = new File([logo.data], 'Default Company Logo', {
            type: logo.type
          })
        })
      }
    },
    handleSearchAdd(chart) {
      const isAdded = this.$refs.refCharts.addWidget(chart)
      if (isAdded) this.$set(chart, 'isAdded', true)
      else {
        const domElement = document.querySelector(
          `[parentkey="${chart.description}"][charttype="${chart.chartType}"]`
        )
        if (domElement) {
          const selectedElement = domElement.querySelector('.widget-body__content')
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          })
          if (selectedElement.classList.contains('executive-widget-container--active'))
            selectedElement.classList.remove('executive-widget-container--active')
          setTimeout(() => selectedElement.classList.add('executive-widget-container--active'), 100)
        }
      }
    },
    handleDeleteWidget(deletedWidget) {
      let selectedCard
      this.cards.forEach((card) => {
        const foundedCard = card.widgets.find(
          (widget) =>
            widget.widgetType === deletedWidget.key && widget.chartType === deletedWidget.chartType
        )
        if (foundedCard) selectedCard = foundedCard
      })
      this.$set(selectedCard, 'isAdded', false)
    },
    handleLayoutGet(layout) {
      this.cards.forEach((card) => {
        const foundedCards = card.widgets.filter((widget) => {
          return layout.find((item) => item.resourceId === widget.resourceId)
        })
        if (foundedCards.length)
          foundedCards.forEach((foundedCard) => this.$set(foundedCard, 'isAdded', true))
      })
    }
  }
}
</script>
