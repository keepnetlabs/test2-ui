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
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog'
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
      setLearningPathSendModal: 'trainingLibrary/setLearningPathSendModal'
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
