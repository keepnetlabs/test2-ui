<template>
  <KContainer id="executive-reports" tabless>
    <ExecutiveReportScheduleReportDialog
      v-if="isShowScheduleReportDialog"
      :status="isShowScheduleReportDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowScheduleReportDialog"
    />
    <ExecutiveReportDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteDialog"
    />
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
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <template v-else>
        <ExecutiveReportsCard
          v-for="(card, index) in cards"
          :key="index"
          :card="card"
          @on-schedule="toggleShowScheduleReportDialog"
          @on-delete="toggleShowDeleteDialog"
        />
      </template>
    </div>
  </KContainer>
</template>
<script>
import KContainer from '@/components/KContainer/KContainer.vue'
import useDebounce from '@/hooks/useDebounce'
import ExecutiveReportsCard from '@/components/ExecutiveReports/ExecutiveReportsCard.vue'
import { getDefaultAxiosPayload } from '@/utils/functions'
import ReportsService from '@/api/reports'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import ExecutiveReportDeleteDialog from '@/components/ExecutiveReports/ExecutiveReportDeleteDialog.vue'
import { useLoading } from '@/hooks/useLoading'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
export default {
  name: 'ExecutiveReports',
  components: {
    DatatableLoading,
    ExecutiveReportDeleteDialog,
    ExecutiveReportScheduleReportDialog,
    ExecutiveReportsCard,
    KContainer
  },
  mixins: [useDebounce, useLoading],
  data() {
    return {
      search: '',
      axiosPayload: getDefaultAxiosPayload(),
      cards: [],
      isShowScheduleReportDialog: false,
      isShowDeleteDialog: false,
      selectedRow: null
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      this.setLoading(true)
      ReportsService.getExecutiveReports(this.search)
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          this.cards = data
        })
        .finally(this.setLoading)
    },
    handleDebouncedSearch(value) {
      this.search = value
      this.debounce(() => {
        this.callForData(value)
      })
    },
    routeToNewExecutiveReport() {
      this.$router.push({ name: 'New Executive Report' })
    },
    toggleShowScheduleReportDialog(row = {}) {
      this.selectedRow = row
      this.isShowScheduleReportDialog = !this.isShowScheduleReportDialog
    },
    toggleShowDeleteDialog(row = {}, forceUpdate = false) {
      this.selectedRow = row
      this.isShowDeleteDialog = !this.isShowDeleteDialog
      if (forceUpdate) this.callForData()
    }
  }
}
</script>
