<template>
  <AppDialog
    v-if="status"
    custom-size="1230"
    max-height
    max-height-size="1200"
    :status="status"
    className="training-preview-dialog"
    icon="mdi-eye"
    size="ultraMaximum"
    title="Learning Path Preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingLibraryLearningPathPreview
        v-else
        ref="refTrainingLibraryLearningPathPreview"
        :is-loading.sync="isPreviewLoading"
        :name="selectedRow.trainingName"
        :training-id="selectedRow.trainingId"
        :learning-path-params="getTrainingParams"
      />
    </template>
    <template #app-dialog-footer>
      <TrainingLibraryPreviewDialogFooter
        :show-send-button="getLearningPathPreviewDialog.showSendButton"
        @on-close="handleClose"
        @on-send="handleSend"
      />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { emptyLearningPathPreviewDialogObj } from '@/components/TrainingLibrary/utils'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter.vue'
import TrainingLibraryLearningPathPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryLearningPathPreview.vue'
import { TRAINING_LIBRARY_MAIN_TABS } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'
export default {
  name: 'TrainingLibraryLearningPathPreviewDialog',
  components: {
    TrainingLibraryLearningPathPreview,
    TrainingLibraryPreviewDialogFooter,
    AppDialog,
    DatatableLoading
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    trainingParams: {
      type: Object
    },
    callApi: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPreviewLoading: false,
      trainingDetails: null
    }
  },
  computed: {
    ...mapGetters({
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog',
      getSelectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    }),
    getTrainingParams() {
      if (!this.trainingParams || this.callApi) return this.trainingDetails
      return this.trainingParams
    }
  },
  created() {
    if (this.callApi) this.callForTrainingDetail()
  },
  methods: {
    ...mapActions({
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setLearningPathSendModal: 'trainingLibrary/setLearningPathSendModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    callForTrainingDetail() {
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingDetails = {
          ...data
        }
      })
    },
    handleClose() {
      if (
        this.$refs.refTrainingLibraryLearningPathPreview.$refs.refFavoriteButton.isFavourite !==
        this.trainingDetails.isFavourite
      ) {
        this.callForTrainingLibrary()
      }
      this.setLearningPathPreviewDialog(emptyLearningPathPreviewDialogObj)
    },
    handleSend() {
      this.setLearningPathSendModal({
        selectedRow: this.selectedRow,
        status: true
      })
      this.handleClose()
    }
  }
}
</script>
