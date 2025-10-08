<template>
  <div>
    <!-- Unified Drawer for Training, Poster, Infographic, Survey -->
    <TrainingLibraryDrawer
      v-if="currentDrawer.status"
      :value="currentDrawer.status"
      :type="currentDrawer.type"
      :training-data="currentDrawer.selectedRow"
      :only-preview="true"
      @input="handleDrawerClose"
      @delete-success="handleDeleteSuccess"
      @duplicate-success="handleDuplicateSuccess"
    />

    <!-- Nested Drawer (Related Preview) -->
    <TrainingLibraryDrawer
      v-if="getNestedDrawer.status"
      :value="getNestedDrawer.status"
      :type="getNestedDrawer.type"
      :training-data="getNestedDrawer.selectedRow"
      :is-nested="true"
      :only-preview="true"
      width="calc(100% - 144px)"
      @input="handleNestedDrawerClose"
      @close-parent="handleCloseParentDrawer"
    />

    <!-- Deep Nested Drawer (Related Preview in Nested) -->
    <TrainingLibraryDrawer
      v-if="getDeepNestedDrawer.status"
      :value="getDeepNestedDrawer.status"
      :type="getDeepNestedDrawer.type"
      :training-data="getDeepNestedDrawer.selectedRow"
      :is-deep-nested="true"
      :only-preview="true"
      width="calc(100% - 216px)"
      @input="handleDeepNestedDrawerClose"
      @close-parent="handleCloseAllDrawers"
    />

    <!-- Lightbox for Preview -->
    <TrainingLibraryLightbox :value="getLightbox.status" @input="handleLightboxClose">
      <TrainingLibraryLightboxContent
        :preview-data="getLightbox.previewData"
        :is-loading="getLightbox.isLoading"
        :type="getLightbox.type"
      />
    </TrainingLibraryLightbox>
    <EditEnrollmentsModal
      v-if="isShowEditEnrollmentModal"
      :status="isShowEditEnrollmentModal"
      :selected-row="selectedRow"
      :title="getEditEnrollmentsModalTitle"
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
        <EnrollmentsSurveyTable
          v-if="tab === template.name && template.name === TRAINING_LIBRARY_TYPES.SURVEY"
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
import EnrollmentsSurveyTable from '@/components/AwarenessEducator/Enrollments/EnrollmentsTables/EnrollmentsSurveyTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import EditEnrollmentsModal from '@/components/AwarenessEducator/Enrollments/EditEnrollmentsModal.vue'
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog.vue'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog.vue'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog.vue'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog.vue'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog.vue'
import TrainingLibraryDrawer from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawer.vue'
import TrainingLibraryLightbox from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightbox.vue'
import TrainingLibraryLightboxContent from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryLightboxContent.vue'
import { mapActions, mapGetters } from 'vuex'
import labels from '@/model/constants/labels'
import TrashDeletePermanentlyDialog from '@/components/AwarenessEducator/Enrollments/TrashDeletePermanentlyDialog.vue'
export default {
  name: 'EnrollmentsSubTabs',
  components: {
    TrashDeletePermanentlyDialog,
    TrainingLibraryDrawer,
    TrainingLibraryLightbox,
    TrainingLibraryLightboxContent,
    EnrollmentsSurveyTable,
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
        { name: TRAINING_LIBRARY_TYPES.INFOGRAPHIC },
        { name: TRAINING_LIBRARY_TYPES.SURVEY }
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
  created() {
    this.resetAllModals()
  },
  computed: {
    ...mapGetters({
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getScreensaverPreviewDialog: 'trainingLibrary/getScreensaverPreviewDialog',
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog',
      getSurveyPreviewDialog: 'trainingLibrary/getSurveyPreviewDialog',
      getLightbox: 'trainingLibrary/getLightbox',
      getNestedDrawer: 'trainingLibrary/getNestedDrawer',
      getDeepNestedDrawer: 'trainingLibrary/getDeepNestedDrawer'
    }),
    currentDrawer() {
      if (this.getTrainingPreviewDialog.status) {
        return {
          status: this.getTrainingPreviewDialog.status,
          type: this.getTrainingPreviewDialog.type,
          selectedRow: this.getTrainingPreviewDialog.selectedRow,
          dialogType: 'training'
        }
      }
      if (this.getPosterPreviewDialog.status) {
        return {
          status: this.getPosterPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.POSTER,
          selectedRow: this.getPosterPreviewDialog.selectedRow,
          dialogType: 'poster'
        }
      }
      if (this.getInfographicPreviewDialog.status) {
        return {
          status: this.getInfographicPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.INFOGRAPHIC,
          selectedRow: this.getInfographicPreviewDialog.selectedRow,
          dialogType: 'infographic'
        }
      }
      if (this.getScreensaverPreviewDialog && this.getScreensaverPreviewDialog.status) {
        return {
          status: this.getScreensaverPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.SCREENSAVER,
          selectedRow: this.getScreensaverPreviewDialog.selectedRow,
          dialogType: 'screensaver'
        }
      }
      if (this.getSurveyPreviewDialog.status) {
        return {
          status: this.getSurveyPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.SURVEY,
          selectedRow: this.getSurveyPreviewDialog.selectedRow,
          dialogType: 'survey'
        }
      }
      if (this.getLearningPathPreviewDialog.status) {
        return {
          status: this.getLearningPathPreviewDialog.status,
          type: TRAINING_LIBRARY_TYPES.LEARNING_PATH,
          selectedRow: this.getLearningPathPreviewDialog.selectedRow,
          dialogType: 'learningPath'
        }
      }
      return {
        status: false,
        type: null,
        selectedRow: null,
        dialogType: null
      }
    },
    getApiFunc() {
      return this.isTrash
        ? AwarenessEducatorService.searchTrash
        : AwarenessEducatorService.searchEnrollments
    },

    getEditEnrollmentsModalTitle() {
      if (this.selectedRow.hasQuiz) return 'Edit Survey Enrollment'
      if (this.selectedRow.type === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return 'Edit Poster Enrollment'
      else if (this.selectedRow.type === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return 'Edit Infographic Enrollment'
      else if (
        this.selectedRow.type === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.selectedRow.type === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return 'Edit Learning Path Enrollment'
      return 'Edit Training Enrollment'
    }
  },
  methods: {
    ...mapActions({
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setSurveyPreviewDialog: 'trainingLibrary/setSurveyPreviewDialog',
      resetAllModals: 'trainingLibrary/resetAllModals'
    }),
    handleLightboxClose(value) {
      if (!value) {
        this.$store.commit('trainingLibrary/SET_LIGHTBOX', {
          status: false,
          previewData: null,
          isLoading: false,
          type: null
        })
      }
    },
    handleDrawerClose(value) {
      if (!value) {
        if (this.currentDrawer.dialogType === 'training') {
          this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null,
            showSendButton: true,
            type: TRAINING_LIBRARY_TYPES.TRAINING
          })
        } else if (this.currentDrawer.dialogType === 'poster') {
          this.$store.commit('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'infographic') {
          this.$store.commit('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'screensaver') {
          this.$store.commit('trainingLibrary/SET_SCREENSAVER_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'survey') {
          this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        } else if (this.currentDrawer.dialogType === 'learningPath') {
          this.$store.commit('trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG', {
            status: false,
            selectedRow: null
          })
        }
      }
    },
    handleNestedDrawerClose(value) {
      if (!value) {
        this.$store.commit('trainingLibrary/SET_NESTED_DRAWER', {
          status: false,
          selectedRow: null,
          type: null
        })
      }
    },
    handleCloseParentDrawer() {
      this.$store.commit('trainingLibrary/SET_NESTED_DRAWER', {
        status: false,
        selectedRow: null,
        type: null
      })
      if (this.currentDrawer.dialogType === 'training') {
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING
        })
      } else if (this.currentDrawer.dialogType === 'poster') {
        this.$store.commit('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'infographic') {
        this.$store.commit('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'screensaver') {
        this.$store.commit('trainingLibrary/SET_SCREENSAVER_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'survey') {
        this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'learningPath') {
        this.$store.commit('trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      }
    },
    handleDeepNestedDrawerClose(value) {
      if (!value) {
        this.$store.commit('trainingLibrary/SET_DEEP_NESTED_DRAWER', {
          status: false,
          selectedRow: null,
          type: null
        })
      }
    },
    handleCloseAllDrawers() {
      this.$store.commit('trainingLibrary/SET_DEEP_NESTED_DRAWER', {
        status: false,
        selectedRow: null,
        type: null
      })
      this.$store.commit('trainingLibrary/SET_NESTED_DRAWER', {
        status: false,
        selectedRow: null,
        type: null
      })
      if (this.currentDrawer.dialogType === 'training') {
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING
        })
      } else if (this.currentDrawer.dialogType === 'poster') {
        this.$store.commit('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'infographic') {
        this.$store.commit('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'screensaver') {
        this.$store.commit('trainingLibrary/SET_SCREENSAVER_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'survey') {
        this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      } else if (this.currentDrawer.dialogType === 'learningPath') {
        this.$store.commit('trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null
        })
      }
    },
    handleDeleteSuccess() {
      if (this.$refs && this.$refs[`refTable${this.tab}`] && this.$refs[`refTable${this.tab}`][0]) {
        this.$refs[`refTable${this.tab}`][0].callForData()
      }
    },
    handleDuplicateSuccess() {
      if (this.$refs && this.$refs[`refTable${this.tab}`] && this.$refs[`refTable${this.tab}`][0]) {
        this.$refs[`refTable${this.tab}`][0].callForData()
      }
    },
    handleRestoreRowClick(row) {
      AwarenessEducatorService.restoreEnrollment(row.enrollmentId).then(() => {
        this.$refs[`refTable${this.tab}`][0].callForData()
      })
    },
    toggleShowPermanentlyDeleteDialog(forceUpdate = false) {
      if (forceUpdate && typeof forceUpdate === 'boolean')
        if (this.$refs?.[`refTable${this.tab}`]?.refTable) {
          this.$refs[`refTable${this.tab}`].refTable.callForData()
        }
      if (this.isShowDeletePermanentlyDialog) this.selectedRow = null
      this.isShowDeletePermanentlyDialog = !this.isShowDeletePermanentlyDialog
    },
    toggleShowDeleteEnrollmentsDialog(forceUpdate = false) {
      if (forceUpdate) {
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
        this.selectedRow = {
          ...row,
          trainingId: response?.data?.data?.trainingId
        }
        if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.SURVEY || row.hasQuiz) {
          this.setSurveyPreviewDialog({
            status: true,
            selectedRow: this.selectedRow,
            showSendButton: false
          })
        } else if (row.type === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING) {
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
        .then(() => {
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
        .then(() => {
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
  },
  beforeRouteLeave(to, from, next) {
    this.resetAllModals()
    next()
  }
}
</script>
