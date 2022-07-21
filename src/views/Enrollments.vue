<template>
  <KContainer tabless id="enrollments">
    <DeleteEnrollmentDialog
      v-if="isShowEnrollmentsDialog"
      :status="isShowEnrollmentsDialog"
      @on-close="toggleShowEnrollmentsDialog"
    />
    <StopEnrollmentDialog
      v-if="isShowStopEnrollmentDialog"
      :status="isShowStopEnrollmentDialog"
      @on-close="toggleShowStopEnrollmentDialog"
    />
    <EnrollmentsTable ref="refTable" @on-action-delete="handleDeleteRowClick" />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import EnrollmentsTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTable'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog'
export default {
  name: 'Enrollments',
  components: { StopEnrollmentDialog, DeleteEnrollmentDialog, EnrollmentsTable, KContainer },
  data() {
    return {
      isShowEnrollmentsDialog: false,
      selectedRow: null,
      isShowStopEnrollmentDialog: false
    }
  },
  methods: {
    toggleShowEnrollmentsDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowEnrollmentsDialog) this.selectedRow = null
      this.isShowEnrollmentsDialog = !this.isShowEnrollmentsDialog
    },
    toggleShowStopEnrollmentDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowStopEnrollmentDialog) this.selectedRow = null
      this.isShowStopEnrollmentDialog = !this.isShowStopEnrollmentDialog
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowEnrollmentsDialog()
    }
  }
}
</script>
