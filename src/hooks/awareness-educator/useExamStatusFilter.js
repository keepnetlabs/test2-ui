import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  data() {
    return {
      examStatusFilters: [
        {
          text: 'First Attempt',
          value: 'FirstAttempt',
          tooltipText: 'Show status for the users’ first exam attempt.'
        },
        {
          text: 'Passed Any Attempt',
          value: 'PassedAnyAttempt',
          tooltipText: 'Show status for the users who have passed the exam in at least one attempt.'
        },
        {
          text: 'Failed Any Attempt',
          value: 'FailedAnyAttempt',
          tooltipText: 'Show status for the users who have failed the exam in at least one attempt.'
        }
      ],
      selectedExamStatusFilter: 'FirstAttempt',
      isExamStatusFilterMenuActive: false
    }
  },
  computed: {
    canRenderExamStatusFilter() {
      return this.trainingSummary?.trainingTypeName === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
    }
  },
  watch: {
    selectedExamStatusFilter: {
      immediate: false,
      handler(val) {
        if (this.trainingSummary && !this.canRenderExamStatusFilter) return
        const examStatusFilterIndex = this.examStatusFilters.findIndex((item) => item.value === val)
        const columnIndex = this.tableOptions.columns.findIndex(
          (column) => column.property === 'examStatus'
        )
        if (columnIndex !== -1 && examStatusFilterIndex !== -1) {
          this.tableOptions.columns[
            columnIndex
          ].label = `Exam Status (${this.examStatusFilters[examStatusFilterIndex].text})`
        }
        this.axiosPayload.showByExamStatus = val
        this.callForData()
      }
    },
    axiosPayload: {
      deep: true,
      handler(val) {
        if (val.showByExamStatus) {
          this.selectedExamStatusFilter = val.showByExamStatus
        }
      }
    }
  }
}
