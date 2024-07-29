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
        @input="handleSearch"
      />
      <div v-if="!isLoading" class="executive-report-search-card-container mt-4">
        <ExecutiveReportSearchCard
          v-for="card in getCards"
          :key="card.name"
          :card="card"
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
        @on-edit="renderLeftTab = true"
        @on-edit-cancel="renderLeftTab = false"
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
  components: { DatatableLoading, ExecutiveReportSearchCard, ExecutiveReportNewCard },
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
    handleSearch(value) {},
    handleSearchAdd(chart) {
      this.$refs.refCharts.addWidget(chart)
    }
  }
}
</script>
