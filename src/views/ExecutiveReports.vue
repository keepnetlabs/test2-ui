<template>
  <KContainer id="executive-reports" tabless>
    <div class="executive-reports__header">
      <VTextField
        id="input--search-training-library"
        class="executive-reports__header-search"
        ref="searchInput"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        :value="search"
        @input="handleDebouncedSearch"
      />
      <VTooltip bottom opacity="1">
        <template #activator="{ on: tooltip }">
          <VBtn
            v-on="{ ...tooltip }"
            id="btn-add--training-library"
            class="training-library-new-btn"
            rounded
            color="#2196f3"
            @click="routeToNewExecutiveReport"
          >
            <v-icon color="#fff">mdi-plus</v-icon>
            <span class="training-library-new-btn__text">NEW</span>
          </VBtn>
        </template>
        <span class="tooltip-span">Add Executive Report</span>
      </VTooltip>
    </div>
    <div class="executive-reports__body">
      <ExecutiveReportsCard v-for="card in cards" :key="card.name" :card="card" />
    </div>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import useDebounce from '@/hooks/useDebounce'
import ExecutiveReportsCard from '@/components/ExecutiveReports/ExecutiveReportsCard.vue'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ReportsService from '@/api/reports'
export default {
  name: 'ExecutiveReports',
  components: { ExecutiveReportsCard, KContainer },
  mixins: [useDebounce],
  data() {
    return {
      search: '',
      axiosPayload: getDefaultAxiosPayload(),
      cards: []
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      ReportsService.getExecutiveReports().then((response) => {
        const {
          data: { data }
        } = response || {}
        this.cards = data
      })
    },
    handleDebouncedSearch(value) {
      this.search = value
      this.debounce(() => {
        this.handleSearch(value)
      })
    },
    handleSearch(value) {},
    routeToNewExecutiveReport() {
      this.$router.push({ name: 'New Executive Report' })
    }
  }
}
</script>
