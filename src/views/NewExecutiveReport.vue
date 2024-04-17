<template>
  <div class="new-executive-report">
    <div class="new-executive-report__left">
      <VTextField
        v-model="search"
        id="input--search-training-library"
        class="executive-reports__header-search"
        ref="searchInput"
        outlined
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        @input="handleDebouncedSearch"
      />
    </div>
    <div class="new-executive-report__right">
      <ExecutiveReportNewCard />
    </div>
  </div>
</template>

<script>
import ExecutiveReportNewCard from '@/components/ExecutiveReports/ExecutiveReportNewCard.vue'

export default {
  name: 'NewExecutiveReport',
  components: { ExecutiveReportNewCard },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    handleDebouncedSearch(value) {}
  }
}
</script>
