<template>
  <KContainer id="enrollments">
    <ElTabs v-model="tab">
      <ElTabPane label="Enrollments" name="enrollments" id="enrollments-content">
        <EnrollmentsSubTabs
          v-if="tab === 'enrollments'"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
        />
        <!--
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
       -->
      </ElTabPane>
      <ElTabPane label="Trash" name="trash" id="trash-content">
        <Trash v-if="tab === 'trash'" />
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import EnrollmentsSubTabs from '@/components/AwarenessEducator/Enrollments/EnrollmentsSubTabs.vue'
import Trash from '@/components/AwarenessEducator/Enrollments/Trash'
import AwarenessEducatorService from '@/api/awarenessEducator'

/*
import EnrollmentsTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTable'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog'
import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal'
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog'

 */
export default {
  name: 'Enrollments',
  components: {
    EnrollmentsSubTabs,
    KContainer,
    Trash
    /*
    SendEnrollmentDialog,
    EditEnrollmentsModal,
    StopEnrollmentDialog,
    DeleteEnrollmentDialog,
    EnrollmentsTable,
    TrainingPreviewDialog,
    StopReminderDialog,
    StopAutoEnrollDialog
     */
  },
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
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages'
    })
  },
  created() {
    this.callForFormDetails()
    this.callForLanguages()
  },
  methods: {
    ...mapActions({
      callForLanguages: 'trainingLibraryHelpers/callForLanguages'
    }),
    callForFormDetails() {
      AwarenessEducatorService.getEnrollmentFormDetails().then((response) => {
        this.enrollmentStatusEnum =
          response?.data?.data?.enumNameValuePairs?.EnrollmentStatusEnum || []
      })
    }
  }
}
</script>
