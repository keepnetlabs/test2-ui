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
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteEnrollmentsDialog"
    />
    <StopEnrollmentDialog
      v-if="isShowStopEnrollmentDialog"
      :status="isShowStopEnrollmentDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowStopEnrollmentDialog"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      :languages="languages"
      @on-close="toggleShowPreviewDialog"
    />
    <EnrollmentsTable
      ref="refTable"
      :categories="categories"
      :languages="tableLanguageFilter"
      :target-audiences="targetAudiences"
      :scorm-types="scormTypes"
      :main-languages="languages"
      :enrollmentStatusEnum="enrollmentStatusEnum"
      @on-delete="handleDeleteRowClick"
      @on-stop="handleStop"
      @on-send="handleSend"
      @on-edit="handleEditRowClick"
      @on-preview="handlePreviewRowClick"
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
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'

export default {
  name: 'Enrollments',
  components: {
    EditEnrollmentsModal,
    StopEnrollmentDialog,
    DeleteEnrollmentDialog,
    EnrollmentsTable,
    KContainer,
    TrainingPreviewDialog
  },
  mixins: [useAwarenessHelperCalls],
  data() {
    return {
      isShowDeleteEnrollmentsDialog: false,
      selectedRow: null,
      isShowStopEnrollmentDialog: false,
      isShowEditEnrollmentModal: false,
      isShowPreviewDialog: false,
      enrollmentStatusEnum: []
    }
  },
  created() {
    this.callForFormDetails()
  },
  methods: {
    callForFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        this.enrollmentStatusEnum =
          response?.data?.data?.enumNameValuePairs?.EnrollmentStatusEnum || []
      })
    },
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
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
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
    },
    handlePreviewRowClick(row) {
      AwarenessEducatorService.getEnrollment(row.enrollmentId).then((response) => {
        this.selectedRow = { ...row, trainingId: response?.data?.data?.trainingId }
        this.toggleShowPreviewDialog()
      })
    }
  }
}
</script>
