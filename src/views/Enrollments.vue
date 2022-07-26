<template>
  <KContainer tabless id="enrollments">
    <EditEnrollmentsModal
      v-if="isShowEditEnrollmentModal"
      :status="isShowEditEnrollmentModal"
      :selected-row="selectedRow"
      @on-close="toggleShowEditEnrollmentModal"
    />
    <DeleteEnrollmentDialog
      v-if="isShowDeleteEnrollmentsDialog"
      :status="isShowDeleteEnrollmentsDialog"
      @on-close="toggleShowDeleteEnrollmentsDialog"
    />
    <StopEnrollmentDialog
      v-if="isShowStopEnrollmentDialog"
      :status="isShowStopEnrollmentDialog"
      @on-close="toggleShowStopEnrollmentDialog"
    />
    <EnrollmentsTable
      ref="refTable"
      :categories="categories"
      :languages="tableLanguageFilter"
      :target-audiences="targetAudiences"
      :scorm-types="scormTypes"
      @on-delete="handleDeleteRowClick"
      @on-stop="handleStop"
      @on-send="handleSend"
      @on-edit="handleEditRowClick"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import EnrollmentsTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTable'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog'
import useAwarenessHelperCalls from '@/hooks/awareness-educator/useAwarenessHelperCalls'
import AwarenessEducatorService from '@/api/awarenessEducator'
import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal'

export default {
  name: 'Enrollments',
  components: {
    EditEnrollmentsModal,
    StopEnrollmentDialog,
    DeleteEnrollmentDialog,
    EnrollmentsTable,
    KContainer
  },
  mixins: [useAwarenessHelperCalls],
  data() {
    return {
      isShowDeleteEnrollmentsDialog: false,
      selectedRow: null,
      isShowStopEnrollmentDialog: false,
      isShowEditEnrollmentModal: false
    }
  },
  methods: {
    toggleShowDeleteEnrollmentsDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowDeleteEnrollmentsDialog) this.selectedRow = null
      this.isShowDeleteEnrollmentsDialog = !this.isShowDeleteEnrollmentsDialog
    },
    toggleShowStopEnrollmentDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowStopEnrollmentDialog) this.selectedRow = null
      this.isShowStopEnrollmentDialog = !this.isShowStopEnrollmentDialog
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteEnrollmentsDialog()
    },
    handleStop(row) {
      this.selectedRow = row
      this.toggleShowStopEnrollmentDialog()
    },
    handleSend(row) {
      AwarenessEducatorService.sendEnrollment(row.id).then(() => {
        this.$refs.refTable.callForData()
      })
    },
    toggleShowEditEnrollmentModal(forceUpdate) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowEditEnrollmentModal) this.selectedRow = null
      this.isShowEditEnrollmentModal = !this.isShowEditEnrollmentModal
    },
    handleEditRowClick(row) {
      this.selectedRow = row
      this.toggleShowEditEnrollmentModal()
    }
  }
}
</script>
