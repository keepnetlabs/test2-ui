<template>
  <KContainer id="enrollments">
    <el-tabs v-model="tab">
      <el-tab-pane label="Enrollments" name="enrollments" id="enrollments-content">
        <EditEnrollmentsModal
          v-if="isShowEditEnrollmentModal"
          :status="isShowEditEnrollmentModal"
          :selected-row="selectedRow"
          @on-close="toggleShowEditEnrollmentModal"
        />
        <SendEnrollmentDialog
          v-if="isShowSendEnrollmentDialog"
          :status="isShowSendEnrollmentDialog"
          :selected-row="selectedRow"
          @on-close="toggleShowSendEnrollmentDialog"
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
        <StopReminderDialog
          :status="isStopReminderDialogVisible"
          :isActionButtonDisabled="loading"
          @confirm="handleConfirmStopReminder"
          @close="handleCloseStopReminderDialog"
        />
        <StopAutoEnrollDialog
          :status="isStopAutoEnrollDialogVisible"
          :isActionButtonDisabled="loading"
          @confirm="handleConfirmStopAutoEnroll"
          @close="handleCloseStopAutoEnrollDialog"
        />
        <EnrollmentsTable
          v-if="tab === 'enrollments'"
          ref="refTable"
          :categories="categories"
          :languages="tableLanguageFilter"
          :target-audiences="targetAudiences"
          :scorm-types="scormTypes"
          :main-languages="languages"
          :enrollmentStatusEnum="enrollmentStatusEnum"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
        />
      </el-tab-pane>
      <el-tab-pane label="Trash" name="trash" id="trash-content">
        <Trash v-if="tab === 'trash'" />
      </el-tab-pane>
    </el-tabs>
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
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog'
import Trash from '@/components/AwarenessEducator/Enrollments/Trash'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog'
export default {
  name: 'Enrollments',
  components: {
    Trash,
    SendEnrollmentDialog,
    EditEnrollmentsModal,
    StopEnrollmentDialog,
    DeleteEnrollmentDialog,
    EnrollmentsTable,
    KContainer,
    TrainingPreviewDialog,
    StopReminderDialog,
    StopAutoEnrollDialog
  },
  mixins: [useAwarenessHelperCalls],
  data() {
    return {
      loading: false,
      isStopAutoEnrollDialogVisible: false,
      isStopReminderDialogVisible: false,
      tab: 'enrollments',
      isShowSendEnrollmentDialog: false,
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
      if (forceUpdate) {
        this.$refs.refTable.$refs.refTable.unSelectRow(this.selectedRow)
        this.$refs.refTable.callForData()
      }
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
      this.selectedRow = row
      this.toggleShowSendEnrollmentDialog()
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
    },
    toggleShowSendEnrollmentDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowSendEnrollmentDialog) this.selectedRow = null
      this.isShowSendEnrollmentDialog = !this.isShowSendEnrollmentDialog
    },
    handleDownloadPackage(row = {}) {
      AwarenessEducatorService.downloadEnrollmentPackage(row.enrollmentId).then((response) => {
        const { data } = response
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(data)
        link.download = `${row.enrollmentId}_Scorm.zip`
        link.click()
      })
    },
    handleStopReminder(row) {
      this.selectedRow = row
      this.isStopReminderDialogVisible = true
    },
    handleStopAutoEnroll(row) {
      this.selectedRow = row
      this.isStopAutoEnrollDialogVisible = true
    },
    handleConfirmStopReminder() {
      this.loading = true
      AwarenessEducatorService.stopReminder(this.selectedRow.enrollmentId)
        .then((res) => {
          this.isStopReminderDialogVisible = false
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCloseStopReminderDialog() {
      this.isStopReminderDialogVisible = false
    },
    handleConfirmStopAutoEnroll() {
      this.loading = true
      AwarenessEducatorService.stopAutoEnroll(this.selectedRow.enrollmentId)
        .then((res) => {
          this.isStopAutoEnrollDialogVisible = false
          this.$refs.refTable.callForData()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCloseStopAutoEnrollDialog() {
      this.isStopAutoEnrollDialogVisible = false
    }
  }
}
</script>
