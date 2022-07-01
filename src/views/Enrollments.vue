<template>
  <KContainer tabless id="enrollments">
    <DeleteEnrollmentDialog
      v-if="isShowEnrollmentsDialog"
      :status="isShowEnrollmentsDialog"
      @on-close="toggleShowEnrollmentsDialog"
    />
    <EnrollmentsTable ref="refTable" @on-action-delete="handleDeleteRowClick" />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import EnrollmentsTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTable'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog'
export default {
  name: 'Enrollments',
  components: { DeleteEnrollmentDialog, EnrollmentsTable, KContainer },
  data() {
    return {
      isShowEnrollmentsDialog: false,
      selectedRow: null
    }
  },
  methods: {
    toggleShowEnrollmentsDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowEnrollmentsDialog) this.selectedRow = null
      this.isShowEnrollmentsDialog = !this.isShowEnrollmentsDialog
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowEnrollmentsDialog()
    }
  }
}
</script>
