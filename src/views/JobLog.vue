<template>
  <KContainer tabless id="campaign-reports">
    <JobLogTable ref="refTable" @onDetails="handleDetailsClick" />
    <JobLogDetailsTable
      v-if="isShowDetails"
      :status="isShowDetails"
      :selectedRow="selectedRow"
      @onClose="toggleShowDetailsTable"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import JobLogTable from '@/components/JobLog/JobLogTable'
import JobLogDetailsTable from '@/components/JobLog/JobLogDetailsTable'

export default {
  name: 'JobLog',
  components: { KContainer, JobLogTable, JobLogDetailsTable },
  data() {
    return {
      isShowDetails: false,
      selectedRow: null
    }
  },
  methods: {
    toggleShowDetailsTable() {
      if (this.isShowDetails) {
        this.selectedRow = null
      }
      this.isShowDetails = !this.isShowDetails
    },
    handleDetailsClick(row = {}) {
      this.selectedRow = row
      this.toggleShowDetailsTable()
    }
  }
}
</script>
