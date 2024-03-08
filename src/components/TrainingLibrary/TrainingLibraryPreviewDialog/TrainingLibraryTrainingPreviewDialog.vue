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
    title="Training Preview"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isPreviewLoading" :loading="isPreviewLoading" />
      <TrainingLibraryTrainingPreview
        v-if="selectedLanguages.length"
        v-show="!isPreviewLoading"
        :is-loading.sync="isPreviewLoading"
        :name="selectedRow.trainingName"
        :training-id="selectedRow.trainingId"
        :languages="selectedLanguages"
        :training-params="getTrainingParams"
      />
    </template>
    <template #app-dialog-footer>
      <TrainingLibraryPreviewDialogFooter @on-close="handleClose" />
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import TrainingLibraryTrainingPreview from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreview.vue'
import { emptyTrainingPreviewDialogObj } from '@/components/TrainingLibrary/utils'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibraryPreviewDialogFooter from '@/components/TrainingLibrary/TrainingLibraryCommonComponents/TrainingLibraryPreviewDialogFooter.vue'
export default {
  name: 'TrainingLibraryTrainingPreviewDialog',
  components: {
    TrainingLibraryPreviewDialogFooter,
    TrainingLibraryTrainingPreview,
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
    ...mapGetters({ languages: 'trainingLibraryHelpers/getLanguages' }),
    getTrainingParams() {
      if (!this.trainingParams || this.callApi) return this.trainingDetails
      return this.trainingParams
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
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog'
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
      AwarenessEducatorService.getTraining(this.selectedRow.trainingId).then((response) => {
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
      this.setTrainingPreviewDialog(emptyTrainingPreviewDialogObj)
    }
  }
}
</script>
