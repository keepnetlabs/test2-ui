<template>
  <div>
    <TrainingLibraryTrainingPreviewDialog
      v-if="getTrainingPreviewDialog.status"
      v-bind="getTrainingPreviewDialog"
    />
    <TrainingLibraryLearningPathPreviewDialog
      v-if="getLearningPathPreviewDialog.status"
      v-bind="getLearningPathPreviewDialog"
    />
    <TrainingLibraryPosterPreviewDialog
      v-if="getPosterPreviewDialog.status"
      v-bind="getPosterPreviewDialog"
    />
    <TrainingLibraryInfographicPreviewDialog
      v-if="getInfographicPreviewDialog.status"
      v-bind="getInfographicPreviewDialog"
    />
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
    <TrashDeletePermanentlyDialog
      v-if="isShowDeletePermanentlyDialog"
      :status="isShowDeletePermanentlyDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowPermanentlyDeleteDialog"
    />
    <StopEnrollmentDialog
      v-if="isShowStopEnrollmentDialog"
      :status="isShowStopEnrollmentDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowStopEnrollmentDialog"
    />
    <StopReminderDialog
      :status="isStopReminderDialogVisible"
      :is-action-button-disabled="loading"
      @confirm="handleConfirmStopReminder"
      @close="handleCloseStopReminderDialog"
    />
    <StopAutoEnrollDialog
      :status="isStopAutoEnrollDialogVisible"
      :is-action-button-disabled="loading"
      @confirm="handleConfirmStopAutoEnroll"
      @close="handleCloseStopAutoEnrollDialog"
    />
    <ElTabs v-model="tab" :class="['k-sub-tab training-library-first-card-sub-tabs']">
      <ElTabPane
        v-for="(template, index) in tabItems"
        :key="index"
        :name="template.name"
        :label="template.name"
      >
        <EnrollmentsAllTypesTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.ALL_TYPES"
          :ref="`refTable${template.name}`"
          :is-trash="isTrash"
          :show-download-button="!isTrash"
          :api-func="getApiFunc"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
          @on-restore="handleRestoreRowClick"
          @on-permanent-delete="handlePermanentlyDeleteRowClick"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
          @on-view-report="handleRouteToReport"
        />
        <EnrollmentsLearningPathTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.LEARNING_PATH"
          :ref="`refTable${template.name}`"
          :is-trash="isTrash"
          :show-download-button="!isTrash"
          :api-func="getApiFunc"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
          @on-restore="handleRestoreRowClick"
          @on-permanent-delete="handlePermanentlyDeleteRowClick"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
          @on-view-report="handleRouteToReport"
        />
        <EnrollmentsTrainingTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.TRAINING"
          :ref="`refTable${template.name}`"
          :is-trash="isTrash"
          :show-download-button="!isTrash"
          :api-func="getApiFunc"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
          @on-restore="handleRestoreRowClick"
          @on-permanent-delete="handlePermanentlyDeleteRowClick"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
          @on-view-report="handleRouteToReport"
        />
        <EnrollmentsPosterTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.POSTER"
          :ref="`refTable${template.name}`"
          :is-trash="isTrash"
          :show-download-button="!isTrash"
          :api-func="getApiFunc"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
          @on-restore="handleRestoreRowClick"
          @on-permanent-delete="handlePermanentlyDeleteRowClick"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
          @on-view-report="handleRouteToReport"
        />
        <EnrollmentsInfographicTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.INFOGRAPHIC"
          :ref="`refTable${template.name}`"
          :is-trash="isTrash"
          :show-download-button="!isTrash"
          :api-func="getApiFunc"
          :enrollment-status-enum="enrollmentStatusEnum"
          :languages="languages"
          :categories="categories"
          :target-audiences="targetAudiences"
          @on-restore="handleRestoreRowClick"
          @on-permanent-delete="handlePermanentlyDeleteRowClick"
          @on-stop-reminder="handleStopReminder"
          @on-stop-auto-enroll="handleStopAutoEnroll"
          @on-delete="handleDeleteRowClick"
          @on-stop="handleStop"
          @on-send="handleSend"
          @on-edit="handleEditRowClick"
          @on-preview="handlePreviewRowClick"
          @on-download="handleDownloadPackage"
          @on-view-report="handleRouteToReport"
        />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script>
import {
  TRAINING_LIBRARY_PAYLOAD_TYPES,
  TRAINING_LIBRARY_TYPES
} from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
import EnrollmentsAllTypesTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsAllTypesTable.vue'
import EnrollmentsLearningPathTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsLearningPathTable.vue'
import EnrollmentsTrainingTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsTrainingTable.vue'
import EnrollmentsPosterTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsPosterTable.vue'
import EnrollmentsInfographicTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsInfographicTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal.vue'
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog.vue'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog.vue'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog.vue'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog.vue'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog.vue'
import TrainingLibraryInfographicPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'
import TrainingLibraryLearningPathPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreviewDialog.vue'
import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'
import { mapActions, mapGetters } from 'vuex'
import labels from '@/model/constants/labels'
import TrashDeletePermanentlyDialog from '@/components/AwarenessEducator/Enrollments/TrashDeletePermanentlyDialog.vue'
export default {
  name: 'EnrollmentsSubTabs',
  components: {
    TrashDeletePermanentlyDialog,
    TrainingLibraryTrainingPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    TrainingLibraryLearningPathPreviewDialog,
    TrainingLibraryInfographicPreviewDialog,
    EnrollmentsInfographicTable,
    EnrollmentsPosterTable,
    EnrollmentsTrainingTable,
    EnrollmentsLearningPathTable,
    EnrollmentsAllTypesTable,
    SendEnrollmentDialog,
    EditEnrollmentsModal,
    StopEnrollmentDialog,
    DeleteEnrollmentDialog,
    StopReminderDialog,
    StopAutoEnrollDialog
  },
  props: {
    enrollmentStatusEnum: {
      type: Array,
      default: () => []
    },
    languages: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    targetAudiences: {
      type: Array,
      default: () => []
    },
    isTrash: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TRAINING_LIBRARY_TYPES,
      tab: 'All Types',
      tabItems: [
        { name: TRAINING_LIBRARY_TYPES.ALL_TYPES },
        { name: TRAINING_LIBRARY_TYPES.LEARNING_PATH },
        { name: TRAINING_LIBRARY_TYPES.TRAINING },
        { name: TRAINING_LIBRARY_TYPES.POSTER },
        { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC }
      ],
      selectedRow: null,
      isShowEditEnrollmentModal: false,
      isShowSendEnrollmentDialog: false,
      isShowDeleteEnrollmentsDialog: false,
      isShowDeletePermanentlyDialog: false,
      isShowStopEnrollmentDialog: false,
      isShowPreviewDialog: false,
      loading: false,
      isStopAutoEnrollDialogVisible: false,
      isStopReminderDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog'
    }),
    getApiFunc() {
      return this.isTrash
        ? AwarenessEducatorService.searchTrash
        : AwarenessEducatorService.searchEnrollments
    }
  },
  methods: {
    ...mapActions({
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog'
    }),
    handleRestoreRowClick(row) {
      AwarenessEducatorService.restoreEnrollment(row.enrollmentId).then(() => {
        this.$refs[`refTable${this.tab}`][0].callForData()
      })
    },
    toggleShowPermanentlyDeleteDialog(forceUpdate = false) {
      if (forceUpdate && typeof forceUpdate === 'boolean')
        this.$refs[`refTable${this.tab}`].refTable.callForData()
      if (this.isShowDeletePermanentlyDialog) this.selectedRow = null
      this.isShowDeletePermanentlyDialog = !this.isShowDeletePermanentlyDialog
    },
    toggleShowDeleteEnrollmentsDialog(forceUpdate = false) {
      if (forceUpdate) {
        //this.$refs[`refTable${this.tab}`][0].$refs.refTable.unSelectRow(this.selectedRow)
        this.$refs[`refTable${this.tab}`][0].callForData()
      }
      if (this.isShowDeleteEnrollmentsDialog) this.selectedRow = null
      this.isShowDeleteEnrollmentsDialog = !this.isShowDeleteEnrollmentsDialog
    },
    toggleShowStopEnrollmentDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs[`refTable${this.tab}`][0].callForData()
      if (this.isShowStopEnrollmentDialog) this.selectedRow = null
      this.isShowStopEnrollmentDialog = !this.isShowStopEnrollmentDialog
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteEnrollmentsDialog()
    },
    handlePermanentlyDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowPermanentlyDeleteDialog()
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
      if (forceUpdate) this.$refs[`refTable${this.tab}`][0].callForData()
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
        if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
          this.setTrainingPreviewDialog({
            status: true,
            selectedRow: this.selectedRow,
            showSendButton: false
          })
        } else if (
          row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
          row.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
        ) {
          this.setLearningPathPreviewDialog({
            status: true,
            selectedRow: this.selectedRow,
            showSendButton: false
          })
        } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
          this.setPosterPreviewDialog({
            status: true,
            selectedRow: this.selectedRow,
            type: 'poster',
            title: labels.PosterPreview,
            subtitle: '',
            showDetails: true,
            showTabs: true,
            showPosterName: true,
            showFavoriteButton: true,
            showSendButton: false,
            icon: 'mdi-eye'
          })
        } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
          this.setInfographicPreviewDialog({
            status: true,
            selectedRow: this.selectedRow,
            type: 'infographic',
            title: labels.InfographicPreview,
            subtitle: '',
            showDetails: true,
            showTabs: true,
            showPosterName: true,
            showFavoriteButton: true,
            showSendButton: false,
            icon: 'mdi-eye'
          })
        }
      })
    },
    toggleShowSendEnrollmentDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs[`refTable${this.tab}`][0].callForData()
      if (this.isShowSendEnrollmentDialog) this.selectedRow = null
      this.isShowSendEnrollmentDialog = !this.isShowSendEnrollmentDialog
    },
    handleDownloadPackage(row = {}) {
      AwarenessEducatorService.downloadEnrollmentPackage(row.enrollmentId).then((response) => {
        const { data } = response
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(data)
        link.download = `${row.enrollmentId}.zip`
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
          this.$refs[`refTable${this.tab}`][0].callForData()
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
          this.$refs[`refTable${this.tab}`][0].callForData()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCloseStopAutoEnrollDialog() {
      this.isStopAutoEnrollDialogVisible = false
    },
    handleRouteToReport(row) {
      let type = 0
      if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) type = 1
      else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) type = 2
      else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SCREENSAVER) type = 3
      else if (
        row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        row.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        type = 4
      this.$router.push({
        name: row.status === 'SCORM Proxy' ? 'Scorm Proxy Report' : 'Training Report',
        params: {
          id: row.enrollmentId
        },
        query: {
          trainingType: type
        }
      })
    }
  }
}
</script>
