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
    title="Survey Preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingLibrarySurveyPreview
        v-if="selectedLanguages.length"
        v-show="!isPreviewLoading"
        ref="refTrainingLibraryTrainingPreview"
        :is-loading.sync="isPreviewLoading"
        :name="selectedRow.trainingName"
        :training-id="getTrainingId"
        :languages="selectedLanguages"
        :training-params="getTrainingParams"
      />
    </template>
    <template #app-dialog-footer>
      <TrainingLibraryPreviewDialogFooter
        :show-send-button="showSendButton"
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
import TrainingLibrarySurveyPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibrarySurveyPreview.vue'
import { emptySurveyPreviewDialogObj } from '@/components/TrainingLibrary/utils'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter.vue'
export default {
  name: 'TrainingLibrarySurveyPreviewDialog',
  components: {
    TrainingLibraryPreviewDialogFooter,
    TrainingLibrarySurveyPreview,
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
    showSendButton: {
      type: Boolean,
      default: true
    },
    trainingParams: {
      type: Object
    },
    callApi: {
      type: Boolean,
      default: true
    },
    defaultSelectedLanguages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isPreviewLoading: false,
      selectedLanguages: [],
      trainingDetails: null
    }
  },
  computed: {
    ...mapGetters({
      languages: 'trainingLibraryHelpers/getLanguages',
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getSelectedTrainingContent: 'trainingLibrary/getSelectedTrainingContent'
    }),
    getTrainingParams() {
      if (!this.trainingParams || this.callApi) return this.trainingDetails
      return this.trainingParams
    },
    getTrainingId() {
      return this.selectedRow?.trainingId || this.selectedRow?.detailTrainingId
    }
  },
  watch: {
    defaultSelectedLanguages: {
      immediate: true,
      handler(val) {
        this.selectedLanguages = val
      }
    }
  },
  created() {
    if (this.callApi) this.callForLanguages()
  },
  methods: {
    ...mapActions({
      setSurveyPreviewDialog: 'trainingLibrary/setSurveyPreviewDialog',
      setSurveySendModal: 'trainingLibrary/setSurveySendModal',
      callForTrainingLibrary: 'trainingLibrary/callForTrainingLibrary'
    }),
    callForLanguages() {
      this.isPreviewLoading = true
      this.selectedRow.languages.forEach((lang) => {
        const language = this.languages.find((item) => item.code === lang)
        if (language)
          this.selectedLanguages.push({
            text: language.name,
            value: language.id,
            code: language.code
          })
      })
      this.callForTrainingDetail()
    },
    callForTrainingDetail() {
      AwarenessEducatorService.getTraining(
        this.selectedRow?.trainingId || this.selectedRow?.detailTrainingId
      ).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingDetails = {
          ...data,
          languages: this.selectedLanguages.map((lang) => lang.text).join(', ')
        }
      })
    },
    handleClose() {
      if (
        this?.$refs?.refTrainingLibraryTrainingPreview?.$refs?.refFavoriteButton?.isFavourite !==
        this.trainingDetails?.isFavourite
      ) {
        this.callForTrainingLibrary()
      }
      this.setSurveyPreviewDialog(emptySurveyPreviewDialogObj)
      this.$emit('close')
    },
    handleSend() {
      this.handleClose()
      this.setSurveySendModal({
        selectedRow: this.selectedRow,
        status: true
      })
    }
  }
}
</script>
